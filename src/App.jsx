import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Layouts/Navbar'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty = 1) => {
    if (!product?.id) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.stock || 99, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <main className='min-h-screen bg-gray-50'>
        <Routes>
          <Route path="/" element={<Home onAdd={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails onAdd={addToCart} />} />
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
          <Route path="*" element={<Home onAdd={addToCart} />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
