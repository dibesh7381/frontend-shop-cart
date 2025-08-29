
// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const API = "https://backend-shop-cart.onrender.com";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    uniqueCount: 0,
    loading: false,
  },
  reducers: {

    setCart: (state, action) => {
      state.items = action.payload;
      state.uniqueCount = state.items.length;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCart, setLoading } = cartSlice.actions;
export default cartSlice.reducer;

// -------------------- Backend-first API Helpers --------------------

// Fetch cart from backend
export const fetchCartAPI = async (dispatch) => {
  dispatch(setLoading(true));
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const items = (data.items || []).map(item => ({
      product: item.productId,
      quantity: item.quantity,
    }));
    dispatch(setCart(items));
  } catch (err) {
    console.error("Fetch Cart Error:", err);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add item to cart via backend
export const addItemAPI = async (dispatch, product) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    });
    await fetchCartAPI(dispatch);
  } catch (err) {
    console.error("Add Item Error:", err);
  }
};

// Increase item quantity via backend
export const increaseItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API}/cart/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    await fetchCartAPI(dispatch);
  } catch (err) {
    console.error("Increase Item Error:", err);
  }
};

// Decrease item quantity via backend
export const decreaseItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API}/cart/decrease`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    await fetchCartAPI(dispatch);
  } catch (err) {
    console.error("Decrease Item Error:", err);
  }
};

// Remove item from cart via backend
export const removeItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    await fetchCartAPI(dispatch);
  } catch (err) {
    console.error("Remove Item Error:", err);
  }
};

// Clear entire cart via backend
export const clearCartAPI = async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${API}/cart/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    await fetchCartAPI(dispatch);
  } catch (err) {
    console.error("Clear Cart Error:", err);
  }
};
