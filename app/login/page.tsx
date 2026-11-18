
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isFormValid = isValidEmail(email) && password.length >= 6;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan login.");
      }

      // Mengambil token dari beberapa kemungkinan format respons Laravel
      const token =
        data.token ??
        data.data?.token ??
        data.access_token ??
        data.data?.access_token;

      if (!token) {
        throw new Error(
          "Login berhasil, tetapi token tidak ditemukan pada respons API."
        );
      }

      // Simpan token agar dapat dibaca oleh halaman lain
      Cookies.set("token", token, {
        expires: 1,
        path: "/",
        sameSite: "Lax",
      });

      // Pastikan cookie sudah tersimpan
      if (!Cookies.get("token")) {
        throw new Error("Token gagal disimpan di browser.");
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Login error:", error);

      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login Sistem
        </h1>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
              loading || !isFormValid
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

        </form>
      </div>
    </main>
  );
}
