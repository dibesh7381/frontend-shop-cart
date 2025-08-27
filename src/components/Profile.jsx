import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import withAuth from "./WithAuth";

// eslint-disable-next-line react-refresh/only-export-components
const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isSeller = user.role === "seller";

  const [profileImage, setProfileImage] = useState(user.profilePic || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState(user.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      let updatedUser = { ...user };

      // ---------------- Update Name ----------------
      const resName = await fetch("https://backend-shop-cart.onrender.com/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const dataName = await resName.json();
      if (!resName.ok) throw new Error(dataName.message || "Error updating name");
      updatedUser.name = dataName.user?.name || updatedUser.name;

      // ---------------- Update Profile Picture ----------------
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const resPic = await fetch("https://backend-shop-cart.onrender.com/profile/pic", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ do not set Content-Type manually
          },
          body: formData,
        });
        const dataPic = await resPic.json();
        if (!resPic.ok) throw new Error(dataPic.message || "Error updating profile picture");
        updatedUser.profilePic = dataPic.user?.profilePic || updatedUser.profilePic;
      }

      // ---------------- Update Context & LocalStorage ----------------
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileImage(updatedUser.profilePic);
      setSelectedFile(null);

      setMessage("✅ Profile updated!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const defaultAvatar = "https://source.unsplash.com/100x100/?avatar";

  return (
    <div className="w-[90%] sm:w-4/5 max-w-lg mx-auto mt-10 p-6 sm:p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all hover:shadow-xl">

      {/* Gradient Header */}
      <div
        className={`rounded-xl px-4 py-3 mb-6 text-center font-semibold text-sm sm:text-base text-white shadow-md ${
          isSeller
            ? "bg-gradient-to-r from-green-500 to-green-700"
            : "bg-gradient-to-r from-blue-500 to-blue-700"
        }`}
      >
        {isSeller
          ? "🎉 Seller Mode: Manage your products"
          : "👤 Customer Mode: Enjoy shopping!"}
      </div>

      {/* Profile Heading */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        My Profile
      </h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8 relative">
        <img
          src={profileImage || defaultAvatar}
          alt="Profile"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
        />
        <label className="mt-3 cursor-pointer bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-md hover:bg-blue-700 text-xs sm:text-sm transition">
          Change
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* Form */}
      <div className="space-y-5 mb-6">
        <div>
          <label className="font-medium block mb-1 text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-medium block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
          />
        </div>

        <div>
          <label className="font-medium block mb-1 text-gray-700">Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving && (
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Success message */}
      {message && (
        <p className="mt-5 text-center text-green-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(Profile);






