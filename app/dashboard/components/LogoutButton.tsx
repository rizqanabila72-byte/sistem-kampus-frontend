"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const token = Cookies.get("token");

      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Gagal terhubung ke server saat logout", error);
    } finally {
      Cookies.remove("token");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition disabled:opacity-50"
    >
      {isLoggingOut ? "Keluar..." : "Logout"}
    </button>
  );
}