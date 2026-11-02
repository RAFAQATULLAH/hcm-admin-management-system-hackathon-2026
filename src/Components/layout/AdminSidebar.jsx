import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserCog, Users, Settings, ShieldCheck, LogOut, X,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hr", label: "HR Management", icon: UserCog },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ onNavigate, mobile = false }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
            <ShieldCheck size={25} />
          </div>
          <div>
            <h1 className="text-lg font-bold">HCM Lite</h1>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>
        {mobile && (
          <button onClick={onNavigate} aria-label="Close menu" className="rounded-lg p-2 text-slate-300 hover:bg-white/10">
            <X size={21} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition ${
                isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
