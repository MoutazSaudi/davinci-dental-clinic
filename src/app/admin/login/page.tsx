"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ERRORS: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  too_many_attempts: "Too many attempts. Please try again in 15 minutes.",
  invalid_input: "Please enter a valid email and password.",
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(ERRORS[data?.error as string] ?? "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: "#0B3B5A" }}>
          Admin Login
        </h2>
        <p className="text-sm text-gray-600 mb-6">Sign in to manage the clinic</p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="username"
            required
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />

          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-[#0B3B5A] text-white hover:opacity-95 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
