import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../Features/orders/orderService";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

import { formatPrice, toINR } from "../utils/price";
import { getCurrentUser } from "../Features/auth/authService";

const FREE_SHIPPING_THRESHOLD = 499;
const DELIVERY_FEE = 49;

const ADDRESS_KEY = "shopcart_delivery_address";
const ORDERS_KEY = "shopcart_orders";

const INITIAL_ADDRESS = {
  fullName: "",
  phone: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

function calculateTotals(items) {
  let mrp = 0;
  let payable = 0;
  let count = 0;

  items.forEach((item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discountPercentage) || 0;

    count += quantity;
    mrp += toINR(price) * quantity;
    payable += toINR(price * (1 - discount / 100)) * quantity;
  });

  const savings = Math.max(0, mrp - payable);
  const delivery =
    payable === 0 || payable >= FREE_SHIPPING_THRESHOLD
      ? 0
      : DELIVERY_FEE;

  return {
    mrp,
    payable,
    savings,
    delivery,
    grand: payable + delivery,
    count,
  };
}

function readSavedAddress() {
  try {
    const saved = localStorage.getItem(ADDRESS_KEY);

    return saved
      ? { ...INITIAL_ADDRESS, ...JSON.parse(saved) }
      : INITIAL_ADDRESS;
  } catch {
    return INITIAL_ADDRESS;
  }
}

function readOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function Checkout({ items = [], onClear }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState(readSavedAddress);
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totals = useMemo(() => calculateTotals(items), [items]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: name === "phone" || name === "pincode"
        ? value.replace(/\D/g, "")
        : value,
    }));

    setError("");
  };

  const validateAddress = () => {
    if (
      !address.fullName.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      return "Please complete all required delivery address fields.";
    }

    if (address.phone.length !== 10) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
      return "Enter a valid 6-digit Indian PIN code.";
    }

    if (items.length === 0 || totals.count <= 0) {
      return "Your cart is empty. Add products before checking out.";
    }

    return "";
  };

  const handlePlaceOrder = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login", {
        replace: true,
        state: { from: { pathname: "/checkout" } },
      });
      return;
    }

    const validationError = validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsPlacingOrder(true);
    setError("");

    try {
      const existingOrders = readOrders();

      const order = {
        id: `SC-${Date.now().toString(36).toUpperCase()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        placedAt: new Date().toISOString(),
        status: "Order Placed",

        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          price: Number(item.price) || 0,
          discountPercentage: Number(item.discountPercentage) || 0,
          quantity: Number(item.quantity) || 1,
        })),

        address: {
          ...address,
        },

        payment,

        totals: {
          mrp: totals.mrp,
          savings: totals.savings,
          delivery: totals.delivery,
          grand: totals.grand,
        },
      };

      // Save the address for the next checkout.
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));

      // Save the order before clearing the cart.
      createOrder(order);

      // Clear the cart only after the order has been saved.
      if (typeof onClear === "function") {
        onClear();
      }

      navigate("/orders", {
        replace: true,
        state: {
          orderPlaced: true,
          orderId: order.id,
        },
      });
    } catch (storageError) {
      console.error("Unable to place order:", storageError);
      setError(
        "We couldn't save your order. Your cart has not been intentionally cleared. Please try again.",
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const labelClass = "text-sm font-semibold text-gray-700";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <ShoppingBag size={36} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add some products before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-700"
        >
          Continue Shopping <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-violet-700"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Complete your delivery details and place your order.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Checkout form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery address */}
          <section className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Delivery Address
                </h2>
                <p className="text-xs text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="phone">
                  Mobile Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={address.phone}
                  onChange={handleAddressChange}
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="pincode">
                  PIN Code *
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={address.pincode}
                  onChange={handleAddressChange}
                  autoComplete="postal-code"
                  placeholder="6-digit PIN code"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="address">
                  House No. and Street Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={address.address}
                  onChange={handleAddressChange}
                  autoComplete="street-address"
                  placeholder="House number, building, street and area"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="landmark">
                  Landmark (Optional)
                </label>
                <input
                  id="landmark"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleAddressChange}
                  placeholder="Nearby landmark"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="city">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  autoComplete="address-level2"
                  placeholder="Enter city"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="state">
                  State *
                </label>
                <input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  autoComplete="address-level1"
                  placeholder="Enter state"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Wallet size={21} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Payment Method
                </h2>
                <p className="text-xs text-gray-500">
                  Choose how you want to pay.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  payment === "cod"
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="mt-1 accent-violet-600"
                />

                <Truck size={21} className="mt-0.5 text-violet-700" />

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Pay when your order arrives at your doorstep.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  payment === "online"
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={payment === "online"}
                  onChange={() => setPayment("online")}
                  className="mt-1 accent-violet-600"
                />

                <CreditCard
                  size={21}
                  className="mt-0.5 text-violet-700"
                />

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Online Payment (Demo)
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Demonstration option only. No real payment will be
                    processed.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <ShoppingBag size={19} className="text-violet-600" />
            <h2 className="text-lg font-extrabold text-gray-900">
              Order Summary
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {totals.count} item{totals.count === 1 ? "" : "s"} in your order
          </p>

          <div className="mt-5 max-h-64 space-y-4 overflow-y-auto">
            {items.map((item) => {
              const discount = Number(item.discountPercentage) || 0;
              const unitPrice = toINR(
                Number(item.price) * (1 - discount / 100),
              );

              return (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      ₹
                      {(unitPrice * Number(item.quantity || 0)).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 space-y-3 border-t border-dashed border-gray-200 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Subtotal (MRP)</span>
              <span className="font-medium text-gray-800">
                {formatPrice(totals.mrp / 88)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Discount</span>
              <span className="font-semibold text-green-600">
                − ₹{totals.savings.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Delivery</span>
              <span
                className={`font-semibold ${
                  totals.delivery === 0 ? "text-green-600" : "text-gray-800"
                }`}
              >
                {totals.delivery === 0
                  ? "FREE"
                  : `₹${totals.delivery.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span>₹{totals.grand.toLocaleString("en-IN")}</span>
            </div>

            <p className="text-xs text-green-700">
              You save ₹{totals.savings.toLocaleString("en-IN")} on this order.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlacingOrder ? (
              "Placing Order..."
            ) : (
              <>
                Place Order <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-xs leading-5 text-green-800">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            <p>
              Your order details will be saved to your ShopCart demo account.
              Online payments are not processed.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <CheckCircle2 size={14} className="text-green-600" />
            Review your details before placing your order.
          </div>
        </aside>
      </div>
    </div>
  );
}