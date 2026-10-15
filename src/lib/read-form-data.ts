import { data } from "react-router";

export async function readFormData(request: Request): Promise<FormData> {
  return request.formData().catch(() => {
    throw data("Se esperaba un formulario", { status: 400 });
  });
}
