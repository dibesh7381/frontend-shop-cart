import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null); // logout state
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching profile");

        setUser(data.user);
      } catch (err) {
        console.error(err.message);
        setUser(null); // agar token invalid ho toh logout state
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  const handleClick = () => {
    if (!user) return;
    if (user.role === "seller") navigate("/seller");
    else navigate("/products");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {!user ? (
        // Logged out view
        <div className="p-8 rounded-xl shadow-lg bg-purple-50 text-center text-purple-800 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome to ShopCart!</h2>
          <p className="text-base mb-6">
            🚀 Explore amazing products or start selling with your own dashboard. Please login or signup to continue.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Login / Signup
          </button>
        </div>
      ) : user.role === "seller" ? (
        <div className="p-8 rounded-xl shadow-lg bg-green-100 text-center text-green-800 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome Seller, {user.name}!</h2>
          <p className="text-base mb-6">
            🎉 Manage your products, view your dashboard, and grow your business.
          </p>
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Seller Dashboard
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-xl shadow-lg bg-blue-100 text-center text-blue-800 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Hello {user.name}!</h2>
          <p className="text-base mb-6">
            👤 Browse products, add to cart, and enjoy shopping!
          </p>
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Products
          </button>
        </div>
      )}
    </div>
  );
}
