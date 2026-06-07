"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex gap-6 p-4 border-b">
      <Link href="/products">Products</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/favourites">Favorites</Link>

      {user ? (
        <span>Hi, {user.name}</span>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}