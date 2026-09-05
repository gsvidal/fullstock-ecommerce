-- migrate:up
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    img_src TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (title, slug, img_src, price, description, category_id, features)
VALUES
	('Polo React', 'polo-react', '/images/polos/polo-react.png', 2000, 'Viste tu pasión por React con estilo y comodidad en cada línea de código.', 1, '{"Estampado resistente que mantiene sus colores vibrantes lavado tras lavado.", "Hecho de algodón suave que asegura comodidad y frescura.", "Costuras reforzadas para una mayor durabilidad.", "Corte moderno que se adapta perfectamente al cuerpo."}'),
	('Polo JavaScript', 'polo-javascript', '/images/polos/polo-js.png', 2000, 'Deja que tu amor por JavaScript hable a través de cada hilo de este polo.', 1, '{"Logo de JavaScript bordado con precisión y detalle.", "Tela premium de algodón peinado.", "Disponible en varios colores.", "Acabado profesional con doble costura."}'),
	('Polo Node.js', 'polo-node', '/images/polos/polo-node.png', 2000, 'Conéctate al estilo con este polo de Node.js, tan robusto como tu código.', 1, '{"Diseño minimalista con el logo de Node.js.", "Material transpirable ideal para largas sesiones de código.", "Tejido resistente a múltiples lavados.", "Etiqueta sin costuras para mayor comodidad."}'),
	('Polo TypeScript', 'polo-typescript', '/images/polos/polo-ts.png', 2000, 'Tipa tu estilo con precisión: lleva tu pasión por TypeScript en cada hilo.', 1, '{"Logo de TypeScript estampado en alta calidad.", "Tejido antimanchas y duradero.", "Cuello reforzado que mantiene su forma.", "100% algodón hipoalergénico."}'),
	('Polo Backend Developer', 'polo-backend-developer', '/images/polos/polo-backend.png', 2500, 'Domina el servidor con estilo: viste con orgullo tu título de Backend Developer.', 1, '{"Diseño exclusivo para desarrolladores backend.", "Material premium que mantiene su forma.", "Costuras reforzadas en puntos de tensión.", "Estampado de alta durabilidad."}'),
	('Polo Frontend Developer', 'polo-frontend-developer', '/images/polos/polo-frontend.png', 2500, 'Construye experiencias con estilo: luce con orgullo tu polo de Frontend Developer.', 1, '{"Diseño inspirado en elementos de UI/UX.", "Tela suave y ligera perfecta para el día a día.", "Estampado flexible que no se agrieta.", "Acabado profesional en cada detalle."}'),
	('Polo Full-Stack Developer', 'polo-fullstack-developer', '/images/polos/polo-fullstack.png', 2500, 'Domina ambos mundos con estilo: lleva tu título de FullStack Developer en cada línea de tu look.', 1, '{"Diseño que representa ambos mundos del desarrollo.", "Material premium de larga duración.", "Proceso de estampado ecológico.", "Corte moderno y cómodo."}'),
	('Polo It''s A Feature', 'polo-its-a-feature', '/images/polos/polo-feature.png', 1500, 'Cuando el bug se convierte en arte: lleva con orgullo tu polo ''It''s a feature''.', 1, '{"Estampado humorístico de alta calidad.", "Algodón orgánico certificado.", "Diseño exclusivo de la comunidad dev.", "Disponible en múltiples colores."}'),
	('Polo It Works On My Machine', 'polo-works-on-my-machine', '/images/polos/polo-works.png', 1500, 'El clásico del desarrollador: presume tu confianza con ''It works on my machine''.', 1, '{"Frase icónica del mundo del desarrollo.", "Material durable y cómodo.", "Estampado que no se desvanece.", "Ideal para regalo entre desarrolladores."}'),
	('Sticker JavaScript', 'sticker-javascript', '/images/stickers/sticker-js.png', 299, 'Muestra tu amor por JavaScript con este elegante sticker clásico.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker React', 'sticker-react', '/images/stickers/sticker-react.png', 249, 'Decora tus dispositivos con el icónico átomo giratorio de React.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker Git', 'sticker-git', '/images/stickers/sticker-git.png', 399, 'Visualiza el poder del control de versiones con este sticker de Git.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker Docker', 'sticker-docker', '/images/stickers/sticker-docker.png', 299, 'La adorable ballena de Docker llevando contenedores en un sticker único.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker Linux', 'sticker-linux', '/images/stickers/sticker-linux.png', 249, 'El querido pingüino Tux, mascota oficial de Linux, en formato sticker.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker VS Code', 'sticker-vscode', '/images/stickers/sticker-vscode.png', 249, 'El elegante logo del editor favorito de los desarrolladores.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker GitHub', 'sticker-github', '/images/stickers/sticker-github.png', 299, 'El alojamiento de repositorios más popular en un sticker de alta calidad.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Sticker HTML', 'sticker-html', '/images/stickers/sticker-html.png', 299, 'El escudo naranja de HTML5, el lenguaje que estructura la web.', 3, '{"Vinilo de alta calidad resistente al agua", "Adhesivo duradero que no deja residuos", "Colores vibrantes que no se desvanecen", "Tamaño perfecto para laptops y dispositivos"}'),
	('Taza JavaScript', 'taza-javascript', '/images/tazas/taza-js.png', 1499, 'Disfruta tu café mientras programas con el logo de JavaScript.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}'),
	('Taza React', 'taza-react', '/images/tazas/taza-react.png', 1399, 'Una taza que hace render de tu bebida favorita con estilo React.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}'),
	('Taza Git', 'taza-git', '/images/tazas/taza-git.png', 1299, 'Commit a tu rutina diaria de café con esta taza de Git.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}'),
	('Taza SQL', 'taza-sql', '/images/tazas/taza-sql.png', 1599, 'Tu amor por los lenguajes estructurados en una taza de SQL.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}'),
	('Taza Linux', 'taza-linux', '/images/tazas/taza-linux.png', 1399, 'Toma tu café con la libertad que solo Linux puede ofrecer.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}'),
	('Taza GitHub', 'taza-github', '/images/tazas/taza-github.png', 1499, 'Colabora con tu café en esta taza con el logo de GitHub.', 2, '{"Cerámica de alta calidad", "Apta para microondas y lavavajillas", "Capacidad de 325ml", "Diseño que no pierde color con el uso"}');

-- migrate:down
DROP TABLE products;
