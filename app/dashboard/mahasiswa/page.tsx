
import Link from "next/link";
import { cookies } from "next/headers";
import DeleteButton from "./components/DeleteButton";
import type { Mahasiswa, ProgramStudi } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchApi<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum diatur di file .env.local"
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error(
      "Token login tidak ditemukan. Silakan login kembali."
    );
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error(
      "Akses ditolak (401). Token login tidak valid atau sudah kedaluwarsa. Silakan login kembali."
    );
  }

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil data dari ${path}. Status: ${res.status}`
    );
  }

  const json = await res.json();

  return json.data as T;
}

export default async function MahasiswaPage() {
  const [mahasiswas, prodis] = await Promise.all([
    fetchApi<Mahasiswa[]>("/mahasiswa"),
    fetchApi<ProgramStudi[]>("/program-studi"),
  ]);

  const namaProdi = new Map(
    prodis.map((p) => [p.id, p.program_studi])
  );

  const th =
    "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

  const td =
    "px-4 py-3 whitespace-nowrap text-sm text-gray-900";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

      {/* Judul dan tombol tambah */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Mahasiswa
        </h1>

        <Link
          href="/dashboard/mahasiswa/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Tambah Data
        </Link>
      </div>

      {/* Tabel mahasiswa */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              <th className={th}>NIM</th>
              <th className={th}>Nama</th>
              <th className={th}>Program Studi</th>
              <th className={th}>Email</th>
              <th className={th}>No. HP</th>
              <th className={th}>JK</th>
              <th className={th}>Tempat, Tgl Lahir</th>
              <th className={th}>Gol. Darah</th>
              <th className={`${th} text-center`}>Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">

            {mahasiswas.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Belum ada data mahasiswa.
                </td>
              </tr>
            )}

            {mahasiswas.map((mhs) => (
              <tr key={mhs.id}>

                <td className={td}>{mhs.nim}</td>

                <td className={td}>{mhs.nama}</td>

                <td className={td}>
                  {namaProdi.get(mhs.program_studi_id) ?? "-"}
                </td>

                <td className={td}>{mhs.email ?? "-"}</td>

                <td className={td}>{mhs.nomor_hp ?? "-"}</td>

                <td className={td}>
                  {Number(mhs.jenis_kelamin) === 1
                    ? "Laki-laki"
                    : "Perempuan"}
                </td>

                <td className={td}>
                  {mhs.tempat_lahir ?? "-"},{" "}
                  {mhs.tanggal_lahir ?? "-"}
                </td>

                <td className={td}>
                  {mhs.golongan_darah ?? "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center space-x-3">

                  <Link
                    href={`/dashboard/mahasiswa/${mhs.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>

                  <DeleteButton id={mhs.id} />

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
