import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck, ShoppingCart, Tag, Truck } from "lucide-react";

const highlights = [
  { icon: Truck, title: "Free shipping", text: "On every order above ₹499" },
  { icon: Tag, title: "Best prices", text: "Daily deals and flash discounts" },
  { icon: ShieldCheck, title: "Safe & secure", text: "100% secure payments" },
];

/**
 * Shared shell for the login and register pages.
 * Mobile: a single centred card. Desktop (lg+): brand panel beside the form.
 */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto w-[90%] max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:grid-cols-2">
          {/* Brand panel */}
          <aside className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white lg:flex">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <ShoppingCart size={22} strokeWidth={2.5} />
                </span>

                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-white">Shop</span>
                  <span className="text-blue-200">Cart</span>
                </span>
              </Link>

              <h2 className="mt-10 text-3xl font-extrabold leading-tight">
                Everything you love, delivered to your door.
              </h2>

              <ul className="mt-8 space-y-5">
                {highlights.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon size={19} />
                    </span>

                    <span>
                      <span className="block text-sm font-bold">{title}</span>
                      <span className="block text-sm text-blue-100">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-10 text-xs text-blue-200">
              © {new Date().getFullYear()} ShopCart. All rights reserved.
            </p>
          </aside>

          {/* Form panel */}
          <div className="p-6 sm:p-10">
            {/* Compact logo for small screens */}
            <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <ShoppingCart size={20} strokeWidth={2.5} />
              </span>

              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-gray-950">Shop</span>
                <span className="text-blue-600">Cart</span>
              </span>
            </Link>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

            <div className="mt-7">{children}</div>

            {footer && (
              <div className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const fieldClass = (error) =>
  `w-full rounded-xl border py-3 text-sm outline-none transition focus:ring-4 ${
    error
      ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
  }`;

function FieldMessage({ id, error, hint }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    );
  }

  if (hint) {
    return (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-500">
        {hint}
      </p>
    );
  }

  return null;
}

/** Labelled text input with an optional leading icon and inline error. */
export function TextField({ id, label, icon: Icon, error, hint, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${fieldClass(error)} ${Icon ? "pl-11" : "pl-4"} pr-4`}
          {...inputProps}
        />
      </div>

      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({ id, label, error, hint, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${fieldClass(error)} pl-11 pr-11`}
          {...inputProps}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
