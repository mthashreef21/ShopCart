import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  ShoppingCart,
  Heart,
  UserRound,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
} from "../Features/auth/authService";

function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());

  // Get wishlist products from Redux
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  // Calculate wishlist count
  const wishlistCount = wishlistItems.length;

  // Keep authentication state updated
  useEffect(() => {
    const updateUser = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
  ];

  // Search products
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);

    setIsMenuOpen(false);
  };

  // Logout
  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setIsMenuOpen(false);

    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-3 py-3 md:px-5 lg:gap-4 lg:px-8">

        {/* LOGO + MOBILE MENU */}

        <div className="order-1 flex shrink-0 items-center gap-3">
          <button
            className="rounded-lg p-2 text-gray-800 transition hover:bg-gray-100 xl:hidden"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* ShopCart Logo */}

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200">
              <ShoppingCart size={24} strokeWidth={2.5} />
            </div>

            <span className="hidden text-xl font-extrabold tracking-tight sm:block sm:text-2xl">
              <span className="text-gray-950">Shop</span>
              <span className="text-blue-600">Cart</span>
            </span>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}

        <div className="order-2 hidden shrink-0 items-center gap-5 xl:ml-6 xl:flex 2xl:ml-8 2xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="whitespace-nowrap py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* SEARCH BAR */}

        <form
          onSubmit={handleSearch}
          className="order-4 flex w-full items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 sm:order-3 sm:w-auto sm:min-w-0 sm:flex-1"
        >
          <Search
            size={20}
            className="ml-4 shrink-0 text-gray-500"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search Products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            aria-label="Submit Search"
            className="flex h-11 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition hover:from-blue-700 hover:to-indigo-700 sm:w-14"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </form>

        {/* RIGHT-SIDE ICONS */}

        <div className="order-3 ml-auto flex shrink-0 items-center gap-1 sm:order-4 sm:ml-0 sm:gap-3 lg:gap-5">

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600"
          >
            <span className="relative">
              <Heart size={23} strokeWidth={1.8} />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </span>

            <span className="hidden text-xs font-medium lg:block">
              Wishlist
            </span>
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="group relative flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600"
          >
            <span className="relative">
              <ShoppingCart size={23} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>

            <span className="hidden text-xs font-medium lg:block">
              Cart
            </span>
          </Link>

          {/* ACCOUNT */}

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Dashboard Link */}

              <Link
                to="/dashboard"
                aria-label="Open Dashboard"
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
              >
                <UserRound size={23} strokeWidth={1.8} />

                <span className="hidden max-w-24 truncate text-xs font-medium lg:block">
                  {user.name || "My Account"}
                </span>
              </Link>

            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Login or register"
              className="flex flex-col items-center gap-1 rounded-lg p-2 text-gray-800 transition hover:text-blue-600"
            >
              <UserRound size={23} strokeWidth={1.8} />

              <span className="hidden text-xs font-medium lg:block">
                Login
              </span>
            </Link>
          )}
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-lg xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">

            {/* Home and Shop */}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700 transition hover:text-blue-600 last:border-b-0"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              {user ? (
                <>
                  {/* Dashboard */}

                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <LayoutDashboard size={17} className="mr-2" />

                    Dashboard
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex flex-1 items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} className="mr-2" />

                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}

                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <UserRound size={17} className="mr-2" />

                    Login
                  </Link>

                  {/* Register */}

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile account information */}

            {user && (
              <div className="mt-4 rounded-xl bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="mt-1 break-all text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar