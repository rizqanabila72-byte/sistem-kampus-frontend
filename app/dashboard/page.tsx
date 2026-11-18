import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUserProfile();
  if (!user) redirect("/login");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Selamat Datang, {user.name}!
      </h1>
      <p className="text-gray-600 mb-6">
        Ini adalah halaman beranda dashboard Anda.
      </p>

      <table className="w-full text-left border text-gray-800">
        <tbody>
          <tr className="border-b">
            <th className="p-3 bg-gray-50 w-40 text-gray-700">Nama</th>
            <td className="p-3 text-gray-800">{user.name}</td>
          </tr>
          <tr>
            <th className="p-3 bg-gray-50 text-gray-700">Email</th>
            <td className="p-3 text-gray-800">{user.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}