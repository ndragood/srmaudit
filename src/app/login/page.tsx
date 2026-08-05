"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/assets";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res) {
      setError("Login failed.");
      return;
    }

    if (res.error) {
      setError("Email atau password salah.");
      return;
    }

    router.replace(res.url || callbackUrl || "/assets");
    router.refresh();
  }

  return (
    <div className="w-full flex-1 bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm space-y-4 border border-gray-200"
      >
        <div>
          <div className="text-2xl font-bold text-gray-900">Login</div>
          <div className="text-xs text-gray-500">SRM Audit System</div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-2">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 w-full rounded text-sm text-gray-900 focus:outline-none focus:border-black"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 w-full rounded text-sm text-gray-900 focus:outline-none focus:border-black"
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-60 font-medium hover:bg-gray-800 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}