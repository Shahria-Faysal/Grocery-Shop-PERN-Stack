export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  discount_percent?: number;
  category_id: number;
  description: string;
  stock: number;
  category: {name: string}
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}