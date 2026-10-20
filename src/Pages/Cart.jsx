import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import { formatPrice, toINR } from "../utils/price";

const FREE_SHIPPING_THRESHOLD = 499;

export default function Cart({ items = [], onUpdateQty, onRemove, onClear }) {
  const totals = useMemo(() => {
    let mrp = 0;
    let payable = 0;
    let count = 0;
    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      count += qty;
      mrp += Number(item.price) * toINR(1) * qty;
      const net = Number(item.price) * (1 - Number(item.discountPercentage || 0) / 100);
      payable += net * toINR(1) * qty;
    });
    const savings = mrp - payable;
    const delivery = payable === 0 || payable >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
    return { mrp, payable, savings, delivery, grand: payable + delivery, count };
  }, [items]);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <ShoppingCart size={36} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-500">Looks like you haven&apos;t added anything yet. Explore flash deals and grab your favourites.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700">
            Continue Shopping <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-gray-500">{totals.count} item{totals.count > 1 ? "s" : ""} in your cart</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50">
            Continue Shopping
          </Link>
          <button type="button" onClick={onClear} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">
            Clear Cart
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const net = Number(item.price) * (1 - Number(item.discountPercentage || 0) / 100);
            return (
              <div key={item.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:gap-4 sm:p-4">
                <Link to={`/product/${item.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">
                  <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain p-2" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-violet-600">{item.category}</p>
                      <Link to={`/product/${item.id}`} className="line-clamp-1 text-sm font-bold text-gray-900 hover:text-violet-700 sm:text-base">
                        {item.title}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove?.(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-gray-900">{formatPrice(net)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</span>
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-bold text-green-700">
                      {Math.round(item.discountPercentage)}% OFF
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-xl border border-gray-200">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQty?.(item.id, Math.max(1, item.quantity - 1))}
                        className="flex h-9 w-9 items-center justify-center text-gray-600 hover:text-violet-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => onUpdateQty?.(item.id, Math.min(item.stock || 99, item.quantity + 1))}
                        className="flex h-9 w-9 items-center justify-center text-gray-600 hover:text-violet-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      Subtotal: {formatPrice(net * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-3 rounded-2xl bg-violet-50 p-4 text-sm text-violet-900">
            <Truck size={20} className="shrink-0" />
            {totals.delivery === 0 ? (
              <p><span className="font-bold">You unlocked FREE shipping!</span> on this order.</p>
            ) : (
              <p>Add <span className="font-bold">{formatPrice((FREE_SHIPPING_THRESHOLD - totals.payable) / toINR(1))}</span> more to get FREE shipping.</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-extrabold text-gray-900">Order Summary</h2>

          <dl className="mt-5 space-y-2.5 border-t border-dashed border-gray-200 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal (MRP)</dt><dd className="font-semibold line-through decoration-gray-300">₹{Math.round(totals.mrp).toLocaleString("en-IN")}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Discount on MRP</dt><dd className="font-semibold text-green-600">− ₹{Math.round(totals.savings).toLocaleString("en-IN")}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Delivery</dt><dd className={`font-semibold ${totals.delivery === 0 ? "text-green-600" : ""}`}>{totals.delivery === 0 ? "FREE" : `₹${totals.delivery}`}</dd></div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold text-gray-900"><dt>Total</dt><dd>₹{Math.max(0, Math.round(totals.grand)).toLocaleString("en-IN")}</dd></div>
          </dl>

          <p className="mt-2 text-xs text-green-700">You save ₹{Math.round(totals.savings).toLocaleString("en-IN")} on this order</p>

          <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700">
            Proceed to Checkout <ArrowRight size={17} />
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-green-600" /> Safe & secure payments
          </p>
          <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Heart size={16} /> Move all to Wishlist
          </button>
        </aside>
      </div>
    </div>
  );
}
