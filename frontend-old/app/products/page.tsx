"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<{ products: Product[] }>("/product").then((res) => setProducts(res.data.products));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}