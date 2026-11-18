
import Link from "next/link";
import { cookies } from "next/headers";
import DeleteButton from "./components/DeleteButton";

interface Dosen {
  id: number;
  nama_lengkap: string;
  nidn?: string | null;
  nip?: string | null;
  tmt?: string | null;
  jenis_kelamin?: string | number | boolean | null;
  jabatan_fungsional?: string | null;
  status?: string | null;
}

async function getDosens(page: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token login tidak ditemukan. Silakan login kembali.");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dosen?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message || `Gagal mengambil data dosen (${res.status}).`
    );
  }

  const payload = json?.data;
  const list: Dosen[] = Array.isArray(payload)
    ? payload
    : payload?.data ?? [];

  const lastPage = Array.isArray(payload)
    ? 1
    : payload?.last_page ?? 1;

  return { list, lastPage };
}

export default async function DosenPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const { list, lastPage } = await getDosens(currentPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Data Dosen
        </h1>

        <Link
          href="/dashboard/dosen/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Data
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">No.</th>
              <th className="border p-3">Nama Lengkap</th>
              <th className="border p-3">NIDN</th>
              <th className="border p-3">NIP</th>
              <th className="border p-3">TMT</th>
              <th className="border p-3">Jenis Kelamin</th>
              <th className="border p-3">Jabatan Fungsional</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((dosen, index) => (
                <tr key={dosen.id} className="hover:bg-gray-50">
                  <td className="border p-3 text-center">
                    {(currentPage - 1) * 5 + index + 1}
                  </td>

                  <td className="border p-3">
                    {dosen.nama_lengkap}
                  </td>

                  <td className="border p-3">
                    {dosen.nidn || "-"}
                  </td>

                  <td className="border p-3">
                    {dosen.nip || "-"}
                  </td>

                  <td className="border p-3">
                    {dosen.tmt || "-"}
                  </td>

                  <td className="border p-3">
                    {String(dosen.jenis_kelamin) === "1" ||
                    String(dosen.jenis_kelamin) === "true"
                      ? "Laki-laki"
                      : String(dosen.jenis_kelamin) === "0" ||
                        String(dosen.jenis_kelamin) === "false"
                      ? "Perempuan"
                      : "-"}
                  </td>

                  <td className="border p-3">
                    {dosen.jabatan_fungsional || "-"}
                  </td>

                  <td className="border p-3">
                    {dosen.status || "-"}
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/dosen/${dosen.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <DeleteButton id={dosen.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="border p-5 text-center text-gray-500"
                >
                  Belum ada data dosen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-5">
        <p className="text-sm text-gray-600">
          Halaman {currentPage} dari {lastPage}
        </p>

        <div className="flex gap-2">
          {currentPage > 1 && (
            <Link
              href={`/dashboard/dosen?page=${currentPage - 1}`}
              className="border px-3 py-2 rounded"
            >
              Sebelumnya
            </Link>
          )}

          {currentPage < lastPage && (
            <Link
              href={`/dashboard/dosen?page=${currentPage + 1}`}
              className="border px-3 py-2 rounded"
            >
              Selanjutnya
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
