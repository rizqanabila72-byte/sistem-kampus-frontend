"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import type { ProgramStudi } from "../types";

export interface MahasiswaFormData {
  nim: string;
  nama: string;
  program_studi_id: string;
  email: string;
  nomor_hp: string;
  jenis_kelamin: string; // "1" laki-laki, "0" perempuan
  tempat_lahir: string;
  tanggal_lahir: string;
  golongan_darah: string;
}

const kosong: MahasiswaFormData = {
  nim: "",
  nama: "",
  program_studi_id: "",
  email: "",
  nomor_hp: "",
  jenis_kelamin: "1",
  tempat_lahir: "",
  tanggal_lahir: "",
  golongan_darah: "",
};

const input =
  "mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500";
const label = "block text-sm font-medium text-gray-700";

export default function MahasiswaForm({
  mahasiswaId,
  initial,
}: {
  mahasiswaId?: number; // kalau ada = mode Edit
  initial?: MahasiswaFormData;
}) {
  const router = useRouter();
  const isEdit = mahasiswaId !== undefined;

  const [formData, setFormData] = useState<MahasiswaFormData>(initial ?? kosong);
  const [prodis, setProdis] = useState<ProgramStudi[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Ambil daftar program studi untuk dropdown
  useEffect(() => {
    const token = Cookies.get("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/program-studi`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((json) => setProdis(json.data ?? []))
      .catch((err) => console.error(err));
  }, []);

  const setField = (name: keyof MahasiswaFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const token = Cookies.get("token");

    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/mahasiswa/${mahasiswaId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/mahasiswa`;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          program_studi_id: Number(formData.program_studi_id),
          jenis_kelamin: Number(formData.jenis_kelamin),
          golongan_darah: formData.golongan_darah || null,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/mahasiswa");
        router.refresh();
      } else {
        const data = await res.json();
        if (data.errors) setErrors(data.errors);
        else alert(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const pesan = (name: string) =>
    errors[name] ? (
      <p className="text-sm text-red-600 mt-1">{errors[name][0]}</p>
    ) : null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>NIM (13 digit)</label>
          <input
            type="text"
            required
            maxLength={13}
            value={formData.nim}
            onChange={(e) => setField("nim", e.target.value)}
            className={input}
          />
          {pesan("nim")}
        </div>

        <div>
          <label className={label}>Nama Lengkap</label>
          <input
            type="text"
            required
            value={formData.nama}
            onChange={(e) => setField("nama", e.target.value)}
            className={input}
          />
          {pesan("nama")}
        </div>

        <div>
          <label className={label}>Program Studi</label>
          <select
            required
            value={formData.program_studi_id}
            onChange={(e) => setField("program_studi_id", e.target.value)}
            className={input}
          >
            <option value="">-- Pilih Program Studi --</option>
            {prodis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.program_studi}
              </option>
            ))}
          </select>
          {pesan("program_studi_id")}
        </div>

        <div>
          <label className={label}>Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
            className={input}
          />
          {pesan("email")}
        </div>

        <div>
          <label className={label}>No. HP</label>
          <input
            type="text"
            required
            maxLength={15}
            value={formData.nomor_hp}
            onChange={(e) => setField("nomor_hp", e.target.value)}
            className={input}
          />
          {pesan("nomor_hp")}
        </div>

        <div>
          <label className={label}>Jenis Kelamin</label>
          <select
            value={formData.jenis_kelamin}
            onChange={(e) => setField("jenis_kelamin", e.target.value)}
            className={input}
          >
            <option value="1">Laki-laki</option>
            <option value="0">Perempuan</option>
          </select>
          {pesan("jenis_kelamin")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Tempat Lahir</label>
            <input
              type="text"
              required
              value={formData.tempat_lahir}
              onChange={(e) => setField("tempat_lahir", e.target.value)}
              className={input}
            />
            {pesan("tempat_lahir")}
          </div>
          <div>
            <label className={label}>Tanggal Lahir</label>
            <input
              type="date"
              required
              value={formData.tanggal_lahir}
              onChange={(e) => setField("tanggal_lahir", e.target.value)}
              className={input}
            />
            {pesan("tanggal_lahir")}
          </div>
        </div>

        <div>
          <label className={label}>Golongan Darah (opsional)</label>
          <select
            value={formData.golongan_darah}
            onChange={(e) => setField("golongan_darah", e.target.value)}
            className={input}
          >
            <option value="">-- Pilih --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB">AB</option>
          </select>
          {pesan("golongan_darah")}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Menyimpan..." : isEdit ? "Update Data" : "Simpan Data"}
          </button>
          <Link
            href="/dashboard/mahasiswa"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}