import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Mail, User } from "lucide-react";

import { AuthLayout, PasswordField, TextField } from "../Features/auth/AuthLayout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns a 0-3 score used to drive the strength bars. */
const getStrength = (value) => {
  if (!value) return 0;

  let score = 0;

  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score++;

  return score;
};

const strengthMeta = [
  { label: "Weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Strong", bar: "bg-green-500", text: "text-green-600" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = getStrength(password);
  const strengthInfo = strengthMeta[Math.min(strength, 2)];

  const validate = () => {
    const next = {};

    if (!name.trim()) {
      next.name = "Full name is required.";
    } else if (name.trim().length < 3) {
      next.name = "Name must be at least 3 characters.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!terms) {
      next.terms = "Please accept the terms to continue.";
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
    setSuccess(`Account created for ${name.trim()}. You can sign in now.`);
  };

  if (success) {
    return (
      <AuthLayout
        title="Welcome to ShopCart"
        subtitle="Your account is ready to use."
      >
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
          <CheckCircle2 size={40} className="mx-auto text-green-600" />

          <p className="mt-3 text-sm font-semibold text-green-800">{success}</p>

          <Link
            to="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Go to Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join ShopCart for faster checkout, order tracking and exclusive deals."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign in
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
          id="register-name"
          label="Full name"
          autoComplete="name"
          placeholder="Your name"
          icon={User}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />

        <TextField
          id="register-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <div>
          <PasswordField
            id="register-password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />

          {password && !errors.password && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition ${
                      index < strength ? strengthInfo.bar : "bg-gray-200"
                    }`}
                  />
                ))}

                <span className={`ml-1 text-xs font-bold ${strengthInfo.text}`}>
                  {strengthInfo.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <PasswordField
          id="register-confirm"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span>
              I agree to the{" "}
              <span className="font-semibold text-blue-600">Terms of Service</span>{" "}
              and{" "}
              <span className="font-semibold text-blue-600">Privacy Policy</span>.
            </span>
          </label>

          {errors.terms && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
        >
          Create Account <ArrowRight size={17} />
        </button>

        <p className="text-center text-xs text-gray-400">
          Demo only &mdash; no data is stored or sent anywhere.
        </p>
      </form>
    </AuthLayout>
  );
}
