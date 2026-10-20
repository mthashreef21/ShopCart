import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Layouts/Navbar";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Footer from "./Layouts/Footer";
import Wishlist from "./Pages/wishlist";
import Shop from "./Pages/Shop";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  // Load the saved cart when the app starts
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopcart_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // Save the cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("shopcart_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  // Add product to cart
  const addToCart = (product, qty = 1) => {
    if (!product?.id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.stock || 99,
                  item.quantity + qty
                ),
              }
            : item
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
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.stock || 99, qty),
            }
          : item
      )
    );
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Calculate cart count
  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
    [cart]
  );

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={<Home onAdd={addToCart} />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails onAdd={addToCart} />}
          />

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

          <Route path="/wishlist" element={<Wishlist onAdd={addToCart} />}/>

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="*"element={<Home onAdd={addToCart} />}/>
          
          <Route path="/shop" element={<Shop onAdd={addToCart} />}/>
        
        
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;