import { useState } from "react";
import { Link } from "react-router-dom";

import {
  UserRound,
  Mail,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import {
  getCurrentUser,
  updateUserProfile,
} from "../Features/auth/authService";

export default function Profile() {
  const currentUser = getCurrentUser();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const updatedUser = updateUserProfile({
        name,
        email,
      });

      setName(updatedUser.name);
      setEmail(updatedUser.email);

      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <UserRound
            size={40}
            className="mx-auto text-blue-600"
          />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Sign in required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please sign in to view your profile.
          </p>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page heading */}

        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            MY ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile layout */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* Profile summary */}

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <UserRound size={42} />
              </div>

              <h2 className="mt-4 break-words text-xl font-bold text-gray-900">
                {name || "ShopCart Customer"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {email}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <ShieldCheck size={15} />
                Account Active
              </span>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    Registered email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-900">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Edit profile form */}

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Update the information associated with your account.
              </p>
            </div>

            {/* Success message */}

            {message && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0"
                />

                <span>{message}</span>
              </div>
            )}

            {/* Error message */}

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6"
            >
              {/* Full name */}

              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setMessage("");
                      setError("");
                    }}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    minLength={3}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Email address */}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setMessage("");
                      setError("");
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* Save button */}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}