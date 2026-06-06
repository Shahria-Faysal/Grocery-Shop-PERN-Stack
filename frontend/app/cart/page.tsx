"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { CartItem } from "@/types";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setItems(res.data.items);
    setTotal(res.data.total_price);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increment = async (id: number) => {
    await api.patch(`/cart/increment/${id}`);
    fetchCart();
  };

  const decrement = async (id: number) => {
    await api.patch(`/cart/decrement/${id}`);
    fetchCart();
  };

  const remove = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

  const createOrder = async () => {
    const product_ids = items.map((i) => i.product.id);

    await api.post("/orders", {
      product_ids,
      payment: "COD",
    });

    fetchCart();
    alert("Order placed!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Cart</h1>

      {items.map((item) => (
        <div key={item.id} className="flex gap-4 items-center mb-4">
          <span>{item.product.name}</span>
          <span>{item.quantity}</span>

          <button onClick={() => increment(item.id)}>+</button>
          <button onClick={() => decrement(item.id)}>-</button>
          <button onClick={() => remove(item.product.id)}>Remove</button>
        </div>
      ))}

      <h2 className="mt-6">Total: {total} ৳</h2>

      <button
        onClick={createOrder}
        className="mt-4 bg-black text-white px-4 py-2"
      >
        Place Order
      </button>
    </div>
  );
}