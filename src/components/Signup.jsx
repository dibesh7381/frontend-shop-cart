import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [notification, setNotification] = useState(null); // for toast
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // show toast
      setNotification({ message: data.message, type: "success" });
      setTimeout(() => setNotification(null), 3000);

      navigate("/login");
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white font-medium transition-transform duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="mb-4 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="mb-6 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

