import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { AuthLayout, PasswordField, TextField } from "../Features/auth/AuthLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const next = {};

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSuccess("");

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setFormError("Please fix the highlighted fields to continue.");
      return;
    }

    setFormError("");
    setSuccess(`Signed in successfully. Welcome back, ${email.trim()}!`);
  };

  if (success) {
    return (
      <AuthLayout
        title="You're signed in"
        subtitle="Your session is ready. Happy shopping!"
      >
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
          <CheckCircle2 size={40} className="mx-auto text-green-600" />

          <p className="mt-3 text-sm font-semibold text-green-800">{success}</p>

          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your ShopCart account to keep shopping."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <TextField
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => setFormError("Password reset is not available in this demo.")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
        >
          Sign In <ArrowRight size={17} />
        </button>

        <p className="text-center text-xs text-gray-400">
          Demo only &mdash; no data is stored or sent anywhere.
        </p>
      </form>
    </AuthLayout>
  );
}
