"use client";
import { useState, useEffect } from "react";
import { Search, Trash2, ShieldCheck, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked: boolean;
  created_at: string;
  _count?: {
    orders: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/user/users");
      setUsers(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (u: UserProfile) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await api.patch(`/user/edit/${u.id}`, { role: newRole });
      setUsers(prev => prev.map(item => item.id === u.id ? { ...item, role: newRole } : item));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const toggleBlockStatus = async (u: UserProfile) => {
    const newStatus = !u.isBlocked;
    try {
      await api.patch(`/user/block/${u.id}`, { isBlocked: newStatus });
      setUsers(prev => prev.map(item => item.id === u.id ? { ...item, isBlocked: newStatus } : item));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/user/delete/${id}`);
      setUsers(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email…"
              className="pl-9 rounded-full bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "admin", "user"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-[#FD6E20] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {f === "user" ? "Customer" : f}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
                {["User", "Role", "Orders", "Joined", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const dateStr = u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                }) : "N/A";
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FD6E20] flex items-center justify-center font-bold text-sm shrink-0">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleRole(u)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          u.role === "admin" ? "bg-orange-100 text-[#FD6E20]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {u.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {u.role === "admin" ? "Admin" : "Customer"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {u._count?.orders ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{dateStr}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleBlockStatus(u)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          !u.isBlocked ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {!u.isBlocked ? "Active" : "Blocked"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-14 text-gray-400 text-sm">No users found.</div>}
        </div>
      )}
    </div>
  );
}

