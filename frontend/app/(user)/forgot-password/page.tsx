"use client";
import { useState } from "react";
import { KeyRound, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-6">
        {!sent ? (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <KeyRound className="h-7 w-7 text-[#FD6E20]" />
              </div>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
            </div>
            
            {error && (
              <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="rounded-xl h-11" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] text-base font-semibold"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500">
              Remembered it?{" "}
              <Link href="/login" className="text-[#FD6E20] font-semibold hover:underline">Sign in</Link>
            </p>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Check your inbox</h2>
            <p className="text-sm text-gray-500">We sent a reset link to your email. It expires in 15 minutes.</p>
            <Link href="/login" className="block pt-2">
              <Button variant="outline" className="rounded-full w-full gap-2 h-11">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}