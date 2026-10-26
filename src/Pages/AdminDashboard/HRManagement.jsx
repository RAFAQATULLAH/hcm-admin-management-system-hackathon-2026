
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Mail,
  X,
  ShieldCheck,
  MoreHorizontal,
  RefreshCw,
  Copy,
  LoaderCircle,
} from "lucide-react";
import hrAPI from "../../Services/hrAPI";

const emptyForm = {
  name: "",
  email: "",
};

export default function HRManagement() {
  const [hrList, setHrList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  async function fetchHR() {
    setLoading(true);
    setError("");

    try {
      const response = await hrAPI.get("/");
      setHrList(response.data.hrAccounts);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load HR accounts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHR();
  }, []);

  const filteredHR = useMemo(() => {
    return hrList.filter((hr) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        hr.name.toLowerCase().includes(query) ||
        hr.email.toLowerCase().includes(query);

      const matchesStatus =
        filter === "all" || hr.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [hrList, search, filter]);

  const activeCount = hrList.filter(
    (hr) => hr.status === "active"
  ).length;

  const inactiveCount = hrList.filter(
    (hr) => hr.status === "inactive"
  ).length;

  async function handleCreateHR(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    setTemporaryPassword("");

    try {
      const response = await hrAPI.post("/", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });

      setHrList((previous) => [
        response.data.hr,
        ...previous,
      ]);

      setTemporaryPassword(response.data.temporaryPassword || "");
      setForm(emptyForm);
      setMessage("HR account created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create HR account."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(hr) {
    const newStatus =
      hr.status === "active" ? "inactive" : "active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus === "active" ? "activate" : "deactivate"
      } ${hr.name}?`
    );

    if (!confirmed) return;

    setUpdatingId(hr._id);
    setError("");
    setMessage("");
    setMenuId(null);

    try {
      const response = await hrAPI.patch(
        `/${hr._id}/status`,
        { status: newStatus }
      );

      setHrList((previous) =>
        previous.map((item) =>
          item._id === hr._id ? response.data.hr : item
        )
      );

      setMessage(`${hr.name} is now ${newStatus}.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update account status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function copyTemporaryPassword() {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setMessage("Temporary password copied.");
    } catch {
      setError(
        "Could not copy automatically. Select and copy the password manually."
      );
    }
  }

  function closeModal() {
    setShowModal(false);
    setForm(emptyForm);
    setTemporaryPassword("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Admin / HR Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              HR Management
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage your HR team and account access.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchHR}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={() => {
                setError("");
                setMessage("");
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={18} />
              Add HR
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError("")}
          />
        )}

        {message && (
          <Alert
            message={message}
            type="success"
            onClose={() => setMessage("")}
          />
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total HR"
            value={hrList.length}
            icon={<Users size={22} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Active HR"
            value={activeCount}
            icon={<UserCheck size={22} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Inactive HR"
            value={inactiveCount}
            icon={<UserX size={22} />}
            iconClass="bg-rose-50 text-rose-600"
          />
        </div>

        {/* HR table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                HR Accounts
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All HR accounts stored in your database.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">HR Member</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {!loading &&
                  filteredHR.map((hr) => (
                    <tr key={hr._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                            {hr.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {hr.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                              <Mail size={14} />
                              {hr.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {hr.createdAt
                          ? new Date(hr.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            hr.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              hr.status === "active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {hr.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            disabled={updatingId === hr._id}
                            onClick={() =>
                              setMenuId(
                                menuId === hr._id ? null : hr._id
                              )
                            }
                            aria-label={`Actions for ${hr.name}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                          >
                            {updatingId === hr._id ? (
                              <LoaderCircle
                                size={20}
                                className="animate-spin"
                              />
                            ) : (
                              <MoreHorizontal size={20} />
                            )}
                          </button>

                          {menuId === hr._id && (
                            <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-lg">
                              <button
                                onClick={() => handleStatusChange(hr)}
                                className="w-full rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                {hr.status === "active"
                                  ? "Deactivate account"
                                  : "Activate account"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {loading && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <LoaderCircle
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                      />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading HR accounts...
                      </p>
                    </td>
                  </tr>
                )}

                {!loading && filteredHR.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <Users
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-semibold text-slate-700">
                        No HR accounts found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or add an HR account.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            Showing {filteredHR.length} of {hrList.length} HR accounts
          </div>
        </div>
      </div>

      {/* Create HR modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hr-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={24} />
                </div>
                <h2
                  id="hr-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Create HR Account
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new member to your HR team.
                </p>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {temporaryPassword ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-semibold text-emerald-800">
                    Account created successfully
                  </p>
                  <p className="mt-2 text-sm text-emerald-700">
                    Copy this temporary password now. It will not be
                    shown again after you close this window.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Temporary password
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={temporaryPassword}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-sm"
                    />
                    <button
                      onClick={copyTemporaryPassword}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateHR} className="space-y-5">
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    onClose={() => setError("")}
                  />
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <p className="rounded-xl bg-blue-50 p-3 text-sm leading-5 text-blue-800">
                  A temporary password will be generated by the server.
                  The HR member will need a secure password-change flow
                  before this account is ready for normal use.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && (
                      <LoaderCircle size={17} className="animate-spin" />
                    )}
                    {submitting ? "Creating..." : "Create HR Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Alert({ message, type, onClose }) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${styles}`}
    >
      <p>{message}</p>
      <button onClick={onClose} aria-label="Dismiss message">
        <X size={17} />
      </button>
    </div>
  );
}
