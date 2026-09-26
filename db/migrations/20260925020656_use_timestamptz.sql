-- migrate:up
ALTER TABLE categories
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE order_items
  ALTER COLUMN created_at TYPE timestamptz;

ALTER TABLE products
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE carts
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE cart_items
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE orders
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE users
  ALTER COLUMN created_at TYPE timestamptz,
  ALTER COLUMN updated_at TYPE timestamptz;

ALTER TABLE "session"
  ALTER COLUMN expire TYPE timestamptz;

-- migrate:down
ALTER TABLE categories
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE order_items
  ALTER COLUMN created_at TYPE timestamp;

ALTER TABLE products
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE carts
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE cart_items
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE orders
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE users
  ALTER COLUMN created_at TYPE timestamp,
  ALTER COLUMN updated_at TYPE timestamp;

ALTER TABLE "session"
  ALTER COLUMN expire TYPE timestamp;
