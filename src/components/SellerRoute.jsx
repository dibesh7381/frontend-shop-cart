// SellerRoute.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SellerRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    } catch (err) {
      console.error("Invalid token " + err);
    }
  }

  if (!token || !user || user.role !== "seller") {
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

  return children; // render only if seller
}
