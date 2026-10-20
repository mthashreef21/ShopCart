import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowRight,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Package,
  UserRound,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  logoutUser,
  getCurrentUser,
} from "../Features/auth/authService";

import { toINR } from "../utils/price";
import { getUserOrders } from "../Features/orders/orderService";

// Format INR
const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function readCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("shopcart_cart") || "[]"
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("Failed to read cart:", error);
    return [];
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Read cart from the same source used by App.jsx
  const [cartItems, setCartItems] = useState(readCart);

  // Wishlist remains connected to Redux
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  // Order history
  const [orders, setOrders] = useState([]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    setCartItems(readCart());

    if (user?.id) {
      setOrders(getUserOrders(user.id));
    } else {
      setOrders([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshDashboard();

    // Update when localStorage changes in another tab
    const handleStorage = (event) => {
      if (
        !event.key ||
        event.key === "shopcart_cart" ||
        event.key === "shopcart_orders"
      ) {
        refreshDashboard();
      }
    };

    // Update when the browser tab becomes active
    const handleFocus = () => refreshDashboard();

    // Update when navigating back to this page
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshDashboard();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [refreshDashboard]);

  // Logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  // Total quantity in cart
  const cartCount = cartItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );

  // Calculate discounted cart value in INR
  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discountPercentage) || 0;
    const quantity = Number(item.quantity) || 0;

    const discountedPrice =
      price * (1 - discount / 100);

    return total + toINR(discountedPrice) * quantity;
  }, 0);

  // Sidebar navigation
  const menuItems = [
    {
      label: "Dashboard",
      icon: ShoppingBag,
      path: "/dashboard",
      active: true,
    },
    {
      label: "My Orders",
      icon: Package,
      path: "/orders",
    },
    {
      label: "My Profile",
      icon: UserRound,
      path: "/profile",
    },
  ];

  // Dashboard overview
  const stats = [
    {
      title: "Cart Items",
      value: cartCount,
      description: "Products in your cart",
      icon: ShoppingCart,
      iconStyle: "bg-blue-50 text-blue-600",
      link: "/cart",
      action: "View cart",
    },
    {
      title: "Wishlist",
      value: wishlistItems.length,
      description: "Your saved products",
      icon: Heart,
      iconStyle: "bg-pink-50 text-pink-600",
      link: "/wishlist",
      action: "View wishlist",
    },
    {
      title: "Cart Value",
      value: formatPrice(cartTotal),
      description: "Current cart subtotal",
      icon: ShoppingBag,
      iconStyle: "bg-emerald-50 text-emerald-600",
      link: "/cart",
      action: "View cart",
    },
    {
      title: "Order History",
      value: orders.length,
      description:
        orders.length === 1
          ? "Order placed"
          : "Orders placed",
      icon: Package,
      iconStyle: "bg-amber-50 text-amber-600",
      link: "/orders",
      action: "View orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADING */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            MY ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your shopping activity in one place.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {/* PROFILE HEADER */}
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 px-2 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserRound size={24} />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-sm font-bold text-gray-900">
                  {user?.name || "My Account"}
                </h2>

                <p className="mt-1 break-all text-xs text-gray-500">
                  {user?.email || "ShopCart Customer"}
                </p>
              </div>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      item.active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={19} />

                    <span>{item.label}</span>

                    {item.active && (
                      <ChevronRight
                        size={16}
                        className="ml-auto"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* LOGOUT */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* DASHBOARD CONTENT */}
          <main className="min-w-0 space-y-6">
            {/* WELCOME BANNER */}
            <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Welcome to ShopCart
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    Welcome back, {user?.name || "ShopCart Customer"}!
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
                    Explore products, manage your wishlist, and
                    keep track of your shopping cart.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    Continue Shopping
                    <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                  <ShoppingBag size={42} />
                </div>
              </div>
            </section>

            {/* SUMMARY CARDS */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  A quick look at your shopping activity.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                        >
                          <Icon size={22} />
                        </div>
                      </div>

                      <p className="mt-5 text-sm text-gray-500">
                        {stat.title}
                      </p>

                      <p className="mt-1 break-words text-2xl font-extrabold text-gray-900">
                        {stat.value}
                      </p>

                      <p className="mt-2 min-h-8 text-xs leading-5 text-gray-500">
                        {stat.description}
                      </p>

                      <Link
                        to={stat.link}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {stat.action}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SHOPPING ACTIVITY */}
            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Shopping Activity
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your current cart and saved products.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {/* CART ACTIVITY */}
                <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShoppingCart size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Your Shopping Cart
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {cartCount > 0
                        ? `${cartCount} item(s) in your cart`
                        : "Your cart is currently empty"}
                    </p>
                  </div>

                  <Link
                    to="/cart"
                    className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    View
                  </Link>
                </div>

                {/* WISHLIST ACTIVITY */}
                <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <Heart size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Your Wishlist
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {wishlistItems.length > 0
                        ? `${wishlistItems.length} saved product(s)`
                        : "You haven't saved any products yet"}
                    </p>
                  </div>

                  <Link
                    to="/wishlist"
                    className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    View
                  </Link>
                </div>
              </div>
            </section>

            {/* QUICK LINKS */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Quick Links
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to="/shop"
                  className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ShoppingBag size={23} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Browse Products
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Find something you love.
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </Link>

                <Link
                  to="/wishlist"
                  className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                      <Heart size={23} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Saved Products
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Revisit your favourites.
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </Link>
              </div>
            </section>

            {/* FOOTER */}
            <p className="pb-4 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} ShopCart. All rights reserved.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}