"use client";
import { useState, useEffect, useMemo } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CartItem } from "@/types";


export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [userType, setUserType] = useState<string>("regular");
  const [coupon, setCoupon] = useState("");

  const router = useRouter();

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setItems(res.data.cartItems || []);
    setUserType(res.data.userType || "regular");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelect = (productId: number) => {
    setSelected((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isAllSelected = items.length > 0 && selected.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(items.map((i) => i.product.id));
    }
  };

  const USER_DISCOUNTS: Record<string, number> = {
    student: 10,
    vip: 25,
    regular: 0,
  };

  const { subtotal, discountAmount, total } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let tot = 0;

    items.forEach((item) => {
      if (selected.includes(item.product.id)) {
        const basePrice = Number(item.product.price);
        const qty = Number(item.quantity);

        const itemSubtotal = basePrice * qty;
        sub += itemSubtotal;

        const productDiscount = Number((item.product as any).discount_percent || 0);
        const priceAfterProductDiscount = basePrice - (basePrice * productDiscount) / 100;

        const userDiscount = USER_DISCOUNTS[userType] || 0;
        const finalPrice = priceAfterProductDiscount - (priceAfterProductDiscount * userDiscount) / 100;

        const itemTotal = finalPrice * qty;
        tot += itemTotal;
        disc += (itemSubtotal - itemTotal);
      }
    });

    return {
      subtotal: sub.toFixed(2),
      discountAmount: disc.toFixed(2),
      total: tot.toFixed(2),
    };
  }, [items, selected, userType]);

  const increment = async (productId: number) => {
    try {
      await api.patch(`/cart/increment/${productId}`);
      fetchCart();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to increment item");
    }
  };

  const decrement = async (productId: number) => {
    try {
      await api.patch(`/cart/decrement/${productId}`);
      fetchCart();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to decrement item");
    }
  };

  const remove = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    setSelected((prev) => prev.filter((id) => id !== productId));
    fetchCart();
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;
    await Promise.all(selected.map((id) => api.delete(`/cart/${id}`)));
    setSelected([]);
    fetchCart();
  };

  const createOrder = async () => {
    if (selected.length === 0) {
      alert("Select items first");
      return;
    }
    await api.post("/order/create", {
      product_ids: selected,
      payment: "COD",
    });
    setSelected([]);
    fetchCart();
    alert("Order placed!");
    router.push("/orders");
  };

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center pt-20">
      <ShoppingBag className="h-20 w-20 text-gray-200" />
      <h2 className="text-2xl font-bold">Your cart is empty</h2>
      <p className="text-gray-500">Looks like you haven't added anything yet.</p>
      <a href="/products"><Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] mt-2">Start Shopping</Button></a>
    </div>
  );

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Cart <span className="text-gray-400 text-xl font-normal">({items.length} items)</span></h1>
        {items.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
              <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="w-5 h-5 accent-[#FD6E20]" />
              Select All
            </label>
            {selected.length > 0 && (
              <Button variant="outline" size="sm" onClick={removeSelected} className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Remove Selected
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Item list */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <input 
                type="checkbox" 
                checked={selected.includes(item.product.id)} 
                onChange={() => toggleSelect(item.product.id)} 
                className="w-5 h-5 accent-[#FD6E20] cursor-pointer shrink-0" 
              />
              <img src={item.product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400">{item.product.category?.name || "Grocery"}</div>
                <h3 className="font-semibold text-sm mt-0.5 truncate">{item.product.name}</h3>
                <div className="font-bold text-[#FD6E20] mt-1">${Number(item.product.price).toFixed(2)}</div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0 h-full">
                <button onClick={() => remove(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 mt-auto">
                  <button onClick={() => decrement(item.product.id)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:border-[#FD6E20] hover:text-[#FD6E20] transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{Number(item.quantity)}</span>
                  <button onClick={() => increment(item.product.id)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:border-[#FD6E20] hover:text-[#FD6E20] transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-sm font-bold mt-2">${(Number(item.product.price) * Number(item.quantity)).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 sticky top-28">
            <h2 className="font-bold text-lg">Order Summary</h2>

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Coupon code" className="pl-9 rounded-full h-9 text-sm" value={coupon} onChange={e => setCoupon(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="rounded-full shrink-0">Apply</Button>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discounts</span>
                <span className="text-green-600 font-medium">-${discountAmount}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <Button onClick={createOrder} className="w-full h-12 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] font-semibold text-base gap-2">
              Checkout <ArrowRight className="h-4 w-4" />
            </Button>
            <a href="/products" className="block text-center text-sm text-[#FD6E20] hover:underline">Continue Shopping</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
