import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, qty } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (existingItem) {
        existingItem.qty = qty;
        toast.info('Cart updated');
      } else {
        state.items.push({ product, qty });
        toast.success('Added to cart');
      }
      
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
      saveCartToStorage(state.items);
      toast.info('Removed from cart');
    },
    updateCartItemQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      if (item) {
        item.qty = qty;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQty, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => 
  state.cart.items.reduce((total, item) => total + item.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + (item.product.price * item.qty), 0);

export default cartSlice.reducer;