import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import API from "../../Services/api";

export default function AdminUpdatePassword() {
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
  setSuccess("");

  if (formData.newPassword.length < 8) {
    setError("New password must be at least 8 characters.");
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    setError("New passwords do not match.");
    return;
  }

  if (formData.currentPassword === formData.newPassword) {
    setError("Choose a different password.");
    return;
  }

  try {
    setLoading(true);

    const response = await API.patch("/change-password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    setSuccess(response.data.message || "Password updated successfully.");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/login", { replace: true });
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to update your password."
    );
  } finally {
    setLoading(false);
  }
};

  const passwordField = (
    label,
    name,
    value,
    visible,
    toggleVisibility,
    placeholder,
    autoComplete
  ) => (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id={name}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={name === "newPassword" ? 8 : undefined}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );

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
              Account Security
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Keep your account safe.
            </h1>

            <p className="mt-5 leading-7 text-indigo-100">
              Update your password regularly to help protect your administrator
              account and sensitive workforce information.
            </p>

            <div className="mt-8 space-y-4 text-sm text-indigo-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} />
                Use at least 8 characters
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} />
                Choose a new, unique password
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} />
                Never share your password
              </div>
            </div>
          </div>

          <p className="text-sm text-indigo-200">
            Secure access. Smarter workforce management.
          </p>
        </div>

        {/* Password form */}
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
              ACCOUNT SECURITY
            </p>

            <h2 className="text-3xl font-bold">Update password</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your current password and choose a strong new one.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {passwordField(
              "Current password",
              "currentPassword",
              formData.currentPassword,
              showCurrent,
              () => setShowCurrent(!showCurrent),
              "Enter current password",
              "current-password"
            )}

            {passwordField(
              "New password",
              "newPassword",
              formData.newPassword,
              showNew,
              () => setShowNew(!showNew),
              "At least 8 characters",
              "new-password"
            )}

            {passwordField(
              "Confirm new password",
              "confirmPassword",
              formData.confirmPassword,
              showConfirm,
              () => setShowConfirm(!showConfirm),
              "Re-enter new password",
              "new-password"
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating password..." : "Update Password"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Want to go back?{" "}
            <Link
              to="/dashboard"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Dashboard
            </Link>
          </p>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Your account security matters. Keep your credentials private.
          </p>
        </div>
      </div>
    </div>
  );
}
