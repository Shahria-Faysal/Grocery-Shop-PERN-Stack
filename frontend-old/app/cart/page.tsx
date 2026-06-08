"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [userType, setUserType] = useState<string>("regular");


  const router = useRouter();

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setItems(res.data.cartItems);
    setUserType(res.data.userType || "regular");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ========================
  // 🟢 SELECT LOGIC
  // ========================

  const toggleSelect = (productId: number) => {
    setSelected((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isAllSelected =
    items.length > 0 && selected.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(items.map((i) => i.product.id));
    }
  };

  // ========================
  // 🟢 PRICE CALCULATION
  // ========================

  const USER_DISCOUNTS: Record<string, number> = {
    student: 10,
    vip: 25,
    regular: 0,
  };

  const { subtotal, discountAmount, total } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let tot = 0;

    items.forEach((item) => {
      if (selected.includes(item.product.id)) {
        const basePrice = Number(item.product.price);
        const qty = item.quantity;

        const itemSubtotal = basePrice * qty;
        sub += itemSubtotal;

        const productDiscount = Number((item.product as any).discount_percent || 0);
        const priceAfterProductDiscount = basePrice - (basePrice * productDiscount) / 100;

        const userDiscount = USER_DISCOUNTS[userType] || 0;
        const finalPrice = priceAfterProductDiscount - (priceAfterProductDiscount * userDiscount) / 100;

        const itemTotal = finalPrice * qty;
        tot += itemTotal;
        disc += (itemSubtotal - itemTotal);
      }
    });

    return {
      subtotal: sub.toFixed(2),
      discountAmount: disc.toFixed(2),
      total: tot.toFixed(2),
    };
  }, [items, selected, userType]);

  // ========================
  // 🟢 CART ACTIONS
  // ========================

  const increment = async (productId: number) => {
    await api.patch(`/cart/increment/${productId}`);
    fetchCart();
  };

  const decrement = async (productId: number) => {
    await api.patch(`/cart/decrement/${productId}`);
    fetchCart();
  };

  const remove = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    setSelected((prev) => prev.filter((id) => id !== productId));
    fetchCart();
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;

    await Promise.all(
      selected.map((id) => api.delete(`/cart/${id}`))
    );

    setSelected([]);
    fetchCart();
  };

  // ========================
  // 🟢 CHECKOUT
  // ========================

  const createOrder = async () => {
    if (selected.length === 0) {
      alert("Select items first");
      return;
    }

    await api.post("/order/create", {
      product_ids: selected,
      payment: "COD",
    });

    setSelected([]);
    fetchCart();
    alert("Order placed!");
    router.push("/orders");
  };

  // ========================
  // 🟢 UI
  // ========================

  return (
    <div className="p-6 flex gap-6">
      {/* LEFT: CART ITEMS */}
      <div className="flex-1">
        <h1 className="text-xl mb-4">Cart</h1>

        {/* SELECT ALL */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
          />
          <span>Select All</span>

          <button
            onClick={removeSelected}
            className="ml-4 text-red-500 underline"
          >
            Remove Selected
          </button>
        </div>

        {/* ITEMS */}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center mb-3 border p-2"
          >
            <input
              type="checkbox"
              checked={selected.includes(item.product.id)}
              onChange={() => toggleSelect(item.product.id)}
            />

            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                {item.product.price} ৳
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => decrement(item.product.id)}>
                -
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => increment(item.product.id)}>
                +
              </button>
            </div>

            <button
              onClick={() => remove(item.product.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT: STICKY SUMMARY */}
      <div className="w-72 border p-4 h-fit sticky top-6">
        <h2 className="text-lg mb-4">Order Summary</h2>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal} ৳</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount ({userType})</span>
          <span>-{discountAmount} ৳</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{total} ৳</span>
        </div>

        <button onClick={createOrder} className="w-full bg-black text-white py-2 mt-4">
          Checkout
        </button>
      </div>
    </div>
  );
}