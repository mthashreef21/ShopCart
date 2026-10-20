import { useEffect, useMemo, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";

// Pages
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Dashboard from "./Pages/Dashboard";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/wishlist";
import Shop from "./Pages/Shop";
import Checkout from "./Pages/Checkout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import OrderTracking from "./Pages/OrderTracking";

// Authentication
import ProtectedRoute from "./Features/auth/ProtectedRoute";

function App() {
  // Load saved cart when the application starts
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopcart_cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);

      return [];
    }
  });

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("shopcart_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  // Add product to cart
  const addToCart = (product, qty = 1) => {
    if (!product?.id || !Number.isInteger(qty) || qty <= 0) {
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.stock || 99,
                  (Number(item.quantity) || 0) + qty,
                ),
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: Math.min(product.stock || 99, qty),
        },
      ];
    });
  };

  // Update cart quantity
  const updateQty = (id, qty) => {
    if (!Number.isInteger(qty) || qty < 1) {
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.stock || 99, qty),
            }
          : item,
      ),
    );
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart after successful order placement
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total number of products in the cart
  const cartCount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );
  }, [cart]);

  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar cartCount={cartCount} />

      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}

          {/* Home */}
          <Route
            path="/"
            element={<Home onAdd={addToCart} />}
          />

          {/* Shop */}
          <Route
            path="/shop"
            element={<Shop onAdd={addToCart} />}
          />

          {/* Product Details */}
          <Route
            path="/product/:id"
            element={<ProductDetails onAdd={addToCart} />}
          />

          {/* Cart */}
          <Route
            path="/cart"
            element={
              <Cart
                items={cart}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
                onClear={clearCart}
              />
            }
          />

          {/* Wishlist */}
          <Route
            path="/wishlist"
            element={<Wishlist onAdd={addToCart} />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ==================== PROTECTED ROUTES ==================== */}

          <Route element={<ProtectedRoute />}>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* User Profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Checkout */}
            <Route
              path="/checkout"
              element={
                <Checkout
                  items={cart}
                  onClear={clearCart}
                />
              }
            />

            {/* Orders */}
            <Route
              path="/orders"
              element={<Orders />}
            />

            {/* Order Tracking */}
            <Route
              path="/orders/:id"
              element={<OrderTracking />}
            />
          </Route>

          {/* ==================== FALLBACK ROUTE ==================== */}

          {/* Redirect unknown paths to Home */}
          <Route
            path="*"
            element={<Home onAdd={addToCart} />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;