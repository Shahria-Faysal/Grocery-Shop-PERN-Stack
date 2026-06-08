"use client";
import { ArrowRight, TrendingUp, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";


export default function HomePage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<{ products: Product[] }>("/product").then((res) => setProducts(res.data.products));
  }, []);



  const CATEGORIES = [
    { label: "Fruits & Veg", color: "bg-green-100 text-green-700", icon: "🥦" },
    { label: "Dairy", color: "bg-blue-100 text-blue-700", icon: "🧀" },
    { label: "Bakery", color: "bg-yellow-100 text-yellow-700", icon: "🍞" },
    { label: "Meat & Fish", color: "bg-red-100 text-red-700", icon: "🥩" },
    { label: "Drinks", color: "bg-purple-100 text-purple-700", icon: "🥤" },
    { label: "Snacks", color: "bg-orange-100 text-orange-700", icon: "🍿" },
  ];

  return (
    <div className="space-y-12 pb-12 m-50">
      {/* Hero */}
      <section
        className="rounded-3xl overflow-hidden text-white p-10 md:p-16 flex flex-col justify-end min-h-[420px]"
        style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)" }}
      >
        <p className="text-[#FD6E20] text-sm font-semibold uppercase tracking-wider mb-3">Fresh every day</p>
        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4">
          Get Your Daily <span className="text-[#FD6E20]">Groceries</span> Delivered to Your Doorstep.
        </h1>
        <p className="text-gray-400 max-w-md text-lg mb-8">
          Experience lightning-fast checkout, curated selections, and a shopping experience that respects your time.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a href="/products">
            <Button className="bg-[#FD6E20] hover:bg-[#e55a0f] rounded-full px-8 text-base h-12">
              Shop Now
            </Button>
          </a>
          <a href="/products">
            <Button variant="outline" className="rounded-full px-8 text-base h-12 border-white/30 text-white bg-transparent hover:bg-white/10">
              View Categories
            </Button>
          </a>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <a href="/products" className="text-sm text-[#FD6E20] font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => (
            <a key={cat.label} href="/products">
              <div className={`${cat.color} rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform`}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-xs font-semibold">{cat.label}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#FD6E20]" /> Trending Now
            </h2>
            <p className="text-gray-500 text-sm mt-1">The most popular items in our store</p>
          </div>
          <a href="/products" className="text-sm text-[#FD6E20] font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.filter(p => Number(p.discount_percent || 0) > 25).map(p => (
            <a href={`/products/${p.id}`} key={p.id}>
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer h-full">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img src={p.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {Number(p.discount_percent) > 0 && (
                    <span className="absolute top-2 left-2 bg-[#FD6E20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{Number(p.discount_percent)}% OFF</span>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="text-[10px] text-gray-400 mb-0.5">{p.category?.name || "Grocery"}</div>
                  <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                  <p className="font-bold text-sm mt-1">${Number(p.price).toFixed(2)}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="rounded-3xl bg-orange-50 border border-orange-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <Badge className="bg-[#FD6E20] text-white mb-3">Free delivery</Badge>
          <h3 className="text-2xl font-bold mb-2">Get free delivery on orders over $30</h3>
          <p className="text-gray-500">Use code <span className="font-semibold text-[#FD6E20]">FREESHIP</span> at checkout</p>
        </div>
        <a href="/products">
          <Button className="bg-[#FD6E20] hover:bg-[#e55a0f] rounded-full px-8 h-12 shrink-0">
            <ShoppingBag className="h-4 w-4 mr-2" /> Shop Now
          </Button>
        </a>
      </section>
    </div>
  );
}
