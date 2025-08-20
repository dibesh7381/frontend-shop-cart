import { useState } from "react";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = () => {
    if (!address) return alert("Please enter your address!");
    alert(
      `Order placed!\nAddress: ${address}\nPayment: ${
        paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"
      }\nTotal: ₹${totalPrice}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
        
        {/* Left: Customer Info */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>

          {/* Delivery Address */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">Payment Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex-1 py-2 rounded-xl border transition ${
                  paymentMethod === "cod"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cash on Delivery
              </button>
              <button
                onClick={() => setPaymentMethod("online")}
                className={`flex-1 py-2 rounded-xl border transition ${
                  paymentMethod === "online"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Online Payment
              </button>
            </div>
          </div>

          {/* Place Order */}
          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-200 pb-2">
              <div>
                <p className="font-medium text-gray-700">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.cartQuantity}</p>
              </div>
              <p className="font-semibold text-gray-800">₹{item.price * item.cartQuantity}</p>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
