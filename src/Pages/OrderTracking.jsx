import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getCurrentUser } from "../Features/auth/authService";
import { getOrderById } from "../Features/orders/orderService";
import { formatPrice } from "../utils/price";

const REFRESH_INTERVAL = 1000;

const ORDER_STEPS = [
  {
    label: "Order Placed",
    description: "Your order has been successfully placed.",
    icon: ShoppingBag,
  },
  {
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    label: "Shipped",
    description: "Your package is on its way.",
    icon: Package,
  },
  {
    label: "Out for Delivery",
    description: "Your package is on its way to your address.",
    icon: Truck,
  },
  {
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: PackageCheck,
  },
];

function getOrderStep(status) {
  const index = ORDER_STEPS.findIndex(
    (step) => step.label === status
  );

  return index === -1 ? 0 : index;
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(Date.now());

  useEffect(() => {
    let active = true;

    const refreshOrder = () => {
      const user = getCurrentUser();

      if (!user || !id) {
        if (active) {
          setOrder(null);
          setLoading(false);
        }

        return;
      }

      const decodedId = decodeURIComponent(id);
      const latestOrder = getOrderById(decodedId, user.id);

      if (active) {
        setOrder(latestOrder);
        setRefreshTime(Date.now());
        setLoading(false);
      }
    };

    refreshOrder();

    const intervalId = window.setInterval(
      refreshOrder,
      REFRESH_INTERVAL
    );

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [id]);

  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Please log in
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Log in to view your order details.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Clock className="mx-auto animate-spin text-violet-600" size={32} />

        <p className="mt-4 text-gray-500">
          Loading your order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-500">
          <Package size={36} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
          Order not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't find this order in your account.
        </p>

        <Link
          to="/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const status = order.status || "Order Placed";
  const currentStep = getOrderStep(status);
  const isCancelled = status === "Cancelled";

  const address = order.address || {};
  const totals = order.totals || {};

  const itemCount = (order.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  // Calculate elapsed time for the delivery simulation.
  const elapsedSeconds = Math.max(
    0,
    Math.floor(
      (refreshTime - new Date(order.placedAt).getTime()) / 1000
    )
  );

  const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-violet-700"
      >
        <ArrowLeft size={16} />
        Back to My Orders
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
            Order Tracking
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            Order Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Order ID:{" "}
            <span className="font-bold text-gray-800">
              {order.id}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Placed on {formatDate(order.placedAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            isCancelled
              ? "bg-red-100 text-red-700"
              : status === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-violet-100 text-violet-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Delivery Progress */}
      <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Delivery Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Follow the progress of your order.
            </p>
          </div>

          {!isCancelled && status !== "Delivered" && (
            <div className="rounded-xl bg-violet-50 px-4 py-3">
              <p className="text-xs font-semibold text-violet-600">
                SIMULATED DELIVERY
              </p>

              <p className="mt-1 text-lg font-extrabold text-violet-700">
                {formatRemainingTime(remainingSeconds)}
              </p>

              <p className="text-xs text-gray-500">
                Approximate time remaining
              </p>
            </div>
          )}
        </div>

        {isCancelled ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            This order has been cancelled.
          </div>
        ) : (
          <div className="mt-8">
            {ORDER_STEPS.map((step, index) => {
              const Icon = step.icon;
              const completed = index <= currentStep;
              const current = index === currentStep;

              return (
                <div key={step.label} className="flex gap-4">
                  {/* Timeline icon and connecting line */}
                  <div className="flex w-11 shrink-0 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        completed
                          ? "bg-violet-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      } ${current ? "ring-4 ring-violet-100" : ""}`}
                    >
                      <Icon size={19} />
                    </div>

                    {index !== ORDER_STEPS.length - 1 && (
                      <div
                        className={`my-1 min-h-10 w-0.5 flex-1 ${
                          index < currentStep
                            ? "bg-violet-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step description */}
                  <div
                    className={`pb-8 ${
                      index === ORDER_STEPS.length - 1 ? "pb-0" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-extrabold ${
                          completed
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </h3>

                      {current && (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                          CURRENT STATUS
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {step.description}
                    </p>

                    {index === 0 && (
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(order.placedAt)}
                      </p>
                    )}

                    {index === ORDER_STEPS.length - 1 &&
                      status === "Delivered" && (
                        <p className="mt-1 text-xs font-semibold text-green-600">
                          Delivery completed!
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          <Clock size={16} className="mt-0.5 shrink-0" />

          This is a frontend delivery simulation. The status is calculated
          from the order placement time; real deliveries require a backend.
        </p>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        {/* Products */}
        <section className="space-y-5 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-gray-900">
                Items in Your Order
              </h2>

              <span className="text-sm text-gray-500">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5 divide-y divide-gray-100">
              {(order.items || []).map((item, index) => {
                const quantity = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;

                const discountedPrice =
                  price *
                  (1 - Number(item.discountPercentage || 0) / 100);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50"
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title || "Product"}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <Package className="text-gray-400" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-violet-700"
                      >
                        {item.title || "Product"}
                      </Link>

                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-gray-700">
                        {formatPrice(discountedPrice)} each
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-extrabold text-gray-900">
                      {formatPrice(discountedPrice * quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="font-extrabold text-gray-900">
                  Delivery Address
                </h2>

                <p className="text-xs text-gray-500">
                  Address provided at checkout
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-1 text-sm text-gray-600">
              <p className="font-bold text-gray-900">
                {address.fullName || "Name not available"}
              </p>

              <p>{address.address || "Address not available"}</p>

              {address.landmark && (
                <p>Landmark: {address.landmark}</p>
              )}

              <p>
                {[address.city, address.state, address.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {address.phone && (
                <p className="pt-2">Phone: {address.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Payment and totals */}
        <aside className="space-y-5">
          <section className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              Payment Details
            </h2>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500">
                PAYMENT METHOD
              </p>

              <p className="mt-2 text-sm font-bold text-gray-900">
                {order.payment === "cod"
                  ? "Cash on Delivery"
                  : order.payment === "online"
                    ? "Online Payment (Demo)"
                    : order.payment || "Not specified"}
              </p>

              {order.payment === "online" && (
                <p className="mt-2 text-xs leading-5 text-amber-700">
                  This is a demo payment selection. No actual payment was
                  processed.
                </p>
              )}
            </div>

            <h3 className="mt-6 font-extrabold text-gray-900">
              Price Summary
            </h3>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Subtotal (MRP)</dt>

                <dd className="font-semibold text-gray-900">
                  ₹{Number(totals.mrp || 0).toLocaleString("en-IN")}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Discount</dt>

                <dd className="font-semibold text-green-600">
                  − ₹{Number(totals.savings || 0).toLocaleString("en-IN")}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Delivery</dt>

                <dd className="font-semibold text-gray-900">
                  {Number(totals.delivery) === 0
                    ? "FREE"
                    : `₹${Number(totals.delivery).toLocaleString("en-IN")}`}
                </dd>
              </div>

              <div className="flex justify-between gap-3 border-t border-gray-100 pt-4 text-base font-extrabold text-gray-900">
                <dt>Total Payable</dt>

                <dd>
                  ₹{Number(totals.grand || 0).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>
          </section>

          <Link
            to="/orders"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </Link>
        </aside>
      </div>
    </div>
  );
}