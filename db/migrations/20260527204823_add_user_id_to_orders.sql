-- migrate:up
ALTER TABLE orders
  ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE orders DROP COLUMN user_id;

