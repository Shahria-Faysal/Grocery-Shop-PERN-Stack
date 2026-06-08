"use client";
import { useState } from "react";
import { Package, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Package className="h-7 w-7 text-[#FD6E20]" />
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-gray-500">Join FastShop to start shopping</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" className="rounded-xl h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" className="rounded-xl h-11 pr-10" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button className="w-full h-11 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] text-base font-semibold">Sign Up</Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#FD6E20] font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
