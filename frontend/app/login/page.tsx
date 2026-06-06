"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleLogin = async () => {
    await api.post("/login", { email, password });
    router.push("/products");
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleLogin} className="bg-black text-white p-2">
        Login
      </button>
    </div>
  );
}