import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function withAuth(WrappedComponent, { requireSeller = false } = {}) {
  return function AuthComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
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
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center gap-2 min-h-screen bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-2xl text-center border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Please Login</h2>
            <p className="text-sm text-gray-500 mb-4">
              Please login to access this page
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    if (requireSeller && user?.role !== "seller") {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white shadow-xl rounded-xl p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-4 text-red-500">🚫</div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You are not a seller. Only sellers can access this page.
            </p>
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      );
    }

    // Expose setUser to children so Navbar/Profile can update user
    return <WrappedComponent {...props} user={user} setUser={setUser} />;
  };
}


