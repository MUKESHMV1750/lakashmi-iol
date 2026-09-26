import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || []; }
  catch { return []; }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    savedForLater: [],
  },
  reducers: {
    loadCartFromStorage: (state) => {
      state.items = loadCart();
    },
    addToCart: (state, action) => {
      const { product, quantity = 1, size } = action.payload;
      const key = `${product._id}-${size || 'default'}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        existing.quantity += quantity;
        toast.success('Cart updated!');
      } else {
        state.items.push({
          key,
          product,
          quantity,
          size,
          price: product.salePrice || product.price,
        });
        toast.success(`${product.name} added to cart!`);
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.key !== action.payload);
      saveCart(state.items);
      toast.success('Item removed from cart');
    },
    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find((i) => i.key === key);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.key !== key);
        } else {
          item.quantity = quantity;
        }
        saveCart(state.items);
      }
    },
    saveForLater: (state, action) => {
      const item = state.items.find((i) => i.key === action.payload);
      if (item) {
        state.savedForLater.push(item);
        state.items = state.items.filter((i) => i.key !== action.payload);
        saveCart(state.items);
        toast.success('Saved for later');
      }
    },
    moveToCart: (state, action) => {
      const item = state.savedForLater.find((i) => i.key === action.payload);
      if (item) {
        state.items.push(item);
        state.savedForLater = state.savedForLater.filter((i) => i.key !== action.payload);
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
});

// Selectors
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const {
  loadCartFromStorage, addToCart, removeFromCart, updateQuantity,
  saveForLater, moveToCart, clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
