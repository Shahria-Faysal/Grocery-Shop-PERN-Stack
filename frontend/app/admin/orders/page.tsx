"use client";
import { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

const STATUS_LIST = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUS_LIST[number];
type DBStatus = Exclude<Status, "all">;

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  cancelled:  "bg-red-100 text-red-700",
  pending:    "bg-yellow-100 text-yellow-700",
};

interface OrderItem {
  id: number;
  quantity: string | number;
  price: string | number;
}

interface Order {
  id: number;
  total_price: string | number;
  status: DBStatus;
  payment: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  order_items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAllOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/order/all");
      // The backend returns the array directly: res.data = [ ... ]
      setOrders(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: DBStatus) => {
    try {
      await api.patch(`/order/status/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update order status");
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      String(o.id).includes(search) ||
      o.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by ID or customer…"
            className="pl-9 rounded-full bg-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_LIST.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === s
                  ? "bg-[#FD6E20] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s === "confirmed" ? "Processing" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 text-[#FD6E20] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => {
                const totalPrice = parseFloat(o.total_price as string) || 0;
                const itemsCount = o.order_items?.length || 0;
                const dateStr = o.created_at
                  ? new Date(o.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  : "N/A";

                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#FD6E20]">#{o.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-800">{o.user?.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-400">{o.user?.email || "No Email"}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{itemsCount}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-800">${totalPrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <div className="relative inline-block">
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value as DBStatus)}
                          className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-8 rounded-full cursor-pointer border-none outline-none ${
                            STATUS_STYLES[o.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_LIST.filter(s => s !== "all").map(s => (
                            <option key={s} value={s} className="bg-white text-gray-800">
                              {s === "confirmed" ? "Processing" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-current opacity-70" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{dateStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-14 text-gray-400 text-sm">No orders match your search.</div>}
        </div>
      )}
    </div>
  );
}

