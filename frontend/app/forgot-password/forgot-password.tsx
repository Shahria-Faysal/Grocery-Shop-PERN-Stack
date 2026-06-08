"use client";
import { useState } from "react";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

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
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl h-11" />
              </div>
              <Button
                className="w-full h-11 rounded-full bg-[#FD6E20] hover:bg-[#e55a0f] text-base font-semibold"
                onClick={() => setSent(true)}
              >
                Send Reset Link
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Remembered it?{" "}
              <a href="/auth/login" className="text-[#FD6E20] font-semibold hover:underline">Sign in</a>
            </p>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Check your inbox</h2>
            <p className="text-sm text-gray-500">We sent a reset link to your email. It expires in 15 minutes.</p>
            <a href="/auth/login">
              <Button variant="outline" className="rounded-full mt-4 gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
