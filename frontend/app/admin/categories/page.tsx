"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INITIAL = [
  { id: 1, name: "Fruits & Veg",  slug: "fruits-veg",  productCount: 48, icon: "🥦" },
  { id: 2, name: "Dairy",         slug: "dairy",        productCount: 35, icon: "🧀" },
  { id: 3, name: "Bakery",        slug: "bakery",       productCount: 22, icon: "🍞" },
  { id: 4, name: "Meat & Fish",   slug: "meat-fish",    productCount: 30, icon: "🥩" },
  { id: 5, name: "Drinks",        slug: "drinks",       productCount: 41, icon: "🥤" },
  { id: 6, name: "Snacks",        slug: "snacks",       productCount: 29, icon: "🍿" },
  { id: 7, name: "Frozen",        slug: "frozen",       productCount: 17, icon: "🧊" },
  { id: 8, name: "Household",     slug: "household",    productCount: 55, icon: "🏠" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [form,       setForm]       = useState({ name: "", icon: "" });

  const save = () => {
    if (!form.name) return;
    if (editId !== null) {
      setCategories(prev => prev.map(c => c.id === editId ? { ...c, name: form.name, icon: form.icon } : c));
    } else {
      setCategories(prev => [...prev, { id: Date.now(), name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, "-"), productCount: 0, icon: form.icon || "📦" }]);
    }
    setShowForm(false); setEditId(null); setForm({ name: "", icon: "" });
  };

  const startEdit = (c: typeof INITIAL[0]) => { setEditId(c.id); setForm({ name: c.name, icon: c.icon }); setShowForm(true); };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
          </div>
          <Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-2" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", icon: "" }); }}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Inline form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-bold">{editId !== null ? "Edit" : "New"} Category</h2>
            <div className="flex gap-4">
              <div className="space-y-1.5 flex-1">
                <Label>Name</Label>
                <Input placeholder="e.g. Organic" className="rounded-xl" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5 w-24">
                <Label>Emoji icon</Label>
                <Input placeholder="🥗" className="rounded-xl text-center text-xl" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]" onClick={save}>Save</Button>
              <Button variant="outline" className="rounded-full" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 group hover:border-orange-200 transition-colors">
              <div className="text-3xl">{c.icon}</div>
              <div className="flex-1">
                <div className="font-bold">{c.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.productCount} products · /{c.slug}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="rounded-full flex-1 gap-1.5 text-xs" onClick={() => startEdit(c)}>
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="rounded-full flex-1 gap-1.5 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => setCategories(prev => prev.filter(x => x.id !== c.id))}>
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
