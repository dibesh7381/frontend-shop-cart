
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchCartAPI, increaseItemAPI, decreaseItemAPI, removeItemAPI, clearCartAPI} from "../redux/cartSlice";

export default function CartPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;
  const loading = cart.loading;

  // ---------------- Fetch Cart on mount ----------------
  useEffect(() => {
    if (user) fetchCartAPI(dispatch);
  }, [user, dispatch]);

  // ---------------- Total Price ----------------
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-lg"
        >
          Start Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      {/* ---------------- Cart Items ---------------- */}
      <div className="flex flex-col gap-6">
        {cartItems.map((item) => {
          const product = item.product || {};
          return (
            <div
              key={product._id || Math.random()}
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-4 gap-4 md:items-center"
            >
              {/* Product Image */}
              <div className="w-full md:w-40 h-40 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between gap-2 w-full">
                <h3 className="font-semibold text-lg md:text-xl">
                  {product.name || "Unknown Product"}
                </h3>
                <p className="text-gray-700 font-semibold text-base md:text-lg">
                  ₹{product.price || 0}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      product._id && decreaseItemAPI(dispatch, product._id)
                    }
                    className="px-4 py-2 bg-yellow-400 cursor-pointer rounded-lg hover:bg-yellow-500 text-lg md:text-base font-semibold"
                    disabled={!product._id}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-gray-200 rounded-lg min-w-[40px] text-center text-lg md:text-base">
                    {item.quantity || 0}
                  </span>
                  <button
                    onClick={() =>
                      product._id && increaseItemAPI(dispatch, product._id)
                    }
                    disabled={!product._id || item.quantity >= (product.quantity || 999)}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition text-lg md:text-base font-semibold ${
                      !product._id || item.quantity >= (product.quantity || 999)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-400 hover:bg-green-500"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-4 md:mt-0">
                <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-base md:text-sm">
                  Buy Now
                </button>
                <button
                  onClick={() =>
                    product._id && removeItemAPI(dispatch, product._id)
                  }
                  className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition text-base md:text-sm"
                  disabled={!product._id}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Total Section ---------------- */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-xl md:text-2xl font-bold">Total: ₹{totalPrice}</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-6 py-3 cursor-pointer bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-lg md:text-base">
            Buy All
          </button>
          <button
            onClick={() => clearCartAPI(dispatch)}
            className="px-6 py-3 cursor-pointer bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-lg md:text-base"
          >
            Remove All
          </button>
        </div>
      </div>
    </div>
  );
}

