import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close menu overlay" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-slate-950/60" />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <AdminSidebar mobile onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-100 md:hidden">
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs text-slate-500 sm:text-sm">HCM Lite / Admin Portal</p>
              <p className="font-semibold text-slate-900">Administration</p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {(adminUser.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-900">{adminUser.name || "Administrator"}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </header>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
