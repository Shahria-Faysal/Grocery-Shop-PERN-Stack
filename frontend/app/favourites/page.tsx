"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const fetchFavorites = async () => {
    const res = await api.get("/favorites");
    setFavorites(res.data);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const remove = async (productId: number) => {
    await api.delete(`/favorites/${productId}`);
    fetchFavorites();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Favorites</h1>

      {favorites.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4">
          <span>{item.name}</span>
          <button onClick={() => remove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}