
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const yakin = confirm(
      "Apakah Anda yakin ingin menghapus data dosen ini?"
    );

    if (!yakin) return;

    const token = Cookies.get("token");

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

      if (res.ok) {
        alert("Data dosen berhasil dihapus!");
        router.refresh();
      } else {
        const hasil = await res.json().catch(() => null);
        alert(hasil?.message || "Gagal menghapus data dosen.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Tidak dapat terhubung ke server Laravel.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 cursor-pointer"
    >
      Hapus
    </button>
  );
}
