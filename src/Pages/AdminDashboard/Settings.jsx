
import { useEffect, useState } from "react";
import {
  UserRound,
  LockKeyhole,
  SlidersHorizontal,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import settingsAPI from "../../Services/settingsAPI";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const [preferences, setPreferences] = useState({
    timezone: "Asia/Karachi",
    dateFormat: "DD MMM YYYY",
    compactTable: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsAPI.get("/");
        setProfile({
          name: response.data.admin.name || "",
          email: response.data.admin.email || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your Admin settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      setSaving(true);

      const response = await settingsAPI.patch("/profile", {
        name: profile.name,
        email: profile.email,
      });

      setProfile({
        name: response.data.admin.name,
        email: response.data.admin.email,
      });

      // Keep the displayed Admin information consistent
      // with the updated profile.
      const savedAdmin = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          ...savedAdmin,
          name: response.data.admin.name,
          email: response.data.admin.email,
        })
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (passwords.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await settingsAPI.patch("/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setMessage(response.data.message);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = () => {
    clearMessages();

    // Frontend-only until preferences are stored in the backend.
    setMessage(
      "Preferences updated for this page. Connect a backend endpoint to persist them."
    );
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "password", label: "Password", icon: LockKeyhole },
    { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-600">
            Administration / Settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your profile, password, and application preferences.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Settings
            </p>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      clearMessages();
                      setActiveTab(tab.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      selected
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={19} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {activeTab === "profile" && (
              <form onSubmit={saveProfile} className="space-y-6">
                <SectionHeading
                  title="Profile Information"
                  description="Update the name and email associated with your Admin account."
                />

                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
                    {profile.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {profile.name || "Admin"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Administrator Account
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Full name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />

                  <InputField
                    label="Email address"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="admin@example.com"
                  />
                </div>

                <SaveButton saving={saving} label="Save Profile" />
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={savePassword} className="space-y-6">
                <SectionHeading
                  title="Change Password"
                  description="Use your current password to set a new password for your account."
                />

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Choose a unique password with at least 8 characters. Never
                  share your password with another person.
                </div>

                <div className="space-y-5">
                  <PasswordField
                    label="Current password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    show={showPasswords}
                    toggle={() => setShowPasswords(!showPasswords)}
                  />

                  <PasswordField
                    label="New password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    show={showPasswords}
                    toggle={() => setShowPasswords(!showPasswords)}
                  />

                  <PasswordField
                    label="Confirm new password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    show={showPasswords}
                    toggle={() => setShowPasswords(!showPasswords)}
                  />
                </div>

                <SaveButton saving={saving} label="Update Password" />
              </form>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <SectionHeading
                  title="System Preferences"
                  description="Choose how dates and information should appear in your Admin workspace."
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:max-w-md"
                  >
                    <option value="Asia/Karachi">
                      Pakistan Standard Time (Asia/Karachi)
                    </option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">London</option>
                    <option value="America/New_York">New York</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Date format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        dateFormat: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:max-w-md"
                  >
                    <option value="DD MMM YYYY">25 Oct 2026</option>
                    <option value="MM/DD/YYYY">10/25/2026</option>
                    <option value="YYYY-MM-DD">2026-10-25</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Compact table layout
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Preference for denser data tables.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={preferences.compactTable}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        compactTable: e.target.checked,
                      })
                    }
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>

                <button
                  onClick={savePreferences}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <SectionHeading
                  title="Security"
                  description="Review the security measures for your Admin account."
                />

                <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <ShieldCheck
                    size={24}
                    className="shrink-0 text-emerald-700"
                  />
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Protected Admin endpoints
                    </h3>
                    <p className="mt-1 text-sm text-emerald-800">
                      Your settings API uses JWT authentication and Admin role
                      authorization.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <SecurityRow
                    title="Password protection"
                    description="Passwords should be stored as secure hashes, never plain text."
                  />

                  <SecurityRow
                    title="Authentication token"
                    description="Your frontend currently stores the Admin token in localStorage."
                  />

                  <SecurityRow
                    title="Account access"
                    description="Only authorized Admin accounts should be allowed to change system settings."
                  />
                </div>

                <button
                  onClick={() => {
                    setActiveTab("password");
                    clearMessages();
                  }}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Change Password
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="border-b border-slate-100 pb-5">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          autoComplete="off"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

function SaveButton({ saving, label }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
    >
      <Save size={17} />
      {saving ? "Saving..." : label}
    </button>
  );
}

function SecurityRow({ title, description }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
