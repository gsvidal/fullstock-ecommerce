-- migrate:up
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    img_src TEXT NOT NULL,
    alt TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO categories (title, slug, img_src, alt, description)
VALUES
  ('Polos', 'polos', '/images/polos.jpg', 'Hombre luciendo polo azul', 'Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.'),
  ('Tazas', 'tazas', '/images/tazas.jpg', 'Tazas con diseño de código', 'Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación.'),
  ('Stickers', 'stickers', '/images/stickers.jpg', 'Stickers de desarrollo web', 'Personaliza tu espacio de trabajo con nuestros stickers únicos y muestra tu amor por el desarrollo web.');

-- migrate:down
DROP TABLE categories;
