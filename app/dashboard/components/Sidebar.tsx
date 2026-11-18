"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/dashboard/profil", label: "Profil Pengguna" },
  { href: "/dashboard/mahasiswa", label: "Mahasiswa" },
  { href: "/dashboard/dosen", label: "Dosen" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">Sistem Kampus</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menus.map((menu) => {
          // Menu tetap aktif di halaman turunannya (create, edit),
          // kecuali Beranda yang hanya aktif di /dashboard
          const isActive =
            menu.href === "/dashboard"
              ? pathname === menu.href
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`block px-4 py-2 rounded transition ${
                isActive
                  ? "bg-blue-800 text-white font-semibold"
                  : "hover:bg-slate-800"
              }`}
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}