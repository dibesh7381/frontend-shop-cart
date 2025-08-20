import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const saveToLocalStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.cartQuantity += 1;
      } else {
        state.items.push({ ...item, cartQuantity: 1 });
      }
      saveToLocalStorage(state.items);
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((i) => i._id === id);
      if (existing) existing.cartQuantity += 1;
      saveToLocalStorage(state.items);
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((i) => i._id === id);
      if (existing) {
        existing.cartQuantity -= 1;
        if (existing.cartQuantity <= 0) {
          state.items = state.items.filter((i) => i._id !== id);
        }
      }
      saveToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage(state.items);
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
