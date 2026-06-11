export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
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
  unit?: string;
  category: { name: string };
  isFavorited?: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}