import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import adminAPI from "../../Services/adminAPI";
import loginAPI from "../../Services/loginApi";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    const response = await loginAPI.post("/login", {
      email: formData.email,
      password: formData.password,
    });

    const { token, user } = response.data;

    if (!token || user?.role !== "admin") {
      setError("You are not authorized to access the Admin portal.");
      return;
    }

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));

    if (user.mustChangePassword) {
      navigate("/update-password", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Login failed. Please check your credentials."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl md:grid-cols-2">

        {/* Left panel */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-10 md:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <ShieldCheck size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold">HCM Lite</h2>
              <p className="text-sm text-indigo-100">Admin Portal</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Human Capital Management
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to your control center.
            </h1>

            <p className="mt-5 leading-7 text-indigo-100">
              Manage employees, HR operations, attendance, leave requests,
              and payroll from one secure workspace.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Secure access. Smarter workforce management.
          </p>
        </div>

        {/* Login form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-400">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2 className="text-lg font-bold">HCM Lite</h2>
              <p className="text-sm text-slate-400">Admin Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-indigo-400">
              ADMINISTRATOR ACCESS
            </p>

            <h2 className="text-3xl font-bold">Sign in</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your administrator credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3.5 pl-12 pr-12 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            First-time administrator?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Set up account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Authorized administrators only. Your access is protected.
          </p>
        </div>
      </div>
    </div>
  );
}
