import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState(null); // for toast
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // show toast
      setNotification({ message: "Login successful!", type: "success" });
      setTimeout(() => setNotification(null), 3000); // auto-hide after 3s

      navigate("/"); // redirect to home
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

      {/* Login Form */}
      <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="mb-6 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors"
        >
          Login
        </button>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
