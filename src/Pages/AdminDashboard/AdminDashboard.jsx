import { useEffect, useState } from "react";
import { useNavigate , Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserRound,
  Settings,
  ShieldCheck,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Clock3,
  Activity,
  RefreshCw,
} from "lucide-react";

import adminAPI from "../../Services/adminAPI";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    stats: {
      totalAdmins: 0,
      totalHR: 0,
      totalEmployees: 0,
      activeUsers: 0,
    },
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAPI.get("/dashboard");
      setDashboard(response.data);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login", { replace: true });
  };

  const stats = [
    {
      title: "Total HR",
      value: dashboard.stats.totalHR,
      icon: UserCog,
      color: "bg-violet-100 text-violet-700",
      description: "HR accounts",
    },
    {
      title: "Total Employees",
      value: dashboard.stats.totalEmployees,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      description: "Employee accounts",
    },
    {
      title: "Admin Accounts",
      value: dashboard.stats.totalAdmins,
      icon: ShieldCheck,
      color: "bg-amber-100 text-amber-700",
      description: "System administrators",
    },
    {
      title: "Active Staff",
      value: dashboard.stats.activeUsers,
      icon: Activity,
      color: "bg-emerald-100 text-emerald-700",
      description: "Active HR and employees",
    },
  ];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const roleLabel = (role) => {
    if (role === "hr") return "HR";
    if (role === "employee") return "Employee";
    return "Admin";
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white md:flex">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-lg font-bold">HCM Lite</h1>
              <p className="text-xs text-slate-400">
                Admin Portal
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left font-medium"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
  onClick={() => navigate("/hr")}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-white/10 hover:text-white"
>
  <UserCog size={20} />
  HR Management
</button>

            <button
              onClick={() => navigate("/employees")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Users size={20} />
              Employees
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Top navbar */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div>
              <p className="text-sm text-slate-500">
                HCM Lite / Overview
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadDashboard}
                disabled={loading}
                aria-label="Refresh dashboard"
                className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={19}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              <button
                aria-label="Notifications"
                className="relative rounded-xl border border-slate-200 p-3 hover:bg-slate-100"
              >
                <Bell size={19} />
              </button>

              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                  {(adminUser.name || "Admin")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {adminUser.name || "Administrator"}
                  </p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            {/* Welcome */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Welcome back, {adminUser.name || "Admin"}!
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Here's what's happening in your organization.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                <ShieldCheck
                  size={16}
                  className="mr-2 inline"
                />
                Admin Access
              </span>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
                <button
                  onClick={loadDashboard}
                  className="font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                      >
                        <Icon size={23} />
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="text-slate-400"
                      />
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {loading ? "—" : stat.value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Lower section */}
            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              {/* Account overview */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Recent Accounts
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Recently created Admin, HR, and Employee accounts.
                    </p>
                  </div>

                  <Clock3 size={21} className="text-slate-400" />
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Role</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-slate-500"
                          >
                            Loading accounts...
                          </td>
                        </tr>
                      ) : dashboard.recentActivity.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-slate-500"
                          >
                            No accounts found.
                          </td>
                        </tr>
                      ) : (
                        dashboard.recentActivity.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="py-4">
                              <p className="font-semibold text-slate-800">
                                {user.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {user.email}
                              </p>
                            </td>

                            <td className="py-4">
                              {roleLabel(user.role)}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  user.status === "active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>

                            <td className="py-4 text-slate-500">
                              {formatDate(user.createdAt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Quick actions */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your organization.
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/hr")}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="rounded-lg bg-violet-100 p-3 text-violet-700">
                      <UserCog size={21} />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">Manage HR</p>
                      <p className="mt-1 text-xs text-slate-500">
                        View and manage HR accounts
                      </p>
                    </div>

                    <ArrowUpRight size={18} />
                  </button>

                  <button
                    onClick={() => navigate("/employees")}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                      <UserRound size={21} />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">Manage Employees</p>
                      <p className="mt-1 text-xs text-slate-500">
                        View and manage employee accounts
                      </p>
                    </div>

                    <ArrowUpRight size={18} />
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
                      <Settings size={21} />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">Account Settings</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Manage your Admin account
                      </p>
                    </div>

                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </section>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              HCM Lite Admin Portal · Secure account management
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}