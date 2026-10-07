import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import PasswordInput from "./password-input.tsx";

function renderPasswordInput() {
  render(
    <label>
      Contraseña
      <PasswordInput />
    </label>,
  );
}

test("oculta la contraseña al empezar", () => {
  renderPasswordInput();

  expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
    "type",
    "password",
  );
  expect(
    screen.getByRole("button", { name: "Mostrar contraseña" }),
  ).toBeInTheDocument();
});

test("muestra la contraseña al apretar el botón", async () => {
  const user = userEvent.setup();

  renderPasswordInput();

  await user.click(screen.getByRole("button", { name: "Mostrar contraseña" }));

  expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "text");
  expect(
    screen.getByRole("button", { name: "Ocultar contraseña" }),
  ).toBeInTheDocument();
});
