import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, decreaseQuantity, increaseQuantity, clearCart} from "../redux/cartSlice";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );

  const handleIncrease = async (item) => {
    if (item.quantity - item.cartQuantity <= 0)
      return alert("Stock limit reached!");
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
    if (item.cartQuantity <= 1) return handleRemove(item);
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

  const handleRemoveAll = async () => {
    if (!cartItems.length) return;
    const items = cartItems.map((item) => ({
      id: item._id,
      quantity: item.cartQuantity,
    }));
    try {
      await fetch("https://backend-shop-cart.onrender.com/products/increase-many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleBuyAll = () => {
    if (!cartItems.length) return;
    navigate("/checkout");
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

      <div className="flex flex-col gap-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 gap-4 items-center"
          >
            {/* Product Image */}
            <div className="w-full md:w-40 h-40 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1 justify-between w-full gap-2">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-700 font-semibold">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleDecrease(item)}
                  className="px-3 py-1 cursor-pointer bg-yellow-400 rounded-lg hover:bg-yellow-500 transition"
                >
                  -
                </button>
                <span className="px-3 py-1 bg-gray-200 rounded-lg min-w-[30px] text-center">
                  {item.cartQuantity}
                </span>
                <button
                  onClick={() => handleIncrease(item)}
                  disabled={item.cartQuantity >= item.quantity}
                  className={`px-3 py-1 cursor-pointer rounded-lg transition ${
                    item.cartQuantity >= item.quantity
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-400 hover:bg-green-500"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:justify-center md:items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
              <button
                onClick={() => handleRemove(item)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition"
              >
                Remove
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Actions */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleBuyAll}
            className="px-6 py-2 bg-green-600 cursor-pointer text-white rounded-xl hover:bg-green-700 transition"
          >
            Buy All
          </button>
          <button
            onClick={handleRemoveAll}
            className="px-6 py-2 bg-red-600 cursor-pointer text-white rounded-xl hover:bg-red-700 transition"
          >
            Remove All
          </button>
        </div>
      </div>
    </div>
  );
}

