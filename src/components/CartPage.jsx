import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} from "../redux/cartSlice";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );

  const handleIncrease = async (item) => {
    if (item.quantity - item.cartQuantity <= 0) return alert("Stock limit reached!");
    try {
      const res = await fetch(
        `https://backend-shop-cart.onrender.com/products/decrease-quantity/${item._id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) dispatch(increaseQuantity(item._id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleDecrease = async (item) => {
    if (item.cartQuantity <= 1) {
      handleRemove(item);
      return;
    }
    try {
      const res = await fetch(
        `https://backend-shop-cart.onrender.com/products/increase-quantity/${item._id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) dispatch(decreaseQuantity(item._id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleRemove = async (item) => {
    try {
      for (let i = 0; i < item.cartQuantity; i++) {
        await fetch(
          `https://backend-shop-cart.onrender.com/products/increase-quantity/${item._id}`,
          { method: "POST", headers: { Authorization: `Bearer ${token}` } }
        );
      }
      dispatch(removeFromCart(item._id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleBuyAll = () => {
    if (!cartItems.length) return;
    alert(`Purchased all items for ₹${totalPrice}`);
    dispatch(clearCart());
  };

  if (!cartItems.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 items-center gap-4"
          >
            {/* Left: Image */}
            <div className="w-full md:w-32 h-40 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Middle + Right: Info + Quantity + Buttons */}
            <div className="flex flex-1 flex-col md:flex-row w-full justify-between items-center md:items-start gap-4">
              {/* Info + Quantity */}
              <div className="flex flex-col justify-center w-full md:w-auto gap-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-700 font-semibold">₹{item.price}</p>
                

                {/* Quantity buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-200 rounded-lg min-w-[30px] text-center">
                    {item.cartQuantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item)}
                    disabled={item.cartQuantity >= item.quantity}
                    className={`px-3 py-1 rounded-lg transition ${
                      item.cartQuantity >= item.quantity
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-400 hover:bg-green-500"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove & Buy Now Buttons */}
              <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto justify-center md:justify-start mt-2 md:mt-0">
                <button
                  onClick={() => handleRemove(item)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex-1 md:flex-none"
                >
                  Remove
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Purchased ${item.name} for ₹${
                        item.price * item.cartQuantity
                      }`
                    )
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex-1 md:flex-none"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Buy All */}
      <div className="mt-6 flex flex-col items-center">
        <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
        <button
          onClick={handleBuyAll}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Buy All
        </button>
      </div>
    </div>
  );
}
