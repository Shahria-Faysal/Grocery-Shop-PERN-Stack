"use client";

import api from "@/lib/axios";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = async () => {
    await api.post(`/cart/add/${product.id}`, { quantity: 1 });
  };

  const toggleFavorite = async () => {
    if (product.isFavorited) {
      await api.delete(`/favourite/${product.id}`);
    } else {
      await api.post(`/favourite/add/${product.id}`);
    }
  };

  return (
    <div className="border p-4">
      <img
        src={product.image_url}
        className="h-40 w-full object-cover"
      />
      <h2>{product.name}</h2>
      <p>{product.price} ৳</p>

      <button onClick={addToCart}>Add to Cart</button>
      <button onClick={toggleFavorite}>
        {product.isFavorited ? "❤️" : "🤍"}
      </button>
    </div>
  );
}