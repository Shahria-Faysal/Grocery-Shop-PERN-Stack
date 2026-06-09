"use client";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const STATS = [
  { label: "Total Revenue",  value: "$12,480",  change: "+18%",  up: true,  icon: DollarSign  },
  { label: "Orders Today",   value: "47",        change: "+12%",  up: true,  icon: ShoppingBag },
  { label: "Active Users",   value: "1,284",     change: "+5%",   up: true,  icon: Users       },
  { label: "Products",       value: "342",        change: "-2%",   up: false, icon: Package     },
];

const RECENT_ORDERS = [
  { id: "ORD-2848", customer: "Alice Brown",  total: "$24.47", status: "processing", date: "Just now"    },
  { id: "ORD-2847", customer: "Jane Doe",     total: "$19.96", status: "delivered",  date: "2h ago"      },
  { id: "ORD-2846", customer: "Mark Spencer", total: "$8.28",  status: "shipped",    date: "4h ago"      },
  { id: "ORD-2845", customer: "Lisa Park",    total: "$31.45", status: "delivered",  date: "Yesterday"   },
  { id: "ORD-2844", customer: "Tom Klein",    total: "$14.97", status: "cancelled",  date: "Yesterday"   },
];

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  cancelled:  "bg-red-100 text-red-700",
};

const TOP_PRODUCTS = [
  { name: "Organic Bananas",     sales: 342, revenue: "$680" },
  { name: "Sourdough Bread",     sales: 218, revenue: "$1,088" },
  { name: "Greek Yogurt 500g",   sales: 195, revenue: "$681" },
  { name: "Free Range Eggs x12", sales: 167, revenue: "$1,000" },
  { name: "Avocados x4",         sales: 143, revenue: "$571" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back {user?.name || "Admin"} here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <Card key={s.label} className="border-none shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-[#FD6E20]" />
                  </div>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? "text-green-600" : "text-red-500"}`}>
                    {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {s.change}
                  </span>
                </div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold">Recent Orders</h2>
              <a href="/admin/orders" className="text-xs text-[#FD6E20] hover:underline">View all →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_ORDERS.map(o => (
                <div key={o.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-semibold">{o.id}</div>
                    <div className="text-xs text-gray-400">{o.customer} · {o.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm">{o.total}</span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold">Top Products</h2>
              <TrendingUp className="h-4 w-4 text-[#FD6E20]" />
            </div>
            <div className="divide-y divide-gray-50">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-extrabold text-gray-200 w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.sales} sold</div>
                  </div>
                  <div className="text-sm font-bold shrink-0">{p.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
