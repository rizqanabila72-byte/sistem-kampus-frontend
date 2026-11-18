
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus data dosen ini?"
    );

    if (!yakin) return;

    const token = Cookies.get("token");

    if (!token) {
      alert("Token login tidak ditemukan. Silakan login kembali.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dosen/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message || "Gagal menghapus data dosen."
        );
      }

      alert("Data dosen berhasil dihapus!");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
