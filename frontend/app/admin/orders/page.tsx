"use client";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATUS_LIST = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;
type Status = typeof STATUS_LIST[number];

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  cancelled:  "bg-red-100 text-red-700",
  pending:    "bg-yellow-100 text-yellow-700",
};

const ORDERS = [
  { id: "ORD-2848", customer: "Alice Brown",  email: "alice@email.com",  total: 24.47, status: "processing", date: "June 7, 2026",  items: 4 },
  { id: "ORD-2847", customer: "Jane Doe",     email: "jane@email.com",   total: 19.96, status: "delivered",  date: "June 5, 2026",  items: 3 },
  { id: "ORD-2846", customer: "Mark Spencer", email: "mark@email.com",   total: 8.28,  status: "shipped",    date: "June 4, 2026",  items: 2 },
  { id: "ORD-2845", customer: "Lisa Park",    email: "lisa@email.com",   total: 31.45, status: "delivered",  date: "June 3, 2026",  items: 6 },
  { id: "ORD-2844", customer: "Tom Klein",    email: "tom@email.com",    total: 14.97, status: "cancelled",  date: "June 2, 2026",  items: 3 },
  { id: "ORD-2843", customer: "Emma Wilson",  email: "emma@email.com",   total: 42.18, status: "delivered",  date: "June 1, 2026",  items: 8 },
  { id: "ORD-2842", customer: "Ryan Lee",     email: "ryan@email.com",   total: 9.97,  status: "pending",    date: "May 31, 2026",  items: 2 },
];

export default function AdminOrdersPage() {
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState<Status>("all");
  const [statuses,  setStatuses]  = useState(() => Object.fromEntries(ORDERS.map(o => [o.id, o.status])));

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || statuses[o.id] === filter;
    return matchSearch && matchFilter;
  });

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{ORDERS.length} total orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by ID or customer…" className="pl-9 rounded-full bg-white" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_LIST.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === s ? "bg-[#FD6E20] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Order", "Customer", "Items", "Total", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-[#FD6E20]">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-gray-400">{o.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{o.items}</td>
                  <td className="px-5 py-3.5 font-bold">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <div className="relative inline-block">
                      <select
                        value={statuses[o.id]}
                        onChange={e => setStatuses(prev => ({ ...prev, [o.id]: e.target.value }))}
                        className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-6 rounded-full cursor-pointer border-none outline-none ${STATUS_STYLES[statuses[o.id]]}`}
                      >
                        {STATUS_LIST.filter(s => s !== "all").map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{o.date}</td>
                  <td className="px-5 py-3.5">
                    <Button variant="ghost" size="sm" className="rounded-full text-xs hover:bg-orange-50 hover:text-[#FD6E20]">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-14 text-gray-400 text-sm">No orders match your search.</div>}
        </div>
      </div>
  );
}
