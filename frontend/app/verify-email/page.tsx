"use client";

import { useState, Suspense } from "react";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!code) return;
        
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await api.post("/auth/verify-email", {
                email: email,
                token: code,
            });

            setSuccess("Email verified successfully!");

            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (err: any) {
            console.error("Verification error:", err);
            setError(err.response?.data?.message || "Verification failed. Please check the code and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="w-16 h-16 bg-orange-50 text-[#FD6E20] rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                    <Mail className="w-8 h-8 transform rotate-6" />
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">Check your email</h1>
                <p className="text-center text-gray-500 mb-8 leading-relaxed">
                    We sent a verification code to<br />
                    <strong className="text-gray-900 font-semibold">{email || "your email"}</strong>
                </p>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input
                            id="code"
                            type="text"
                            placeholder="Enter the code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#FD6E20]/20 focus:border-[#FD6E20] transition-all bg-gray-50/50 focus:bg-white"
                        />
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="flex items-start gap-3 text-sm text-green-600 bg-green-50 p-4 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{success}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !code || !!success}
                        className="w-full bg-[#FD6E20] hover:bg-[#e55a0f] text-white rounded-full py-6 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Verifying...
                            </>
                        ) : success ? (
                            <>
                                Verified <CheckCircle2 className="w-5 h-5 ml-2" />
                            </>
                        ) : (
                            <>
                                Verify Email <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Didn't receive the email?{" "}
                    <button className="text-[#FD6E20] font-semibold hover:text-[#e55a0f] transition-colors">
                        Check spam folder
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-[#FD6E20] animate-spin" />
            </div>
        }>
            <VerifyEmailForm />
        </Suspense>
    );
}