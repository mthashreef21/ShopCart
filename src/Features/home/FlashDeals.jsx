import { useState, useEffect } from "react";

import {
  Clock,
  Star,
  Heart,
  ShoppingCart,
  ArrowRight,
  Zap,
  Flame,
} from "lucide-react";

// Illustrative exchange rate; update when needed.
const USD_TO_INR = 88;

function FlashDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60);
  const [wishlist, setWishlist] = useState([]);

  // Fetch products from DummyJSON
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://dummyjson.com/products?limit=0",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        // Select discounted products and show only 3.
        const discountedProducts = data.products
          .filter((product) => product.discountPercentage > 0)
          .slice(0, 3);

        setProducts(discountedProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load products. Please try again.");
          console.error("Product API error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((previousTime) =>
        previousTime > 0 ? previousTime - 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format countdown
  const hours = String(
    Math.floor(timeLeft / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((timeLeft % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Format prices in Indian Rupees
  const formatPrice = (amountInUSD) => {
    const amountInINR = amountInUSD * USD_TO_INR;

    return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discountPercentage) => {
    return formatPrice(
      price * (1 - discountPercentage / 100)
    );
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist((previousWishlist) =>
      previousWishlist.includes(productId)
        ? previousWishlist.filter((id) => id !== productId)
        : [...previousWishlist, productId]
    );
  };

  // Maximum discount among displayed products
  const maximumDiscount =
    products.length > 0
      ? Math.max(
          ...products.map((product) =>
            Math.round(product.discountPercentage)
          )
        )
      : 0;

  return (
    <section
      id="flash-deals"
      className="mx-auto w-[90%] py-10 sm:py-12"
    >
      {/* Section Header */}
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        {/* Heading */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Flame
              size={25}
              className="fill-orange-500 text-orange-500"
            />

            <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
              Limited Time Offers
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Flash Deals
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Grab your favourites before the deals disappear!
          </p>
        </div>

        {/* View All + Countdown */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/shop";
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition hover:text-violet-800"
          >
            View All
            <ArrowRight size={17} />
          </button>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
            <Clock size={22} className="text-orange-500" />

            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                Deals end in
              </p>

              <div className="flex items-center gap-1 font-mono text-xl font-bold text-gray-900">
                <span>{hours}</span>
                <span className="text-orange-500">:</span>
                <span>{minutes}</span>
                <span className="text-orange-500">:</span>
                <span>{seconds}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Product Grid: 3 products in one desktop row */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:col-span-3 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-100"
              >
                <div className="aspect-square bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full rounded-2xl bg-red-50 p-6 text-center">
              <p className="text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="col-span-full py-10 text-center text-gray-500">
              No discounted products are available.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-5"
                  />

                  {/* Discount Badge */}
                  <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white sm:left-3 sm:top-3">
                    -{Math.round(product.discountPercentage)}%
                  </span>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      wishlist.includes(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                  >
                    <Heart
                      size={18}
                      className={
                        wishlist.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-3 sm:p-4">
                  <p className="mb-1 text-xs font-medium capitalize text-violet-600">
                    {product.category.replaceAll("-", " ")}
                  </p>

                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 sm:text-base">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-xs font-semibold text-gray-700">
                      {product.rating.toFixed(1)}
                    </span>

                    <span className="text-xs text-gray-400">
                      / 5
                    </span>
                  </div>

                  {/* Prices */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-gray-900 sm:text-lg">
                      {getDiscountedPrice(
                        product.price,
                        product.discountPercentage
                      )}
                    </span>

                    <span className="text-xs text-gray-400 line-through sm:text-sm">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's Special Card */}
        <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-6 text-white sm:p-8 lg:col-span-1">
          {/* Background Decorations */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-pink-400/20" />

          {/* Promotional Content */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-sm">
              <Zap
                size={15}
                className="fill-yellow-300 text-yellow-300"
              />
              Today's Special
            </span>

            <h3 className="mt-6 text-3xl font-extrabold leading-tight">
              Best Deals
              <span className="block text-yellow-300">
                Just for You!
              </span>
            </h3>

            <p className="mt-4 text-sm leading-6 text-purple-100">
              Discover amazing products at great prices.
              Don't miss your chance to save more.
            </p>
          </div>

          {/* Discount Offer */}
          <div className="relative z-10 mt-6">
            <p className="text-sm text-purple-200">
              Save more on selected products
            </p>

            <p className="mt-2 text-4xl font-extrabold sm:text-5xl">
              Up to

              <span className="block text-yellow-300">
                {maximumDiscount || 50}% OFF
              </span>
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("flash-deals")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-violet-700 transition hover:bg-yellow-300"
            >
              Explore Deals
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlashDeals;