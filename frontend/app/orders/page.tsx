"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  payment: String;
  status: String;
  total_price: String;
  user_id: number;
  order_items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id: number) => {
    await api.delete(`/orders/cancel/${id}`);
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4">
          <h2>Order #{order.id}</h2>
          <p>Status: {order.status}</p>
          <p>Total: {order.total_price} ৳</p>

          <div className="mt-2">
            {order.order_items.map((items) => (
              <p key={items.id}>
                {items.product.name} x {items.quantity}
              </p>
            ))}
          </div>

          {(order.status === "pending" ||
            order.status === "confirmed") && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1"
              >
                Cancel Order
              </button>
            )}
        </div>
      ))}
    </div>
  );
}