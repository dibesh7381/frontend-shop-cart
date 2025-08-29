
// import { createSlice } from "@reduxjs/toolkit";

// const API = "https://backend-shop-cart.onrender.com";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//     uniqueCount: 0,
//     loading: false,
//   },
//   reducers: {
//     setCart: (state, action) => {
//       state.items = action.payload;
//       state.uniqueCount = state.items.length;
//     },
//     addItemLocal: (state, action) => {
//       const product = action.payload;
//       const existing = state.items.find(i => i.product?._id === product._id);
//       if (!existing) state.items.push({ product, quantity: 1 });
//       state.uniqueCount = state.items.length;
//     },
//     increaseItemLocal: (state, action) => {
//       const item = state.items.find(i => i.product?._id === action.payload);
//       if (item) item.quantity += 1;
//     },
//     decreaseItemLocal: (state, action) => {
//       const item = state.items.find(i => i.product?._id === action.payload);
//       if (item && item.quantity > 1) item.quantity -= 1;
//       else state.items = state.items.filter(i => i.product?._id !== action.payload);
//       state.uniqueCount = state.items.length;
//     },
//     removeItemLocal: (state, action) => {
//       state.items = state.items.filter(i => i.product?._id !== action.payload);
//       state.uniqueCount = state.items.length;
//     },
//     clearCartLocal: (state) => {
//       state.items = [];
//       state.uniqueCount = 0;
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//   },
// });

// export const {  setCart, addItemLocal, increaseItemLocal, decreaseItemLocal, removeItemLocal, clearCartLocal, setLoading,} = cartSlice.actions;
// export default cartSlice.reducer;

// // -------------------- Manual API Helpers --------------------

// // Fetch Cart
// export const fetchCartAPI = async (dispatch) => {
//   dispatch(setLoading(true));
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     // map backend response to local format
//     const items = (data.items || []).map(item => ({
//       product: item.productId,
//       quantity: item.quantity,
//     }));
//     dispatch(setCart(items));
//   } catch (err) {
//     console.error("Fetch Cart Error:", err);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // Add Item
// export const addItemAPI = async (dispatch, product) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ productId: product._id, quantity: 1 }),
//     });
//     if (res.ok) dispatch(addItemLocal(product));
//   } catch (err) {
//     console.error("Add Item Error:", err);
//   }
// };

// // Increase Item
// export const increaseItemAPI = async (dispatch, productId) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart/increase`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ productId }),
//     });
//     if (res.ok) dispatch(increaseItemLocal(productId));
//   } catch (err) {
//     console.error("Increase Item Error:", err);
//   }
// };

// // Decrease Item
// export const decreaseItemAPI = async (dispatch, productId) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart/decrease`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ productId }),
//     });
//     if (res.ok) dispatch(decreaseItemLocal(productId));
//   } catch (err) {
//     console.error("Decrease Item Error:", err);
//   }
// };

// // Remove Item
// export const removeItemAPI = async (dispatch, productId) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart/remove`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ productId }),
//     });
//     if (res.ok) dispatch(removeItemLocal(productId));
//   } catch (err) {
//     console.error("Remove Item Error:", err);
//   }
// };

// // Clear Cart
// export const clearCartAPI = async (dispatch) => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await fetch(`${API}/cart/clear`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     });
//     if (res.ok) dispatch(clearCartLocal());
//   } catch (err) {
//     console.error("Clear Cart Error:", err);
//   }
// };


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
    // Backend se aaya hua cart set kare
    setCart: (state, action) => {
      state.items = action.payload;
      state.uniqueCount = state.items.length;
    },
    // Loading state track karne ke liye
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
