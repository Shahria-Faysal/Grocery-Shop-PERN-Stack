"use client";
import { useState } from "react";
import { ShoppingCart, Heart, Star, ChevronLeft, Plus, Minus, Package, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PRODUCT = {
  id: 1,
  name: "Organic Bananas (Bunch of 5)",
  category: "Fruits & Veg",
  price: 1.99,
  originalPrice: 2.49,
  rating: 4.7,
  reviewCount: 128,
  stock: 42,
  badge: "Bestseller",
  description: "Hand-picked organic bananas, perfectly ripe and sweet. Sourced from certified organic farms with no pesticides or artificial ripening agents. Rich in potassium, vitamin B6 and fibre.",
  images: [
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600",
    "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600",
    "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600",
  ],
  nutritionPer100g: { calories: 89, carbs: "23g", protein: "1.1g", fat: "0.3g", fibre: "2.6g" },
};

const REVIEWS = [
  { author: "Sarah M.", rating: 5, date: "June 1, 2026",  text: "Perfect ripeness! Will definitely order again." },
  { author: "Tom K.",   rating: 4, date: "May 28, 2026",  text: "Great quality, arrived in good condition." },
  { author: "Lucy R.",  rating: 5, date: "May 20, 2026",  text: "Organically grown and taste noticeably better than supermarket ones." },
];

const RELATED = [
  { id: 5, name: "Avocados x4",       price: 3.99, image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=200" },
  { id: 9, name: "Mixed Salad Bag",   price: 2.29, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200" },
  { id: 2, name: "Whole Milk 1L",     price: 2.49, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200" },
  { id: 3, name: "Sourdough Bread",   price: 4.99, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200" },
];

export default function ProductDetailPage() {
  const [qty,         setQty]         = useState(1);
  const [activeImg,   setActiveImg]   = useState(0);
  const [inFavs,      setInFavs]      = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 pb-16">
      {/* Breadcrumb */}
      <a href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FD6E20] mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </a>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Images */}
        <div className="flex gap-3 lg:w-[480px] shrink-0">
          <div className="flex flex-col gap-2">
            {PRODUCT.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[#FD6E20]" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
            <img src={PRODUCT.images[activeImg]} alt={PRODUCT.name} className="w-full h-full object-cover" />
            {PRODUCT.badge && (
              <span className="absolute top-4 left-4 bg-[#FD6E20] text-white text-xs font-bold px-3 py-1 rounded-full">{PRODUCT.badge}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-5">
          <div>
            <div className="text-sm text-[#FD6E20] font-medium mb-1">{PRODUCT.category}</div>
            <h1 className="text-3xl font-bold leading-tight">{PRODUCT.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(PRODUCT.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm font-semibold">{PRODUCT.rating}</span>
            <span className="text-sm text-gray-400">({PRODUCT.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold">${PRODUCT.price.toFixed(2)}</span>
            {PRODUCT.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${PRODUCT.originalPrice.toFixed(2)}</span>
                <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                  {Math.round((1 - PRODUCT.price / PRODUCT.originalPrice) * 100)}% off
                </Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{PRODUCT.description}</p>

          <div className="text-sm text-gray-500">
            {PRODUCT.stock > 10
              ? <span className="text-green-600 font-medium">✓ In stock ({PRODUCT.stock} available)</span>
              : <span className="text-orange-500 font-medium">⚠ Only {PRODUCT.stock} left!</span>
            }
          </div>

          {/* Qty + buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-full px-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#FD6E20]"><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#FD6E20]"><Plus className="h-4 w-4" /></button>
            </div>
            <Button
              className={`flex-1 h-12 rounded-full font-semibold text-base gap-2 transition-all ${addedToCart ? "bg-green-500 hover:bg-green-500" : "bg-[#FD6E20] hover:bg-[#e55a0f]"}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {addedToCart ? "Added to cart!" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-full shrink-0 ${inFavs ? "border-[#FD6E20] text-[#FD6E20] bg-orange-50" : ""}`}
              onClick={() => setInFavs(f => !f)}
            >
              <Heart className={`h-5 w-5 ${inFavs ? "fill-[#FD6E20]" : ""}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Truck,      text: "Free delivery over $30" },
              { icon: Package,    text: "Packed fresh daily"     },
              { icon: RotateCcw, text: "Easy returns"            },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5">
                <b.icon className="h-3.5 w-3.5 text-[#FD6E20]" /> {b.text}
              </div>
            ))}
          </div>

          {/* Nutrition table */}
          <details className="group">
            <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2 select-none">
              <span>Nutrition per 100g</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="mt-3 grid grid-cols-5 text-xs text-center gap-2">
              {Object.entries(PRODUCT.nutritionPer100g).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-2">
                  <div className="font-bold text-sm">{v}</div>
                  <div className="text-gray-400 capitalize mt-0.5">{k}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FD6E20] font-bold text-xs flex items-center justify-center">{r.author[0]}</div>
                  <span className="font-semibold text-sm">{r.author}</span>
                </div>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <div className="flex mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />)}
              </div>
              <p className="text-sm text-gray-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* Related */}
      <section>
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RELATED.map(p => (
            <a href={`/products/${p.id}`} key={p.id}>
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                  <p className="font-bold text-sm mt-1">${p.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
