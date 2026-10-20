import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getCurrentUser } from "../Features/auth/authService";
import { getUserOrders } from "../Features/orders/orderService";
import { formatPrice } from "../utils/price";

// Refresh order statuses every 5 seconds
const REFRESH_INTERVAL = 5000;

// Format order date
function formatOrderDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Status badge colors
function getStatusStyles(status) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Shipped":
    case "Out for Delivery":
      return "bg-blue-100 text-blue-700";

    case "Order Confirmed":
      return "bg-indigo-100 text-indigo-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
}

// Status icons
function getStatusIcon(status) {
  switch (status) {
    case "Delivered":
      return CheckCircle2;

    case "Shipped":
    case "Out for Delivery":
      return Truck;

    default:
      return Clock;
  }
}

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [orderPlacedMessage, setOrderPlacedMessage] = useState("");

  // Load orders and refresh their status periodically
  useEffect(() => {
    let isMounted = true;

    const refreshOrders = () => {
      const user = getCurrentUser();

      if (!user) {
        if (isMounted) {
          setOrders([]);
        }

        return;
      }

      const userOrders = getUserOrders(user.id);

      if (isMounted) {
        setOrders(userOrders);
      }
    };

    // Load orders immediately
    refreshOrders();

    // Refresh order statuses every 5 seconds
    const intervalId = window.setInterval(() => {
      refreshOrders();
    }, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [location.key]);

  // Show order placement confirmation
  useEffect(() => {
    if (location.state?.orderPlaced) {
      const orderId = location.state.orderId;

      setOrderPlacedMessage(
        `Your order ${orderId || ""} has been placed successfully!`
      );

      // Clear navigation state without reloading the page
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
            Your Account
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View your purchases and track your deliveries.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          Continue Shopping
          <ArrowRight size={17} />
        </Link>
      </div>

      {/* Order placement success message */}
      {orderPlacedMessage && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <CheckCircle2 size={22} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-bold">
              Order placed successfully!
            </p>

            <p className="mt-1 text-sm">
              {orderPlacedMessage}
            </p>
          </div>
        </div>
      )}

      {/* Order count */}
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Package size={22} />
          </div>

          <div>
            <p className="font-bold text-gray-900">
              Order History
            </p>

            <p className="text-sm text-gray-500">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <span className="hidden text-xs text-gray-400 sm:block">
          Status updates automatically
        </span>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
            <ShoppingBag size={36} />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-gray-900">
            No orders yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Your orders will appear here after you complete your first
            purchase.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Explore Products
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-5">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);

            const itemCount = (order.items || []).reduce(
              (total, item) =>
                total + (Number(item.quantity) || 0),
              0
            );

            const total =
              Number(order.totals?.grand) ||
              Number(order.totals?.payable) ||
              0;

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/70 p-5">
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-gray-900">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {formatOrderDate(order.placedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Items
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  {/* Live status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    <StatusIcon size={14} />
                    {order.status || "Order Placed"}
                  </span>
                </div>

                {/* Products */}
                <div className="space-y-4 p-5">
                  {(order.items || []).map((item, index) => {
                    const quantity = Number(item.quantity) || 1;

                    const discountedPrice =
                      Number(item.price) *
                      (1 -
                        Number(item.discountPercentage || 0) / 100);

                    return (
                      <div
                        key={`${order.id}-${item.id}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title || "Product"}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <Package className="text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-gray-900">
                            {item.title || "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Quantity: {quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-gray-900">
                          {formatPrice(discountedPrice * quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Order footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 p-5">
                  <div>
                    <p className="text-xs text-gray-500">
                      Total amount
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Payment:{" "}
                      {order.payment === "cod"
                        ? "Cash on Delivery"
                        : order.payment === "online"
                          ? "Online Payment (Demo)"
                          : order.payment || "Not specified"}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${encodeURIComponent(order.id)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                  >
                    Track Order
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}