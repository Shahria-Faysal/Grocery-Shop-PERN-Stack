"use client";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PRODUCTS = [
  { id: 1,  name: "Organic Bananas",      category: "Fruits & Veg", price: 1.99,  stock: 42,  active: true,  image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=60" },
  { id: 2,  name: "Whole Milk 1L",         category: "Dairy",        price: 2.49,  stock: 30,  active: true,  image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=60" },
  { id: 3,  name: "Sourdough Bread",       category: "Bakery",       price: 4.99,  stock: 15,  active: true,  image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=60" },
  { id: 4,  name: "Free Range Eggs x12",   category: "Dairy",        price: 5.99,  stock: 0,   active: false, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=60" },
  { id: 5,  name: "Avocados x4",           category: "Fruits & Veg", price: 3.99,  stock: 20,  active: true,  image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=60" },
  { id: 6,  name: "Chicken Breast 500g",   category: "Meat & Fish",  price: 6.49,  stock: 8,   active: true,  image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=60" },
  { id: 7,  name: "Greek Yogurt 500g",     category: "Dairy",        price: 3.49,  stock: 25,  active: true,  image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=60" },
  { id: 8,  name: "Orange Juice 1L",       category: "Drinks",       price: 3.29,  stock: 35,  active: true,  image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=60" },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [items,  setItems]  = useState(PRODUCTS);

  const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">{items.length} total products</p>
          </div>
          <Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products…" className="pl-9 rounded-full bg-white" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3.5 font-bold">${p.price.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={p.stock === 0 ? "text-red-500 font-medium" : p.stock < 10 ? "text-orange-500 font-medium" : "text-gray-700"}>
                      {p.stock === 0 ? "Out of stock" : p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setItems(prev => prev.map(i => i.id === p.id ? { ...i, active: !i.active } : i))}>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-orange-50 hover:text-[#FD6E20]"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500" onClick={() => setItems(prev => prev.filter(i => i.id !== p.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              No products found
            </div>
          )}
        </div>
      </div>
  );
}
