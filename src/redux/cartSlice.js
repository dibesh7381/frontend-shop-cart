import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user._id : "guest"; // 🟢 guest ke liye separate cart
};

const loadCart = () => {
  const userId = getUserId();
  return JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
};

const saveCart = (items) => {
  const userId = getUserId();
  localStorage.setItem(`cartItems_${userId}`, JSON.stringify(items));
};

const initialState = {
  items: loadCart(),
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
      saveCart(state.items);
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((i) => i._id === id);
      if (existing) existing.cartQuantity += 1;
      saveCart(state.items);
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
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    reloadCart: (state) => {
      state.items = loadCart(); // 🟢 reload current user/guest cart
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, reloadCart } = cartSlice.actions;
export default cartSlice.reducer;
