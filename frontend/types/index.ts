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
  isFavorited?: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}