import { useState, type SubmitEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../../providers/auth-provider";
import { useCart } from "../../providers/cart-provider";
import {
  Button,
  Container,
  InputField,
  MessageScreen,
  Section,
  SelectField,
  Separator,
  Spinner,
} from "../../components/ui";
import { XIcon } from "../../components/ui/icons";
import { useDocumentTitle } from "../../hooks";
import { ApiError, type FieldErrors } from "../../lib/api-error";
import { formatPrice } from "../../lib/format-price";
import { createOrder } from "../../services";
import type { ShippingInfo } from "../../types";
import { COUNTRIES, SHIPPING_FIELDS } from "./fields";
import styles from "./styles.module.css";

export default function CheckoutPage() {
  const { cart, status: cartStatus, refresh } = useCart();
  const { user, status: authStatus } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Checkout");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartStatus === "error" || authStatus === "error") {
    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar los datos de tu compra."
      >
        <Button size="lg" onClick={() => window.location.reload()}>
          Recargar la página
        </Button>
      </MessageScreen>
    );
  }

  if (cartStatus === "loading" || authStatus === "loading") {
    return <Spinner />;
  }

  if (cart === null || cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = Object.fromEntries(formData);

    const shippingInfo: ShippingInfo = {
      email: String(values.email),
      firstName: String(values.firstName),
      lastName: String(values.lastName),
      // La compañía es opcional: si viene vacía, enviamos null.
      company:
        String(values.company).trim() === "" ? null : String(values.company),
      address: String(values.address),
      city: String(values.city),
      country: String(values.country),
      region: String(values.region),
      zipCode: String(values.zipCode),
      phone: String(values.phone),
    };

    setFieldErrors(null);
    setFormError(null);
    setIsSubmitting(true);
    try {
      const order = await createOrder(shippingInfo);
      navigate(`/order-confirmation?orderId=${order.id}`);
      await refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        setFieldErrors(error.fields);
      } else {
        console.error(error);
        setFormError("No pudimos procesar tu orden. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section className={styles["checkout"]}>
      <Container>
        <div className={styles["checkout__layout"]}>
          <div className={styles["checkout__summary"]}>
            <h2 className={styles["checkout__summary-title"]}>
              Resumen de la orden
            </h2>
            <div className={styles["checkout__summary-container"]}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles["checkout__item"]}>
                  <div className={styles["checkout__item-image"]}>
                    <img
                      src={item.product.imgSrc}
                      alt={item.product.title}
                      className={styles["checkout__item-image-content"]}
                    />
                  </div>
                  <div className={styles["checkout__item-details"]}>
                    <h3 className={styles["checkout__item-title"]}>
                      {item.product.title}
                    </h3>
                    <div className={styles["checkout__item-price"]}>
                      <p>{item.quantity}</p>
                      <XIcon className={styles["checkout__item-price-icon"]} />
                      <p>{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles["checkout__total"]}>
                <p>Total</p>
                <p>{formatPrice(cart.totalPrice)}</p>
              </div>
            </div>
          </div>
          <form
            className={styles["checkout__form"]}
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
              <legend className={styles["checkout__legend"]}>
                Información de contacto
              </legend>
              <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={user?.email ?? ""}
                readOnly={user !== null}
                errors={fieldErrors?.email}
              />
            </fieldset>

            <Separator className={styles["checkout__separator"]} />

            <fieldset>
              <legend className={styles["checkout__legend"]}>
                Información de envío
              </legend>
              <div className={styles["checkout__form-fields"]}>
                {SHIPPING_FIELDS.map((field) =>
                  "type" in field && field.type === "select" ? (
                    <SelectField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      autoComplete={field.autoComplete}
                      defaultValue=""
                      required={field.required}
                      errors={fieldErrors?.[field.name]}
                    >
                      <option value="" disabled>
                        Seleccionar país
                      </option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </SelectField>
                  ) : (
                    <InputField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      autoComplete={field.autoComplete}
                      required={field.required}
                      errors={fieldErrors?.[field.name]}
                    />
                  ),
                )}
              </div>
            </fieldset>

            {formError && (
              <p className={styles["checkout__error"]} role="alert">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              size="xl"
              className={styles["checkout__submit"]}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar Orden"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
