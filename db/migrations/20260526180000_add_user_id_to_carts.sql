-- migrate:up
ALTER TABLE carts
  ADD COLUMN user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE;

-- migrate:down
ALTER TABLE carts DROP COLUMN user_id;
