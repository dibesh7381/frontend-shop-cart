// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API = "https://backend-shop-cart.onrender.com";

// // ---------------- Fetch Cart ----------------
// export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
//   const token = localStorage.getItem("token");
//   const res = await fetch(`${API}/cart`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const data = await res.json();
//   const items = (data.items || []).map(item => ({
//     quantity: item.quantity,
//     product: item.productId
//   }));
//   return items;
// });

// // ---------------- Increase Quantity ----------------
// export const increaseItem = createAsyncThunk("cart/increaseItem", async (productId) => {
//   const token = localStorage.getItem("token");
//   await fetch(`${API}/cart/increase`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ productId }),
//   });
//   return productId;
// });

// // ---------------- Decrease Quantity ----------------
// export const decreaseItem = createAsyncThunk("cart/decreaseItem", async (productId) => {
//   const token = localStorage.getItem("token");
//   await fetch(`${API}/cart/decrease`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ productId }),
//   });
//   return productId;
// });

// // ---------------- Remove Item ----------------
// export const removeItem = createAsyncThunk("cart/removeItem", async (productId) => {
//   const token = localStorage.getItem("token");
//   await fetch(`${API}/cart/remove`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ productId }),
//   });
//   return productId;
// });

// // ---------------- Clear Cart ----------------
// export const clearCart = createAsyncThunk("cart/clearCart", async () => {
//   const token = localStorage.getItem("token");
//   await fetch(`${API}/cart/clear`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   });
//   return true;
// });

// // ---------------- Cart Slice ----------------
// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//     uniqueCount: 0,
//   },
//   reducers: {
//     // ✅ Local add for live badge
//     addToCartLocal: (state, action) => {
//       const product = action.payload;
//       const existing = state.items.find(i => i.product?._id === product._id);
//       if (!existing) {
//         state.items.push({ product, quantity: 1 });
//         state.uniqueCount = state.items.length;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     const updateUniqueCount = (state) => {
//       state.uniqueCount = state.items.length;
//     };

//     builder
//       .addCase(fetchCart.pending, (state) => { state.loading = true; })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//         updateUniqueCount(state);
//       })
//       .addCase(fetchCart.rejected, (state) => { state.loading = false; })

//       .addCase(increaseItem.fulfilled, (state, action) => {
//         const item = state.items.find(i => i.product?._id === action.payload);
//         if (item) item.quantity += 1;
//       })
//       .addCase(decreaseItem.fulfilled, (state, action) => {
//         const item = state.items.find(i => i.product?._id === action.payload);
//         if (item && item.quantity > 1) item.quantity -= 1;
//         else state.items = state.items.filter(i => i.product?._id !== action.payload);
//         updateUniqueCount(state);
//       })
//       .addCase(removeItem.fulfilled, (state, action) => {
//         state.items = state.items.filter(i => i.product?._id !== action.payload);
//         updateUniqueCount(state);
//       })
//       .addCase(clearCart.fulfilled, (state) => { 
//         state.items = []; 
//         updateUniqueCount(state);
//       });
//   },
// });

// export const { addToCartLocal } = cartSlice.actions; // ✅ export reducer
// export default cartSlice.reducer;


// redux/cartSlice.js
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
    addItemLocal: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(i => i.product?._id === product._id);
      if (!existing) state.items.push({ product, quantity: 1 });
      state.uniqueCount = state.items.length;
    },
    increaseItemLocal: (state, action) => {
      const item = state.items.find(i => i.product?._id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseItemLocal: (state, action) => {
      const item = state.items.find(i => i.product?._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      else state.items = state.items.filter(i => i.product?._id !== action.payload);
      state.uniqueCount = state.items.length;
    },
    removeItemLocal: (state, action) => {
      state.items = state.items.filter(i => i.product?._id !== action.payload);
      state.uniqueCount = state.items.length;
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.uniqueCount = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCart,
  addItemLocal,
  increaseItemLocal,
  decreaseItemLocal,
  removeItemLocal,
  clearCartLocal,
  setLoading,
} = cartSlice.actions;
export default cartSlice.reducer;

// -------------------- Manual API Helpers --------------------

// Fetch Cart
export const fetchCartAPI = async (dispatch) => {
  dispatch(setLoading(true));
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    // map backend response to local format
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

// Add Item
export const addItemAPI = async (dispatch, product) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    });
    if (res.ok) dispatch(addItemLocal(product));
  } catch (err) {
    console.error("Add Item Error:", err);
  }
};

// Increase Item
export const increaseItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) dispatch(increaseItemLocal(productId));
  } catch (err) {
    console.error("Increase Item Error:", err);
  }
};

// Decrease Item
export const decreaseItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart/decrease`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) dispatch(decreaseItemLocal(productId));
  } catch (err) {
    console.error("Decrease Item Error:", err);
  }
};

// Remove Item
export const removeItemAPI = async (dispatch, productId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) dispatch(removeItemLocal(productId));
  } catch (err) {
    console.error("Remove Item Error:", err);
  }
};

// Clear Cart
export const clearCartAPI = async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/cart/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (res.ok) dispatch(clearCartLocal());
  } catch (err) {
    console.error("Clear Cart Error:", err);
  }
};
