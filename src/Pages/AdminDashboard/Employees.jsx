
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  RefreshCw,
  X,
  Copy,
  Check,
} from "lucide-react";

import employeeAPI from "../../Services/employeeAPI";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await employeeAPI.get("/");
      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Search and filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const activeCount = employees.filter(
    (employee) => employee.status === "active"
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === "inactive"
  ).length;

  // Create employee account
  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setMessage("");
      setTemporaryPassword("");

      const response = await employeeAPI.post("/", {
        name,
        email,
      });

      setEmployees((previous) => [
        response.data.employee,
        ...previous,
      ]);

      setTemporaryPassword(response.data.temporaryPassword);
      setMessage(response.data.message || "Employee created successfully.");

      setName("");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create employee."
      );
    } finally {
      setCreating(false);
    }
  };

  // Activate or deactivate employee
  const handleStatusChange = async (employee) => {
    const newStatus =
      employee.status === "active" ? "inactive" : "active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus === "active" ? "activate" : "deactivate"
      } ${employee.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await employeeAPI.patch(
        `/${employee._id}/status`,
        { status: newStatus }
      );

      setEmployees((previous) =>
        previous.map((item) =>
          item._id === employee._id ? response.data.employee : item
        )
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update employee status."
      );
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
    } catch {
      setError("Unable to copy the password. Please copy it manually.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTemporaryPassword("");
    setMessage("");
    setName("");
    setEmail("");
    setCopied(false);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Administration / Employees
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Employees Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage employee accounts and their access status.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchEmployees}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={() => {
                setError("");
                setMessage("");
                setTemporaryPassword("");
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {message && !showModal && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage("")}
          />
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon={<Users size={22} />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Active Employees"
            value={activeCount}
            icon={<UserCheck size={22} />}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          <StatCard
            title="Inactive Employees"
            value={inactiveCount}
            icon={<UserX size={22} />}
            iconClass="bg-rose-100 text-rose-600"
          />
        </div>

        {/* Employee table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Employees
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredEmployees.length} employee(s) displayed
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={36} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No employees found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or add a new employee.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Employee</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Joined</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {employee.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {employee.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Employee
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {employee.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(employee.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            employee.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleStatusChange(employee)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                            employee.status === "active"
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {employee.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Employee
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new employee login account.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mt-5">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              </div>
            )}

            {temporaryPassword ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-semibold text-emerald-800">
                    Employee account created!
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Copy this temporary password and share it securely with the
                    employee. It will not be shown again after you close this
                    window.
                  </p>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Temporary password
                </label>

                <div className="flex gap-2">
                  <input
                    readOnly
                    value={temporaryPassword}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
                  />

                  <button
                    onClick={copyPassword}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleCreateEmployee}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating ? "Creating..." : "Create Employee"}
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
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function Alert({ type, message, onClose }) {
  const isError = type === "error";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      <p className="text-sm">{message}</p>

      <button onClick={onClose} aria-label="Close message">
        <X size={17} />
      </button>
    </div>
  );
}
