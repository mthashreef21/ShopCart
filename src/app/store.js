import { configureStore } from "@reduxjs/toolkit";

import wishlistReducer from "../Features/wishlist/wishlistSlice";
import cartReducer from "../Features/cart/cartSlice";

// Load saved data from localStorage
const loadState = (key) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : [];
  } catch {
    return [];
  }
};

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
  },

  preloadedState: {
    wishlist: {
      items: loadState("wishlist"),
    },
    cart: {
      items: loadState("cart"),
    },
  },
});

// Save data whenever Redux state changes
store.subscribe(() => {
  try {
    const state = store.getState();

    localStorage.setItem(
      "wishlist",
      JSON.stringify(state.wishlist.items)
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(state.cart.items)
    );
  } catch (error) {
    console.error("Failed to save cart or wishlist:", error);
  }
});