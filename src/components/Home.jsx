import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user, setUser }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null); // logout state
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://backend-shop-cart.onrender.com/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [setUser]);

  const handleClick = () => {
    if (!user) return;
    if (user.role === "seller") navigate("/seller");
    else navigate("/products");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className={`p-8 rounded-2xl shadow-xl max-w-md w-full text-center transition-transform transform hover:scale-105`}
        style={{
          backgroundColor: user
            ? user.role === "seller"
              ? "#D1FAE5"
              : "#DBEAFE"
            : "#F3E8FF",
          color: user
            ? user.role === "seller"
              ? "#065F46"
              : "#1E40AF"
            : "#6B21A8",
        }}
      >
        {!user ? (
          <>
            <h2 className="text-3xl font-bold mb-4">Welcome to ShopCart!</h2>
            <p className="text-base mb-6">
              🚀 Explore amazing products or start selling with your own dashboard.
            </p>
          </>
        ) : user.role === "seller" ? (
          <>
            <h2 className="text-3xl font-bold mb-4">Welcome Seller, {user.name}</h2>
            <p className="text-base mb-6">
              🎉 Manage your products, view your dashboard, and grow your business.
            </p>
            <button
              onClick={handleClick}
              className="px-6 py-3 bg-green-600 cursor-pointer text-white rounded-xl hover:bg-green-700 transition"
            >
              Go to Seller Dashboard
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">Hello {user.name}</h2>
            <p className="text-base mb-6">
              👤 Browse products, add to cart, and enjoy shopping!
            </p>
            <button
              onClick={handleClick}
              className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-xl hover:bg-blue-700 transition"
            >
              Go to Products
            </button>
          </>
        )}
      </div>
    </div>
  );
}
