import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpDown,
  Package,
} from "lucide-react";

import { toggleWishlist } from "../Features/wishlist/wishlistSlice";

const PRODUCTS_PER_PAGE = 12;

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Shop({ onAdd }) {
  const dispatch = useDispatch();

  // Redux wishlist
  const wishlistItems = useSelector((state) => state.wishlist?.items ?? []);

  // Component state
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    price: true,
    rating: true,
    availability: true,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products and categories
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const productsResponse = await fetch(
          "https://dummyjson.com/products?limit=0",
          { signal: controller.signal }
        );

        if (!productsResponse.ok) {
          throw new Error("Unable to load products.");
        }

        const productsData = await productsResponse.json();
        setProducts(productsData.products ?? []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not load products. Please try again.");
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

  // Brands are based on the products returned by the API.
  const brands = useMemo(
    () =>
      [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
    [products]
  );

  // Apply search and selected filters.
  const filteredProducts = useMemo(() => {
    let result = [...products];
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.brand?.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    if (minPrice !== "") {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating);
    }

    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  // Reset pagination whenever search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedBrands, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  // Wishlist
  const isWishlisted = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  const handleWishlist = (product) => {
    dispatch(toggleWishlist(product));
  };

  // Clear all filters while preserving the current sort choice.
  const clearFilters = () => {
    setSearch("");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search !== "" ||
    selectedBrands.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page heading */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Discover your favourites
          </p>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Explore Our <span className="text-blue-600">Products</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Find the perfect products for your lifestyle. Discover great
                deals across all your favourite categories.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Package className="h-6 w-6 text-blue-600" />

              <div>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? "..." : products.length}
                </p>

                <p className="text-xs text-gray-500">Products available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main shop content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and sorting */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or brands..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition lg:hidden ${
                showFilters
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <div className="relative flex-1 lg:w-60 lg:flex-none">
              <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
              >
                <option value="default">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products and filters */}
        <div className="flex items-start gap-7">
          {/* Filters sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white lg:sticky lg:top-6 lg:block lg:w-64`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <h2 className="font-semibold text-gray-900">Filters</h2>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Brand */}
            <section className="border-b border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setExpandedFilters((prev) => ({ ...prev, brand: !prev.brand }))
                }
                className="flex w-full items-center justify-between p-4 text-sm font-semibold"
              >
                BRAND
                {expandedFilters.brand ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>

              {expandedFilters.brand && (
                <div className="max-h-52 space-y-3 overflow-y-auto px-4 pb-4">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          setSelectedBrands((prev) =>
                            prev.includes(brand)
                              ? prev.filter((item) => item !== brand)
                              : [...prev, brand]
                          )
                        }
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                  {brands.length === 0 && (
                    <p className="text-sm text-gray-400">No brands available</p>
                  )}
                </div>
              )}
            </section>

            {/* Price range */}
            <section className="border-b border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setExpandedFilters((prev) => ({ ...prev, price: !prev.price }))
                }
                className="flex w-full items-center justify-between p-4 text-sm font-semibold"
              >
                PRICE RANGE
                {expandedFilters.price ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>

              {expandedFilters.price && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min ₹"
                      className="w-full min-w-0 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max ₹"
                      className="w-full min-w-0 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  {minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice) && (
                    <p className="mt-2 text-xs text-red-500">
                      Minimum must not exceed maximum.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Customer rating */}
            <section className="border-b border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setExpandedFilters((prev) => ({ ...prev, rating: !prev.rating }))
                }
                className="flex w-full items-center justify-between p-4 text-sm font-semibold"
              >
                CUSTOMER RATING
                {expandedFilters.rating ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>

              {expandedFilters.rating && (
                <div className="space-y-3 px-4 pb-4">
                  {[4, 3].map((rating) => (
                    <label
                      key={rating}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
                    >
                      <input
                        type="radio"
                        name="customerRating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span className="flex items-center gap-1">
                        {rating}
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        &amp; above
                      </span>
                    </label>
                  ))}
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="customerRating"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    All ratings
                  </label>
                </div>
              )}
            </section>

            {/* Availability */}
            <section>
              <button
                type="button"
                onClick={() =>
                  setExpandedFilters((prev) => ({
                    ...prev,
                    availability: !prev.availability,
                  }))
                }
                className="flex w-full items-center justify-between p-4 text-sm font-semibold"
              >
                AVAILABILITY
                {expandedFilters.availability ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>

              {expandedFilters.availability && (
                <label className="flex cursor-pointer items-center gap-3 px-4 pb-4 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  In Stock Only
                </label>
              )}
            </section>
          </aside>

          {/* Product area */}
          <div className="min-w-0 flex-1">
            {/* Result count */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {loading
                    ? 0
                    : filteredProducts.length === 0
                      ? 0
                      : startIndex + 1}
                  {"–"}
                  {Math.min(
                    startIndex + PRODUCTS_PER_PAGE,
                    filteredProducts.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                  >
                    <div className="h-52 animate-pulse bg-gray-100" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                      <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
                <p className="font-semibold text-red-600">{error}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products */}
            {!loading && !error && visibleProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const wished = isWishlisted(product.id);

                  return (
                    <article
                      key={product.id}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-gray-200/60"
                    >
                      {/* Product image */}
                      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-50 p-5">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex h-full w-full items-center justify-center"
                        >
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            loading="lazy"
                            onError={(e) => {
                              const image = e.currentTarget;
                              const fallbackImage = product.images?.[0];

                              if (
                                fallbackImage &&
                                image.src !== fallbackImage &&
                                !image.dataset.fallbackAttempted
                              ) {
                                image.dataset.fallbackAttempted = "true";
                                image.src = fallbackImage;
                              } else {
                                image.style.display = "none";
                              }
                            }}
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                          />
                        </Link>

                        {product.discountPercentage > 0 && (
                          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            -{Math.round(product.discountPercentage)}%
                          </span>
                        )}

                        <button
                          onClick={() => handleWishlist(product)}
                          aria-label={
                            wished ? "Remove from wishlist" : "Add to wishlist"
                          }
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
                            wished
                              ? "bg-red-50 text-red-500"
                              : "bg-white text-gray-500 hover:bg-red-50 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            size={18}
                            className={wished ? "fill-current" : ""}
                          />
                        </button>
                      </div>

                      {/* Product details */}
                      <div className="p-4">
                        <p className="mb-2 text-xs font-medium capitalize text-gray-400">
                          {product.brand || product.category}
                        </p>

                        <Link to={`/product/${product.id}`}>
                          <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-900 transition hover:text-blue-600">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="mt-2 flex items-center gap-1.5">
                          <Star
                            size={15}
                            className="fill-amber-400 text-amber-400"
                          />

                          <span className="text-sm font-semibold text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>

                          <span className="text-xs text-gray-400">
                            ({product.reviews?.length ?? 0} reviews)
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-lg font-extrabold text-gray-900">
                              {formatPrice(product.price)}
                            </p>

                            {product.discountPercentage > 0 && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(
                                  product.price /
                                    (1 - product.discountPercentage / 100),
                                )}
                              </p>
                            )}
                          </div>

                          <span
                            className={`text-xs font-medium ${
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {product.stock > 0 ? "In stock" : "Out of stock"}
                          </span>
                        </div>

                        <button
                          disabled={product.stock <= 0}
                          onClick={() => onAdd?.(product, 1)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <ShoppingCart size={17} />

                          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Search className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or adjusting your filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safePage) <= 1,
                  )
                  .map((page, index, pages) => (
                    <span key={page} className="contents">
                      {index > 0 && page - pages[index - 1] > 1 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}

                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                          safePage === page
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}