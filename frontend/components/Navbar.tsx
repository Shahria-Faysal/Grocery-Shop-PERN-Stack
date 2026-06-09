"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ShoppingCart, User, Search, Menu, Package,
  Heart, Home, ShoppingBag, ClipboardList, LogOut, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";


/* ── mock state ─────────────────────────────────────────────── */
const MOCK_USER = { name: "Jane Doe", email: "jane@example.com", role: "admin" };

const IS_LOGGED_IN = true; // flip to false to see guest state

const navLinks = [{ href: "/", label: "Home", icon: Home }, { href: "/products", label: "Shop", icon: ShoppingBag }];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  const { cartCount, user } = useAuth();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (user?.role !== "admin") {
      setScrolled(y > 80);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery("");
  };

  const userLinks = [
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/favourites", label: "Favourites", icon: Heart },
    { href: "/orders", label: "My Orders", icon: ClipboardList },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/users", label: "Users" },
  ];
  return (
    <>
      <div className={`${user?.role === "admin"
        ? "fixed top-0 left-0 right-0"
        : "fixed top-0 left-0 right-0"
        } z-50 flex justify-center w-full px-4 pt-4 pb-2`}>
        <motion.header
          animate={
            user?.role === "admin"
              ? {
                width: "100%",
                borderRadius: "0px",
                boxShadow: "none",
                backgroundColor: "rgba(255,255,255,1)",
              }
              : {
                width: scrolled ? "70%" : "100%",
                borderRadius: scrolled ? "32px" : "0px",
                boxShadow: scrolled
                  ? "0 10px 25px -5px rgba(0,0,0,0.1)"
                  : "none",
                backgroundColor: scrolled
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(255,255,255,1)",
                backdropFilter: scrolled ? "blur(12px)" : "none",
              }
          }
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between px-6 py-3 mx-auto overflow-hidden border border-transparent"
          style={{ borderColor: scrolled ? "#e5e7eb" : "transparent", borderBottom: !scrolled ? "1px solid #e5e7eb" : undefined }}
        >
          {/* Logo + nav */}
          {user?.role === "admin" && (
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-2 text-[#FD6E20] font-bold text-xl whitespace-nowrap">
                <Package className="h-6 w-6" /> FastShop
              </a>
            </div>
          )}
          {user?.role !== "admin" && (
            <>

              <div className="flex items-center gap-6">
                <motion.div animate={{ width: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }} className="overflow-hidden">
                  <a href="/" className="flex items-center gap-2 text-[#FD6E20] font-bold text-xl whitespace-nowrap">
                    <Package className="h-6 w-6" /> FastShop
                  </a>
                </motion.div>

                <nav className="hidden md:flex items-center gap-6">
                  {navLinks.map(l => (
                    <a key={l.href} href={l.href} className="text-sm font-medium hover:text-[#FD6E20] transition-colors">{l.label}</a>
                  ))}
                </nav>
              </div>

              {/* Search */}
              <motion.div animate={{ width: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }} className="hidden lg:flex items-center relative max-w-md w-full overflow-hidden">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input placeholder="Search groceries…" className="w-full pl-9 bg-gray-100 border-none rounded-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </form>
              </motion.div>

              {/* Right icons */}

              <div className="flex items-center gap-1">
                <a href="/favourites" className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5" />
                </a>
                <a href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && <span className="absolute top-0.5 right-0.5 bg-[#FD6E20] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </a>
                <a href="/orders" className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ClipboardList className="h-5 w-5" />
                </a>
                {user ? (
                  <a href="/profile" className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors"><User className="h-5 w-5" /></a>
                ) : (
                  <a href="/auth/login" className="hidden sm:block ml-1">
                    <Button size="sm" className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]">Sign In</Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="md:hidden ml-1" onClick={() => setDrawerOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </motion.header>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-72 p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-[#FD6E20] font-bold text-lg">
              <Package className="h-5 w-5" /> FastShop
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Browse</div>
            {navLinks.map(l => (
              <a key={l.href} href={l.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                  <l.icon className="h-4 w-4 shrink-0" /> {l.label}
                </div>
              </a>
            ))}
            {user && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-4">Account</div>
                {userLinks.map(l => {
                  const isCart = l.href === "/cart";

                  return (
                    <a key={l.href} href={l.href}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                        <l.icon className="h-4 w-4 shrink-0" />
                        {l.label}

                        {isCart && cartCount > 0 && (
                          <span className="ml-auto bg-[#FD6E20] text-white text-[10px] font-bold h-4 px-1 rounded-full flex items-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </a>
                  );
                })}
                {user.role === "admin" && (
                  <>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-4">Admin</div>
                    {adminLinks.map(l => (
                      <a key={l.href} href={l.href}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                          <Settings className="h-4 w-4 shrink-0" /> {l.label}
                        </div>
                      </a>
                    ))}
                  </>
                )}
              </>
            )}
            {!user && (
              <div className="mt-4 px-2 space-y-2">
                <a href="/auth/login"><Button className="w-full rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]">Sign In</Button></a>
                <a href="/auth/register"><Button variant="outline" className="w-full rounded-full">Create Account</Button></a>
              </div>
            )}
          </div>
          {user && (
            <div className="border-t px-4 py-4 space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FD6E20] flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-full text-red-500 border-red-200 hover:bg-red-50">
                <LogOut className="h-3.5 w-3.5 mr-2" /> Log Out
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
