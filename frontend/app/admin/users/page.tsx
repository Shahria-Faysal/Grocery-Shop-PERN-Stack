"use client";
import { useState } from "react";
import { Search, Trash2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const USERS = [
  { id: 1, name: "Jane Doe",     email: "jane@email.com",   role: "admin",    orders: 12, joined: "Jan 2025",  active: true  },
  { id: 2, name: "Alice Brown",  email: "alice@email.com",  role: "customer", orders: 8,  joined: "Feb 2025",  active: true  },
  { id: 3, name: "Mark Spencer", email: "mark@email.com",   role: "customer", orders: 3,  joined: "Mar 2025",  active: true  },
  { id: 4, name: "Lisa Park",    email: "lisa@email.com",   role: "customer", orders: 21, joined: "Nov 2024",  active: true  },
  { id: 5, name: "Tom Klein",    email: "tom@email.com",    role: "customer", orders: 5,  joined: "Apr 2025",  active: false },
  { id: 6, name: "Emma Wilson",  email: "emma@email.com",   role: "customer", orders: 14, joined: "Dec 2024",  active: true  },
  { id: 7, name: "Ryan Lee",     email: "ryan@email.com",   role: "customer", orders: 2,  joined: "May 2025",  active: true  },
];

export default function AdminUsersPage() {
  const [users,  setUsers]  = useState(USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "customer">("all");

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const toggleRole = (id: number) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: u.role === "admin" ? "customer" : "admin" } : u));

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name or email…" className="pl-9 rounded-full bg-white" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(["all", "admin", "customer"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-[#FD6E20] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["User", "Role", "Orders", "Joined", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FD6E20] flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(u.id)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${u.role === "admin" ? "bg-orange-100 text-[#FD6E20]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {u.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{u.orders}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{u.joined}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: !x.active } : x))}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                    >
                      {u.active ? "Active" : "Suspended"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500" onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-14 text-gray-400 text-sm">No users found.</div>}
        </div>
      </div>
  );
}
