import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";
import * as userRepository from "../repositories/user.repository.ts";
import { resolveCartId } from "./cart.service.ts";

function createUser() {
  return userRepository.create(`merge-${randomUUID()}@example.com`, "hash");
}

async function productId(slug: string) {
  const product = await productRepository.findBySlug(slug);
  if (product === null) throw new Error(`No existe el producto ${slug}`);
  return product.id;
}

test("suma al carrito de la cuenta lo que se agregó como invitado", async () => {
  // Setup o Arrange
  const user = await createUser();
  const poloId = await productId("polo-react");
  const tazaId = await productId("taza-javascript");

  const userCart = await cartRepository.create(user.id);
  await cartItemRepository.create({
    cartId: userCart.id,
    productId: poloId,
    quantity: 1,
  });

  const visitorCart = await cartRepository.create();
  await cartItemRepository.create({
    cartId: visitorCart.id,
    productId: poloId,
    quantity: 2,
  });
  await cartItemRepository.create({
    cartId: visitorCart.id,
    productId: tazaId,
    quantity: 1,
  });

  // Act
  const cartId = await resolveCartId(visitorCart.id, user.id);

  // Assertions
  expect(cartId).toBe(userCart.id);
  const items = await cartItemRepository.getByCartId(userCart.id);
  expect(items).toHaveLength(2);

  expect(items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ productId: poloId, quantity: 3 }),
      expect.objectContaining({ productId: tazaId, quantity: 1 }),
    ]),
  );

  expect(await cartRepository.findById(visitorCart.id)).toBeNull();
});

test("le pasa el carrito de invitado a una cuenta que no tenía", async () => {
  // Setup o Arrange
  const user = await createUser();
  const visitorCart = await cartRepository.create();
  await cartItemRepository.create({
    cartId: visitorCart.id,
    productId: await productId("polo-react"),
    quantity: 1,
  });

  // Act
  const cartId = await resolveCartId(visitorCart.id, user.id);

  // Assertions
  expect(cartId).toBe(visitorCart.id);
  expect(await cartRepository.findById(visitorCart.id)).toMatchObject({
    userId: user.id,
  });
});
