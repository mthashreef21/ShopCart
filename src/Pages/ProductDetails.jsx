import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { formatPrice, getDiscountedPrice } from "../utils/price";

function RatingStars({ rating = 0 }) {
  const full = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < full ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function ProductDetails({ onAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState([]);
  const [wished, setWished] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setActiveImage(0);
        setQty(1);
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load this product. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    if (id) load();
    window.scrollTo({ top: 0 });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    const controller = new AbortController();
    async function loadRelated() {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/category/${product.category}?limit=8`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setRelated((data.products || []).filter((p) => p.id !== product.id).slice(0, 4));
      } catch {
        /* ignore */
      }
    }
    loadRelated();
    return () => controller.abort();
  }, [product]);

  const images = useMemo(() => {
    if (!product) return [];
    const list = product.images?.length ? product.images : [product.thumbnail];
    return list.slice(0, 5);
  }, [product]);

  const handleAdd = (goToCart = false) => {
    if (!product) return;
    onAdd?.(
      {
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        category: product.category,
        stock: product.stock,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    if (goToCart) navigate("/cart");
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      setPinMessage("Delivery available by tomorrow. Free shipping on this item.");
    } else {
      setPinMessage("Please enter a valid 6-digit pincode.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-[90%] max-w-[1200px] animate-pulse py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-12 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-[90%] max-w-[1200px] py-16 text-center">
        <p className="text-lg font-semibold text-gray-900">Product not found</p>
        <p className="mt-2 text-sm text-gray-500">{error || "This product may have been removed."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
          <Link to="/" className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="mx-auto w-[90%] max-w-[1200px] py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:text-sm" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-violet-600">Home</Link>
        <ChevronRight size={14} />
        <span className="capitalize">{String(product.category).replaceAll("-", " ")}</span>
        <ChevronRight size={14} />
        <span className="line-clamp-1 max-w-[220px] font-medium text-gray-800 sm:max-w-[420px]">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
            <img
              key={images[activeImage]}
              src={images[activeImage]}
              alt={product.title}
              className="aspect-square w-full object-contain p-6 sm:p-10"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute left-4 top-4 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            <button
              type="button"
              onClick={() => setWished((v) => !v)}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
            >
              <Heart size={19} className={wished ? "fill-red-500 text-red-500" : "text-gray-600"} />
            </button>
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 bg-gray-50 transition ${
                    i === activeImage ? "border-violet-600" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img src={src} alt={`${product.title} view ${i + 1}`} loading="lazy" className="aspect-square w-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            {String(product.category).replaceAll("-", " ")} · {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RatingStars rating={product.rating} />
            <span className="text-sm font-semibold text-gray-700">{Number(product.rating).toFixed(1)}</span>
            <span className="text-sm text-gray-400">· {product.reviews?.length ?? 0} reviews</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {getDiscountedPrice(product.price, product.discountPercentage)}
            </span>
            <span className="pb-1 text-base text-gray-400 line-through">{formatPrice(product.price)}</span>
            <span className="mb-1 rounded-md bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700">
              Save {Math.round(product.discountPercentage)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{product.description}</p>

          {/* Qty + CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-gray-200">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-gray-700 hover:text-violet-600 disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center text-base font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-gray-700 hover:text-violet-600"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleAdd(false)}
              disabled={!inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50 sm:flex-none sm:px-8"
            >
              <ShoppingCart size={18} />
              {justAdded ? "Added!" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => handleAdd(true)}
              disabled={!inStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50 sm:flex-none sm:px-8"
            >
              <Zap size={18} />
              Buy Now
            </button>
          </div>

          {/* Pincode */}
          <form onSubmit={checkPincode} className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-900">Delivery options</p>
            <div className="mt-2 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="Enter pincode"
                aria-label="Enter pincode"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50">
                Check
              </button>
            </div>
            {pinMessage && <p className="mt-2 text-xs text-gray-600">{pinMessage}</p>}
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-3">
              <span className="flex items-center gap-1.5"><Truck size={15} className="text-violet-600" /> Free shipping ₹499+</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={15} className="text-violet-600" /> 7-day returns</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-violet-600" /> Secure checkout</span>
            </div>
          </form>

          {/* Meta */}
          <dl className="mt-5 space-y-1.5 text-sm text-gray-600">
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold text-gray-900">SKU</dt><dd>SHC-{product.id}-{product.sku || "000"}</dd></div>
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold text-gray-900">Brand</dt><dd>{product.brand}</dd></div>
            <div className="flex gap-2"><dt className="w-20 shrink-0 font-semibold text-gray-900">Weight</dt><dd>{product.weight} kg</dd></div>
          </dl>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        <div className="flex border-b border-gray-100">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-sm font-bold capitalize transition ${
                activeTab === tab ? "border-b-2 border-violet-600 text-violet-700" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab} {tab === "reviews" && `(${product.reviews?.length ?? 0})`}
            </button>
          ))}
        </div>
        <div className="p-5 sm:p-7">
          {activeTab === "description" ? (
            <div className="max-w-3xl space-y-3 text-sm leading-6 text-gray-600">
              <p>{product.description}</p>
              <p>Dimensions: {product.dimensions?.width} x {product.dimensions?.height} x {product.dimensions?.depth} cm. Warranty: {product.warrantyInformation}. Shipping: {product.shippingInformation}.</p>
              <p>Return policy: {product.returnPolicy}. Minimum order quantity: {product.minimumOrderQuantity}.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {(product.reviews || []).map((r, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 p-4">
                  <RatingStars rating={r.rating} />
                  <p className="mt-2 text-sm text-gray-700">“{r.comment}”</p>
                  <p className="mt-3 text-xs font-semibold text-gray-900">{r.reviewerName}</p>
                  <p className="text-xs text-gray-400">{r.reviewerEmail} · {new Date(r.date).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
              {(!product.reviews || product.reviews.length === 0) && (
                <p className="text-sm text-gray-500">No reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">Related Products</h2>
            <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-800">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square bg-gray-50">
                  <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-contain p-4 transition group-hover:scale-105" />
                  <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    -{Math.round(p.discountPercentage)}%
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{p.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold">{getDiscountedPrice(p.price, p.discountPercentage)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
