import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // Add a product or increase its quantity
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      if (!product?.id || quantity <= 0) return;

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.stock || 99,
          existingItem.quantity + quantity
        );
      } else {
        state.items.push({
          ...product,
          quantity: Math.min(product.stock || 99, quantity),
        });
      }
    },

    // Update product quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(
        (item) => item.id === id
      );

      if (item && Number.isInteger(quantity) && quantity > 0) {
        item.quantity = Math.min(
          item.stock || 99,
          quantity
        );
      }
    },

    // Remove a product
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Empty the cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;