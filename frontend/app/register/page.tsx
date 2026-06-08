"use client";
import { useState } from "react";
import { Package, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", formData);
      router.push(`/verify-email?email=${formData.email}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-6 my-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Package className="h-7 w-7 text-[#FD6E20]" />
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-gray-500">Join FastShop to start shopping</p>
        </div>

        {error && (
          <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              className="rounded-xl h-11"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="rounded-xl h-11"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="1234567890" 
              className="rounded-xl h-11"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPass ? "text" : "password"} 
                placeholder="Min. 6 characters" 
                className="rounded-xl h-11 pr-10"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] text-base font-semibold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FD6E20] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
