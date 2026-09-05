-- migrate:up
ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_cart_id_product_id_unique UNIQUE (cart_id, product_id);

-- migrate:down
ALTER TABLE cart_items
  DROP CONSTRAINT cart_items_cart_id_product_id_unique;

