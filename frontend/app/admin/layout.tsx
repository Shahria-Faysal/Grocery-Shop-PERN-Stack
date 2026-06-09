"use client";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tag, ClipboardList, Users, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

const links = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/products",   label: "Products",   icon: Package         },
  { href: "/admin/categories", label: "Categories", icon: Tag             },
  { href: "/admin/orders",     label: "Orders",     icon: ClipboardList   },
  { href: "/admin/users",      label: "Users",      icon: Users           },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <div className="flex min-h-screen pt-16 mt-5">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-100 bg-white sticky top-16 h-[calc(100vh-4rem)] flex flex-col p-3 gap-1 mt-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin Panel</div>

        {links.map(l => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <a key={l.href} href={l.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${active ? "bg-[#FD6E20] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <l.icon className="h-4 w-4 shrink-0" />
                {l.label}
              </div>
            </a>
          );
        })}

        <div className="mt-auto space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
            <LogOut className="h-4 w-4 shrink-0" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">{children}</main>
    </div>
  );
}
