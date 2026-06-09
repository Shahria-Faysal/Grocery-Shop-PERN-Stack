"use client";
import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  cancelled:  "bg-red-100 text-red-700",
  pending:    "bg-yellow-100 text-yellow-700",
};

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
  payment: string;
  status: string;
  total_price: string;
  user_id: number;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id: number) => {
    try {
      await api.delete(`/order/cancel/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <div className="pt-24 max-w-3xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">{orders.length} orders total</p>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-gray-400 mt-2 mb-6">When you place an order it will appear here.</p>
          <a href="/products"><button className="bg-[#FD6E20] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#e55a0f] transition-colors">Start Shopping</button></a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusKey = order.status ? order.status.toLowerCase() : "pending";
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-[#FD6E20]" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">ORD-{order.id}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> Recent
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[statusKey] || STATUS_STYLES["pending"]}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                    </span>
                    <span className="font-bold text-sm">${parseFloat(String(order.total_price)).toFixed(2)}</span>
                    {expanded === order.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-5 space-y-4">
                    <div className="space-y-3">
                      {order.order_items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 text-xs">No Img</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.product?.name || "Product"}</div>
                            <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-sm font-bold shrink-0">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>${parseFloat(String(order.total_price)).toFixed(2)}</span>
                    </div>
                    {statusKey !== "cancelled" && statusKey !== "delivered" && (
                      <button onClick={() => cancelOrder(order.id)} className="w-full border border-red-500 text-red-500 rounded-full py-2 text-sm font-medium hover:bg-red-50 transition-colors">
                        Cancel Order
                      </button>
                    )}
                    {statusKey === "delivered" && (
                      <button className="w-full border border-[#FD6E20] text-[#FD6E20] rounded-full py-2 text-sm font-medium hover:bg-orange-50 transition-colors">
                        Reorder
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
