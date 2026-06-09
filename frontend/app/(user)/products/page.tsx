"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("All");
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const [priceMax,     setPriceMax]     = useState(5000);
  const [inStockOnly,  setInStockOnly]  = useState(false);

  useEffect(() => {
    api.get<{ products: Product[] }>("/product").then((res) => setProducts(res.data.products));
  }, []);

  useEffect(() => {
    api.get<{ categories: { id: number; name: string }[] }>("/category").then((res)=> {
      if (res.data.categories) {
        setCategories(["All", ...res.data.categories.map(c => c.name)]);
      }
    });
  }, []);

  const filtered = products.filter(p => {
    const matchCat   = category === "All" || p.category?.name === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPrice = Number(p.price) <= priceMax;
    const matchStock = inStockOnly ? Number((p as any).stock || 0) > 0 : true;
    return matchCat && matchSearch && matchPrice && matchStock;
  });

  const hasFilters = category !== "All" || priceMax < 10 || inStockOnly;

  return (
    <div className="space-y-6 pt-20 px-4 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-500 mt-1">{filtered.length} items{search && <span> for "<strong>{search}</strong>"</span>}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products…"
              className="pl-9 bg-gray-100 border-none rounded-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size="sm"
            className={`rounded-full gap-2 shrink-0 ${filtersOpen ? "bg-[#FD6E20] hover:bg-[#e55a0f] border-[#FD6E20]" : ""}`}
            onClick={() => setFiltersOpen(o => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {hasFilters && <span className="bg-white text-[#FD6E20] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">!</span>}
          </Button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c ? "bg-[#FD6E20] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        {filtersOpen && (
          <aside className="w-52 shrink-0 space-y-6">
            <div>
              <div className="text-sm font-semibold mb-3">Max Price: ${priceMax}</div>
              <input type="range" min={1} max={5000} step={1} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full accent-[#FD6E20]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$1</span><span>$100</span></div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="stock" className="text-sm font-semibold cursor-pointer">In stock only</label>
              <button
                id="stock"
                onClick={() => setInStockOnly(o => !o)}
                className={`relative w-10 h-5 rounded-full transition-colors ${inStockOnly ? "bg-[#FD6E20]" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            {hasFilters && (
              <button onClick={() => { setCategory("All"); setPriceMax(100); setInStockOnly(false); }} className="text-sm text-[#FD6E20] hover:underline">
                Clear filters
              </button>
            )}
          </aside>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => (
                <a href={`/products/${p.id}`} key={p.id}>
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer h-full flex flex-col">
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img src={p.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.discount_percent && Number(p.discount_percent) > 0 && <span className="absolute top-2 left-2 bg-[#FD6E20] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{Number(p.discount_percent)}% OFF</span>}
                      {Number((p as any).stock || 0) === 0 && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-500 bg-white/90 px-3 py-1 rounded-full">Out of stock</span>
                        </div>
                      )}
                      <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                    <CardContent className="p-3 flex-1 flex flex-col">
                      <div className="text-[10px] text-gray-400 mb-0.5">{p.category?.name || "Grocery"}</div>
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1">{p.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold">${Number(p.price).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-3xl">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-gray-500 mt-2 mb-6">Try a different search or clear your filters</p>
              <Button variant="outline" className="rounded-full" onClick={() => { setSearch(""); setCategory("All"); setPriceMax(100); setInStockOnly(false); }}>Clear all</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
