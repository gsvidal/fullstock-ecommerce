import { Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../providers/auth-provider";
import { useCart } from "../../providers/cart-provider";
import { useEffect } from "react";
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
import { ApiError } from "../../lib/api-error";
import { formatPrice } from "../../lib/format-price";
import { createOrder } from "../../services";
import { applyServerFieldErrors } from "../../lib/apply-server-field-errors";
import {
  checkoutSchema,
  type CheckoutFormValues,
  type CheckoutFormInput,
} from "../../schemas/checkout";
import { COUNTRIES, SHIPPING_FIELDS } from "./fields";
import styles from "./styles.module.css";

export default function CheckoutPage() {
  const { cart, status: cartStatus, refresh } = useCart();
  const { user, status: authStatus } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Checkout");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      email: user?.email ?? "",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      country: "",
      region: "",
      zipCode: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user?.email, setValue]);

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

  async function onSubmit(shippingInfo: CheckoutFormValues) {
    try {
      const order = await createOrder(shippingInfo);
      navigate(`/order-confirmation?orderId=${order.id}`);
      await refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        applyServerFieldErrors(error.fields, setError);
      } else if (error instanceof ApiError && error.status === 400) {
        setError("root", { message: error.message });
      } else {
        console.error(error);
        setError("root", {
          message: "No pudimos procesar tu orden. Intenta de nuevo.",
        });
      }
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
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset>
              <legend className={styles["checkout__legend"]}>
                Información de contacto
              </legend>
              <InputField
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                required
                readOnly={user !== null}
                error={errors.email?.message}
                {...register("email")}
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
                      autoComplete={field.autoComplete}
                      required={field.required}
                      error={errors[field.name]?.message}
                      {...register(field.name)}
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
                      autoComplete={field.autoComplete}
                      required={field.required}
                      error={errors[field.name]?.message}
                      {...register(field.name)}
                    />
                  ),
                )}
              </div>
            </fieldset>

            <Button
              type="submit"
              size="xl"
              className={styles["checkout__submit"]}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar Orden"}
            </Button>

            {errors.root?.message && (
              <p className={styles["checkout__error"]} role="alert">
                {errors.root.message}
              </p>
            )}
          </form>
        </div>
      </Container>
    </Section>
  );
}
