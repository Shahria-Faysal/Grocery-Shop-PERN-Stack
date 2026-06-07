"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("auth/register", form);

      // 🔥 if backend returns user
      if (res.data.user) {
        setUser(res.data.user);
      }

      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-semibold">Register</h1>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="border p-2"
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border p-2"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="border p-2"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="border p-2"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-black text-white p-2"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}