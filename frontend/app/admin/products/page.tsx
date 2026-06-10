"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Package, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | number; // Decimal in Prisma can come as string or number
  unit: string;
  stock: string | number; // Decimal in Prisma can come as string or number
  image_url: string | null;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formImages, setFormImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        api.get("/product"),
        api.get("/category")
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value.data.products || []);
      } else {
        // If backend returns 404 (No products found), it throws an error in axios.
        const axiosError = prodRes.reason;
        if (axiosError?.response?.status === 404) {
          setProducts([]);
        } else {
          setError("Failed to fetch products. ");
        }
      }

      if (catRes.status === "fulfilled") {
        setCategories(catRes.value.data.categories || []);
      } else {
        console.error("Failed to load categories:", catRes.reason);
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormDesc("");
    setFormPrice("");
    setFormUnit("");
    setFormCategoryId(categories[0]?.id.toString() || "");
    setFormStock("");
    setFormImage("");
    setShowModal(true);
    setFormImages([]);
setImagePreviews([]);

  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormDesc(p.description || "");
    setFormPrice(p.price.toString());
    setFormUnit(p.unit);
    setFormCategoryId(p.category_id.toString());
    setFormStock(p.stock.toString());
    setFormImage(p.image_url || "");
    setShowModal(true);
    setFormImages([]);
setImagePreviews(p.image_url ? [p.image_url] : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formName || !formPrice || !formUnit || !formCategoryId) {
    alert("Please fill in all required fields");
    return;
  }
  setSubmitting(true);

  // Use FormData for file uploads
  const payload = new FormData();
  payload.append("name", formName);
  payload.append("description", formDesc);
  payload.append("price", formPrice);
  payload.append("unit", formUnit);
  payload.append("categoryId", formCategoryId);
  payload.append("stock", formStock || "0");
  formImages.forEach(img => payload.append("images", img)); // multer expects "images"

  try {
    if (editingProduct) {
      await api.patch(`/product/edit/${editingProduct.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/product/add", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    setShowModal(false);
    fetchProductsAndCategories();
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to save product");
  } finally {
    setSubmitting(false);
  }
};

  const addFiles = (files: File[]) => {
  const remaining = 10 - formImages.length;
  const toAdd = files.slice(0, remaining);
  setFormImages(prev => [...prev, ...toAdd]);
  setImagePreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
};

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) addFiles(Array.from(e.target.files));
};

const handleRemoveImage = (index: number) => {
  setFormImages(prev => prev.filter((_, i) => i !== index));
  setImagePreviews(prev => prev.filter((_, i) => i !== index));
};
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/product/delete/${id}`);
      fetchProductsAndCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
  const handlePaste = (e: ClipboardEvent) => {
    const items = Array.from(e.clipboardData?.items || []);
    const files = items
      .filter(it => it.kind === "file" && it.type.startsWith("image/"))
      .map(it => it.getAsFile())
      .filter(Boolean) as File[];
    if (files.length) addFiles(files);
  };
  document.addEventListener("paste", handlePaste);
  return () => document.removeEventListener("paste", handlePaste);
}, [formImages]); // dep on formImages so `remaining` count is current

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Button
          className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-2"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search and Error State */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products…"
            className="pl-9 rounded-full bg-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Table / Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-[#FD6E20] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const priceVal = parseFloat(p.price as string) || 0;
                const stockVal = parseFloat(p.stock as string) || 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.category?.name || "Uncategorized"}</td>
                    <td className="px-5 py-3.5 font-bold">${priceVal.toFixed(2)} <span className="text-xs font-normal text-gray-400">/ {p.unit}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={stockVal === 0 ? "text-red-500 font-medium" : stockVal < 10 ? "text-orange-500 font-medium" : "text-gray-700"}>
                        {stockVal === 0 ? "Out of stock" : `${stockVal} ${p.unit}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-orange-50 hover:text-[#FD6E20]"
                          onClick={() => openEditModal(p)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              No products found
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. Organic Bananas"
                    className="rounded-xl border-gray-200"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="desc" className="text-gray-700 font-medium">Description *</Label>
                  <textarea
                    id="desc"
                    required
                    rows={3}
                    placeholder="Provide a detailed description of the product..."
                    className="w-full text-sm rounded-xl border border-gray-200 p-3 outline-none focus:ring-1 focus:ring-ring focus:border-input"
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-gray-700 font-medium">Price ($) *</Label>
                  <Input
                    id="price"
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="1.99"
                    className="rounded-xl border-gray-200"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="unit" className="text-gray-700 font-medium">Unit *</Label>
                  <Input
                    id="unit"
                    required
                    placeholder="e.g. kg, 1L, x12, pack"
                    className="rounded-xl border-gray-200"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-gray-700 font-medium">Category *</Label>
                  <select
                    id="category"
                    required
                    className="w-full h-10 px-3 text-sm bg-white rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-ring focus:border-input"
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock" className="text-gray-700 font-medium">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="rounded-xl border-gray-200"
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
  <Label className="text-gray-700 font-medium">Product Images</Label>

  {/* Drop zone */}
  <div
    className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#FD6E20] hover:bg-orange-50 transition-colors"
    onDragOver={e => e.preventDefault()}
    onDrop={e => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
      addFiles(files);
    }}
  >
    <input
      type="file"
      accept="image/*"
      multiple
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      onChange={handleImageChange}
    />
    <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
    <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — up to 10 images</p>
  </div>

  {/* Previews */}
  {imagePreviews.length > 0 && (
    <div className="grid grid-cols-5 gap-2 mt-2">
      {imagePreviews.map((src, i) => (
        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
          <img src={src} alt="" className="w-full h-full object-cover" />
          {i === 0 && (
            <span className="absolute bottom-1 left-1 bg-[#FD6E20] text-white text-[10px] px-1.5 py-0.5 rounded">
              primary
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRemoveImage(i)}
            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] gap-2 min-w-[100px]"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

