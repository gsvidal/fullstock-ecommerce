import {
  data,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Button,
  Container,
  InputField,
  Section,
  SelectField,
  Separator,
} from "../../components/ui";
import { XIcon } from "../../components/ui/icons";
import { useCurrentUser, useDocumentTitle } from "../../hooks";
import { ApiError } from "../../lib/api-error";
import { formatPrice } from "../../lib/format-price";
import { createOrder, getCart } from "../../services";
import { applyServerFieldErrors } from "../../lib/apply-server-field-errors";
import {
  checkoutSchema,
  type CheckoutFormValues,
  type CheckoutFormInput,
} from "../../schemas/checkout";
import { COUNTRIES, SHIPPING_FIELDS } from "./fields";
import z from "zod";
import { logError } from "../../lib/log-error";

export async function loader() {
  try {
    const cart = await getCart();

    if (cart === null || cart.items.length === 0) {
      return redirect("/cart");
    }

    return { cart };
  } catch (error) {
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }

    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fields: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const order = await createOrder(parsed.data);

    return redirect(`/order-confirmation?orderId=${order.id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.fields) {
      return { fields: error.fields };
    }
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404 || error.status === 409)
    ) {
      return redirect("/cart");
    }

    logError(error);

    return { root: "No pudimos procesar tu orden. Intenta de nuevo." };
  }
}

export default function CheckoutPage() {
  const user = useCurrentUser();
  const { cart } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useDocumentTitle("Checkout");
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting = navigation.state !== "idle";

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  useEffect(() => {
    if (actionData?.fields) applyServerFieldErrors(actionData.fields, setError);
    if (actionData?.root) setError("root", { message: actionData.root });
  }, [actionData, setError]);

  function onSubmit(
    _values: CheckoutFormValues,
    event?: React.BaseSyntheticEvent,
  ) {
    const form = event?.target;

    submit(form, { method: "post", replace: true });
  }

  return (
    <Section className="bg-muted-background">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col gap-12 lg:max-w-none lg:flex-row lg:items-start">
          <div className="grow lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <h2 className="mb-4 text-lg font-medium">Resumen de la orden</h2>
            <div className="flex flex-col rounded-xl border border-border bg-background">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 border-b border-b-border p-6"
                >
                  <div className="w-20 rounded-xl bg-muted-background">
                    <img
                      src={item.product.imgSrc}
                      alt={item.product.title}
                      className="aspect-square w-full object-contain"
                    />
                  </div>
                  <div className="flex grow flex-col justify-between">
                    <h3 className="text-sm">{item.product.title}</h3>
                    <div className="flex items-center gap-4 self-end text-sm font-medium">
                      <p>{item.quantity}</p>
                      <XIcon className="size-4 text-muted-foreground" />
                      <p>{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between p-6 text-base font-medium">
                <p>Total</p>
                <p>{formatPrice(cart.totalPrice)}</p>
              </div>
            </div>
          </div>
          <form
            className="grow lg:order-first lg:max-w-4xl"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset className="block w-full">
              <legend className="mb-6 text-xl font-medium">
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

            <Separator className="my-6" />

            <fieldset className="block w-full">
              <legend className="mb-6 text-xl font-medium">
                Información de envío
              </legend>
              <div className="flex flex-col gap-6">
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
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar Orden"}
            </Button>

            {errors.root?.message && (
              <p className="mt-6 text-center text-sm text-error" role="alert">
                {errors.root.message}
              </p>
            )}
          </form>
        </div>
      </Container>
    </Section>
  );
}
