"use client";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Product } from "@/types";

export default function FavouritesPage() {
  const [items, setItems] = useState<Product[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favourite");
      // Handle case where res.data might be wrapped or an array of favorites with nested product
      // If it's directly an array of Products, this is fine
      setItems(res.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const remove = async (productId: number) => {
    try {
      await api.delete(`/favourite/${productId}`);
      fetchFavorites();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="h-7 w-7 text-[#FD6E20] fill-[#FD6E20]" />
        <h1 className="text-3xl font-bold">My Favourites</h1>
      </div>
      <p className="text-gray-500 mb-8">{items.length} saved items</p>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No favourites yet</h2>
          <p className="text-gray-400 mt-2 mb-6">Save items you love by tapping the heart icon.</p>
          <a href="/products"><Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]">Explore Products</Button></a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            // Depending on the API, the item might be wrapped.
            // If the item itself is the product:
            const product = (item as any).product || item;
            // The favorite ID vs product ID for deletion
            // If the API deletes by favorite ID, we'd use item.id, if by product ID, product.id
            // The provided logic uses productId.
            const productId = product.id || item.id;

            return (
              <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group h-full flex flex-col">
                <a href={`/products/${productId}`} className="block">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-500 bg-white/90 px-3 py-1 rounded-full">Out of stock</span>
                      </div>
                    )}
                  </div>
                </a>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <div className="text-[10px] text-gray-400 mb-0.5">{product.category || "Uncategorized"}</div>
                  <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
                  <div className="font-bold mt-2">${Number(product.price).toFixed(2)}</div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] text-xs h-8 gap-1"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {product.stock === 0 ? "Out of stock" : "Add to cart"}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-gray-200 hover:border-red-300 hover:text-red-400 shrink-0"
                      onClick={() => remove(productId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
