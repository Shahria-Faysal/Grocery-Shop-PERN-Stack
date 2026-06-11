"use client";
import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Tag, Package, Settings, Trash2, Plus, Pencil, LogIn, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/axios";

// --- types ---
type ActionType = "all" | "login" | "create" | "update" | "delete" | "order" | "checkout" | "register";

interface RawAuditLog {
  id: number;
  action: string;
  table_name: string | null;
  record_id: number | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
  user_id: number | null;
  user: { id: number; name: string; role: string } | null;
}

interface AuditEntry {
  id: number;
  user: string;
  role: string;
  action: string;
  entity: string;
  detail: string;
  time: string;
  rawDate: Date;
}

// --- helpers ---
const ACTION_STYLES: Record<string, string> = {
  login:    "bg-blue-100  text-blue-700",
  register: "bg-teal-100  text-teal-700",
  create:   "bg-green-100 text-green-700",
  update:   "bg-yellow-100 text-yellow-700",
  delete:   "bg-red-100   text-red-600",
  order:    "bg-purple-100 text-purple-700",
  checkout: "bg-purple-100 text-purple-700",
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  login:    LogIn,
  register: User,
  create:   Plus,
  update:   Pencil,
  delete:   Trash2,
  order:    ShoppingBag,
  checkout: ShoppingBag,
};

const ENTITY_ICONS: Record<string, React.ElementType> = {
  Auth:     LogIn,
  Product:  Package,
  Category: Tag,
  Order:    ShoppingBag,
  User:     User,
  Settings: Settings,
};

// --- table name -> display entity ---
function tableToEntity(table: string | null): string {
  if (!table) return "System";
  const map: Record<string, string> = {
    user:      "User",
    product:   "Product",
    category:  "Category",
    order:     "Order",
    cart_item: "Cart",
    auth:      "Auth",
  };
  return map[table.toLowerCase()] ?? table.charAt(0).toUpperCase() + table.slice(1);
}

// --- build human-readable detail string ---
function buildDetail(log: RawAuditLog): string {
  const entity = tableToEntity(log.table_name);
  const action = log.action.toLowerCase();

  // Auth actions
  if (action === "login")    return `${log.user?.name ?? "Unknown"} signed in`;
  if (action === "register") return `New account created for ${(log.new_data as any)?.name ?? log.user?.name ?? "Unknown"}`;

  // Named resource actions
  const newName = (log.new_data as any)?.name ?? (log.new_data as any)?.title ?? null;
  const oldName = (log.old_data as any)?.name ?? (log.old_data as any)?.title ?? null;

  if (action === "create" && newName) return `Created ${entity.toLowerCase()} "${newName}"`;
  if (action === "delete" && oldName) return `Deleted ${entity.toLowerCase()} "${oldName}"`;
  if (action === "update") {
    // Order status change
    const newStatus = (log.new_data as any)?.status;
    const oldStatus = (log.old_data as any)?.status;
    if (newStatus && oldStatus && newStatus !== oldStatus)
      return `Changed ${entity} #${log.record_id} status: ${oldStatus} → ${newStatus}`;
    if (newStatus)
      return `Updated ${entity} #${log.record_id} status → ${newStatus}`;
    const name = newName ?? oldName;
    if (name) return `Updated ${entity.toLowerCase()} "${name}"`;
    return `Updated ${entity} #${log.record_id ?? ""}`;
  }
  if (action === "order" || action === "checkout") {
    const total = (log.new_data as any)?.total_price;
    const id    = log.record_id;
    return `Placed order${id ? ` #${id}` : ""}${total ? ` · $${Number(total).toFixed(2)}` : ""}`;
  }
  // fallback
  return `${action.charAt(0).toUpperCase() + action.slice(1)} on ${entity}${log.record_id ? ` #${log.record_id}` : ""}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function mapLog(raw: RawAuditLog): AuditEntry {
  return {
    id:      raw.id,
    user:    raw.user?.name ?? "System",
    role:    raw.user?.role === "admin" ? "admin" : raw.user ? "customer" : "system",
    action:  raw.action.toLowerCase(),
    entity:  tableToEntity(raw.table_name),
    detail:  buildDetail(raw),
    time:    formatDate(raw.created_at),
    rawDate: new Date(raw.created_at),
  };
}

// --- filter options ---
const FILTER_OPTIONS: ActionType[] = ["all", "login", "create", "update", "delete", "order"];

export default function AuditLogPage() {
  const [logs, setLogs]       = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<ActionType>("all");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<RawAuditLog[]>("/audit");
      setLogs(res.data.map(mapLog));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error ?? "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter(log => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase())   ||
      log.detail.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      log.action === filter ||
      (filter === "order" && (log.action === "order" || log.action === "checkout"));
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audit Log</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? "Loading…" : `${logs.length} events recorded`}
            </p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            title="Refresh"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search user, action, entity…"
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm outline-none focus:border-[#FD6E20] transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-[#FD6E20] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Log list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-8 w-8 text-[#FD6E20] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No log entries match your search.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(log => {
                const ActionIcon = ACTION_ICONS[log.action] ?? Settings;
                const EntityIcon = ENTITY_ICONS[log.entity] ?? Settings;
                const actionStyle = ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-600";

                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Action icon bubble */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${actionStyle}`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Action badge */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${actionStyle}`}>
                          {log.action}
                        </span>

                        {/* Entity badge */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <EntityIcon className="h-2.5 w-2.5" />
                          {log.entity}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">
                        {log.detail}
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full font-semibold ${log.role === "admin" ? "bg-orange-100 text-[#FD6E20]" : "bg-gray-100 text-gray-500"}`}>
                            {log.role}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-gray-400 shrink-0 text-right">
                      {log.time.split(" · ").map((t, i) => (
                        <div key={i}>{t}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
    </div>
  );
}

