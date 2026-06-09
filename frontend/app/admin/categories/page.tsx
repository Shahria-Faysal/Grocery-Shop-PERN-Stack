"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

interface Category {
  id: number;
  name: string;
  _count?: {
    products: number;
  };
}

const EMOJI_MAP: Record<string, string> = {
  fruits: "🥦",
  veg: "🥦",
  dairy: "🧀",
  bakery: "🍞",
  meat: "🥩",
  fish: "🐟",
  drinks: "🥤",
  snacks: "🍿",
  frozen: "🧊",
  household: "🏠",
};

const getEmoji = (name: string) => {
  const normalized = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (normalized.includes(key)) return emoji;
  }
  return "📦";
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/category");
      setCategories(res.data.categories || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitting(true);
    try {
      if (editId !== null) {
        await api.put(`/category/edit/${editId}`, { name: formName });
      } else {
        await api.post("/category/add", { name: formName });
      }
      setShowForm(false);
      setEditId(null);
      setFormName("");
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: Category) => {
    setEditId(c.id);
    setFormName(c.name);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? Products linked to this category cannot be deleted this way if restrict rules apply.")) return;
    try {
      await api.delete(`/category/delete/${id}`);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <Button
          className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-2"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormName("");
          }}
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold">{editId !== null ? "Edit" : "New"} Category</h2>
          <div className="space-y-1.5 max-w-md">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              required
              placeholder="e.g. Organic Produce"
              className="rounded-xl"
              value={formName}
              onChange={e => setFormName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting} className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-1">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 text-[#FD6E20] animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(c => {
            const productCount = c._count?.products ?? 0;
            const slug = c.name.toLowerCase().replace(/\s+/g, "-");
            const icon = getEmoji(c.name);

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 group hover:border-orange-200 transition-colors"
              >
                <div className="text-3xl">{icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {productCount} {productCount === 1 ? "product" : "products"} · /{slug}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-1 gap-1.5 text-xs"
                    onClick={() => startEdit(c)}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-1 gap-1.5 text-xs text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

