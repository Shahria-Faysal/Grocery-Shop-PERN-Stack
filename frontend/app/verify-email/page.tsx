"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
    const router = useRouter();


    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleVerify = async () => {
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
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            console.log(email)
            console.log(code)
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
            <h1 className="text-2xl font-semibold">Verify Email</h1>
            <p className="text-sm text-gray-500">
                Verification code sent to: <strong>{email}</strong>
            </p>

            <input
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border p-2"
            />

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-black text-white p-2"
            >
                {loading ? "Verifying..." : "Verify Email"}
            </button>
        </div>
    );
}