
import React from "react";
import withAuth from "./WithAuth";

// eslint-disable-next-line react-refresh/only-export-components
function Profile({ user }) {
  const isSeller = user.role === "seller";

  return (
    <div className="p-4 sm:p-6 w-[90%] max-w-md mx-auto mt-10 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center sm:text-left">
        Profile
      </h2>
      <div
        className={`p-4 rounded-lg mb-4 ${
          isSeller
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        } text-center`}
      >
        {isSeller
          ? "🎉 You are a seller! Manage your products and dashboard here."
          : "👤 You are a customer. Browse products and enjoy shopping!"}
      </div>
      <div className="space-y-2 text-gray-700 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(Profile); // 👈 normal user bhi access kar sakta hai
