import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DosenForm from "../../components/DosenForm";

export default async function EditDosenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = (await cookies()).get("token")?.value ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dosen/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Dosen</h1>

      <DosenForm
        id={id}
        initialData={{
          nama_lengkap: data.data?.nama_lengkap ?? "",
          nidn: data.data?.nidn ?? "",
          nip: data.data?.nip ?? "",
          tmt: data.data?.tmt ?? "",
          jenis_kelamin: String(data.data?.jenis_kelamin ?? 1),
          jabatan_fungsional:
            data.data?.jabatan_fungsional ?? "tenaga pengajar",
          status: data.data?.status ?? "aktif",
        }}
      />
    </div>
  );
}