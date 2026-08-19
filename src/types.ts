export type User = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: number;
  title: string;
  slug: string;
  imgSrc: string;
  alt: string | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  imgSrc: string;
  price: number;
  description: string;
  features: string[];
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: number;
  quantity: number;
  lineTotal: number;
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    imgSrc: string;
  };
};

export type Cart = {
  id: number;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

// Lo que el formulario de checkout envía a POST /orders. La API completa el
// resto de la orden (total, items) a partir del carrito de la sesión.
export type ShippingInfo = {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number | null;
  title: string;
  price: number;
  imgSrc: string;
  quantity: number;
  createdAt: Date;
};

export type Order = {
  id: number;
  userId: number | null;
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// GET /orders/:id devuelve la orden hidratada con sus items.
export type OrderWithItems = Order & { items: OrderItem[] };
