
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

const JABATAN = [
  "tenaga pengajar",
  "asisten ahli",
  "lektor",
  "lektor kepala",
  "guru besar",
];

const STATUS = [
  "aktif",
  "cuti",
  "ijin belajar",
  "tugas di instansi lain",
  "tugas belajar",
];

export interface DosenFormData {
  nama_lengkap: string;
  nidn: string;
  nip: string;
  tmt: string;
  jenis_kelamin: string;
  jabatan_fungsional: string;
  status: string;
}

const kosong: DosenFormData = {
  nama_lengkap: "",
  nidn: "",
  nip: "",
  tmt: "",
  jenis_kelamin: "1",
  jabatan_fungsional: "tenaga pengajar",
  status: "aktif",
};

interface Props {
  initialData?: DosenFormData;
  id?: string;
}

export default function DosenForm({ initialData, id }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<DosenFormData>({
    ...kosong,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
      }

      const url = id
        ? `${process.env.NEXT_PUBLIC_API_URL}/dosen/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/dosen`;

      const payload = {
        nama_lengkap: form.nama_lengkap.trim(),
        nidn: form.nidn.trim() || null,
        nip: form.nip.trim() || null,
        tmt: form.tmt || null,
        jenis_kelamin: Number(form.jenis_kelamin),
        jabatan_fungsional: form.jabatan_fungsional.toLowerCase(),
        status: form.status.toLowerCase(),
      };

      const res = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errors = data?.errors ?? data;

        const validationErrors =
          errors && typeof errors === "object"
            ? Object.values(errors)
                .flat()
                .filter((item) => typeof item === "string")
                .join(", ")
            : "";

        throw new Error(
          validationErrors ||
            data?.message ||
            `Gagal menyimpan data dosen (${res.status}).`
        );
      }

      alert(data?.message || "Data dosen berhasil disimpan!");
      router.push("/dashboard/dosen");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1">Nama Lengkap</label>
        <input
          name="nama_lengkap"
          value={form.nama_lengkap}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">NIDN</label>
        <input
          name="nidn"
          value={form.nidn}
          onChange={handleChange}
          placeholder="Masukkan NIDN (opsional)"
          maxLength={10}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">NIP</label>
        <input
          name="nip"
          value={form.nip}
          onChange={handleChange}
          placeholder="Masukkan NIP (opsional)"
          maxLength={18}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">TMT</label>
        <input
          type="date"
          name="tmt"
          value={form.tmt}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Jenis Kelamin</label>
        <select
          name="jenis_kelamin"
          value={form.jenis_kelamin}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="1">Laki-laki</option>
          <option value="0">Perempuan</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Jabatan Fungsional</label>
        <select
          name="jabatan_fungsional"
          value={form.jabatan_fungsional}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {JABATAN.map((j) => (
            <option key={j} value={j}>
              {j.replace(/\b\w/g, (huruf) => huruf.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/\b\w/g, (huruf) => huruf.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>

        <Link
          href="/dashboard/dosen"
          className="px-4 py-2 border rounded"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
