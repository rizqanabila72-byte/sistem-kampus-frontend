export default function ProfilPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil Pengguna</h1>
      <p className="text-gray-600">
        Ini adalah halaman profil pengguna. Perhatikan bahwa Sidebar dan Navbar
        tidak ter-reload saat Anda berpindah ke halaman ini.
      </p>
    </div>
  );
}