
import DosenForm from "../components/DosenForm";

export default function CreateDosenPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tambah Data Dosen
      </h1>

      <DosenForm />
    </div>
  );
}
