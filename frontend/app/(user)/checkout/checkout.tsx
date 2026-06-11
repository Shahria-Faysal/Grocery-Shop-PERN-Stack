"use client";
import { useState } from "react";
import { CheckCircle, CreditCard, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SUMMARY_ITEMS = [
  { name: "Organic Bananas x2",   price: 3.98,  image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80" },
  { name: "Sourdough Bread x1",   price: 4.99,  image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=80" },
  { name: "Greek Yogurt 500g x3", price: 10.47, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80" },
];
const SUBTOTAL: number  = 19.44;
const DELIVERY: number  = 0;
const TOTAL: number     = 19.44;

const STEPS = ["Delivery", "Payment", "Review"];

export default function CheckoutPage() {
  const [step,    setStep]    = useState(0);
  const [placed,  setPlaced]  = useState(false);
  const [payment, setPayment] = useState<"card" | "cash">("card");

  if (placed) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-2">Your order <strong>ORD-2848</strong> is confirmed.</p>
      <p className="text-gray-400 text-sm mb-8">You'll receive an email with tracking info shortly.</p>
      <div className="flex gap-3">
        <a href="/orders"><Button className="rounded-full bg-[#FD6E20] hover:bg-[#e55a0f]">View Orders</Button></a>
        <a href="/products"><Button variant="outline" className="rounded-full">Continue Shopping</Button></a>
      </div>
    </div>
  );

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 pb-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => i < step && setStep(i)} className={`flex items-center gap-2 text-sm font-medium ${i === step ? "text-[#FD6E20]" : i < step ? "text-green-600 cursor-pointer" : "text-gray-400"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === step ? "border-[#FD6E20] bg-[#FD6E20] text-white" : i < step ? "border-green-600 bg-green-600 text-white" : "border-gray-300"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {step === 0 && (
            <>
              <h2 className="font-bold text-lg flex items-center gap-2"><Truck className="h-5 w-5 text-[#FD6E20]" /> Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input defaultValue="Jane" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address Line 1</Label>
                <Input defaultValue="12 Main Street" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Address Line 2 (optional)</Label>
                <Input placeholder="Apt, suite, etc." className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>City</Label><Input defaultValue="London" className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label>Postcode</Label><Input defaultValue="SW1A 1AA" className="rounded-xl" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input defaultValue="+44 7700 900000" className="rounded-xl" />
              </div>
              <Button className="w-full h-11 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] font-semibold" onClick={() => setStep(1)}>Continue to Payment →</Button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-bold text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#FD6E20]" /> Payment Method</h2>
              <div className="space-y-3">
                {(["card", "cash"] as const).map(m => (
                  <label key={m} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${payment === m ? "border-[#FD6E20] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value={m} checked={payment === m} onChange={() => setPayment(m)} className="accent-[#FD6E20]" />
                    <div>
                      <div className="font-semibold text-sm">{m === "card" ? "Credit / Debit Card" : "Cash on Delivery"}</div>
                      <div className="text-xs text-gray-400">{m === "card" ? "Visa, Mastercard, Amex" : "Pay when your order arrives"}</div>
                    </div>
                  </label>
                ))}
              </div>
              {payment === "card" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5"><Label>Card Number</Label><Input placeholder="1234 5678 9012 3456" className="rounded-xl" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Expiry</Label><Input placeholder="MM / YY" className="rounded-xl" /></div>
                    <div className="space-y-1.5"><Label>CVV</Label><Input placeholder="•••" className="rounded-xl" /></div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-full flex-1" onClick={() => setStep(0)}>← Back</Button>
                <Button className="rounded-full flex-1 bg-[#FD6E20] hover:bg-[#e55a0f] font-semibold" onClick={() => setStep(2)}>Review Order →</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-bold text-lg">Review & Confirm</h2>
              <div className="space-y-3">
                {SUMMARY_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Delivering to</span><span className="font-medium">12 Main St, London</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium capitalize">{payment === "card" ? "Credit Card" : "Cash on Delivery"}</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-full flex-1" onClick={() => setStep(1)}>← Back</Button>
                <Button className="rounded-full flex-1 bg-[#FD6E20] hover:bg-[#e55a0f] font-semibold" onClick={() => setPlaced(true)}>Place Order</Button>
              </div>
            </>
          )}
        </div>

        {/* Order summary sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 sticky top-28">
            <h3 className="font-bold">Order Summary</h3>
            <div className="space-y-3">
              {SUMMARY_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{item.name}</div></div>
                  <span className="text-xs font-bold shrink-0">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${SUBTOTAL.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-green-600">{DELIVERY === 0 ? "Free" : `$${DELIVERY.toFixed(2)}`}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold"><span>Total</span><span>${TOTAL.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
