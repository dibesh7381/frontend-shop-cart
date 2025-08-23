// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import withAuth from "./WithAuth";

// // eslint-disable-next-line react-refresh/only-export-components
// function Profile({ user, setUser }) {
//   const navigate = useNavigate();
//   const isSeller = user.role === "seller";
//   const isCustomer = user.role === "customer";

//   const [name, setName] = useState(user.name);
//   const [profileImage, setProfileImage] = useState(user.profileImage || "");
//   const [isSaving, setIsSaving] = useState(false);

//   // Load user data from localStorage on mount
//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user")) || {};
//     if (savedUser.name) setName(savedUser.name);
//     if (savedUser.profileImage) setProfileImage(savedUser.profileImage);
//   }, []);

//   // Handle profile image change
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result;
//       setProfileImage(base64String);

//       const savedUser = JSON.parse(localStorage.getItem("user")) || {};
//       savedUser.profileImage = base64String;
//       localStorage.setItem("user", JSON.stringify(savedUser));

//       setUser({ ...user, profileImage: base64String, name });
//     };
//     reader.readAsDataURL(file);
//   };

//   // Save name and profile image
//   const handleSave = () => {
//     setIsSaving(true);
//     setTimeout(() => {
//       const updatedUser = { ...user, name, profileImage };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);
//       setIsSaving(false);

//       // Toast message
//       const toast = document.createElement("div");
//       toast.innerText = "Profile updated successfully!";
//       toast.className =
//         "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fadein z-50";
//       document.body.appendChild(toast);

//       setTimeout(() => {
//         toast.classList.add("opacity-0", "transition", "duration-500");
//         setTimeout(() => toast.remove(), 500);
//       }, 2000);
//     }, 1000);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   const handleAddAddress = () => navigate("/address");

//   return (
//     <div className="p-6 sm:p-10 w-[90%] max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-200">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Profile</h2>

//       {/* Role Info */}
//       <div
//         className={`p-4 rounded-lg mb-6 text-center font-semibold ${
//           isSeller ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
//         }`}
//       >
//         {isSeller
//           ? "🎉 You are a seller! Manage your products and dashboard here."
//           : "👤 You are a customer. Browse products and enjoy shopping!"}
//       </div>

//       {/* Profile Image */}
//       <div className="flex flex-col items-center mb-6">
//         <div className="relative">
//           <img
//             src={profileImage || "https://source.unsplash.com/100x100/?avatar"}
//             alt="Profile"
//             className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
//           />
//           <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1 rounded-full cursor-pointer shadow-lg">
//             Change
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </label>
//         </div>
//       </div>

//       {/* Editable Name */}
//       <div className="space-y-4">
//         <div>
//           <label className="font-semibold block mb-1">Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-1">Email:</label>
//           <input
//             type="email"
//             value={user.email}
//             disabled
//             className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-1">Role:</label>
//           <input
//             type="text"
//             value={user.role}
//             disabled
//             className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
//           />
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
//         {isCustomer && (
//           <button
//             onClick={handleAddAddress}
//             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
//           >
//             Add Address
//           </button>
//         )}

//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-60 cursor-pointer"
//         >
//           {isSaving ? "Saving..." : "Save Profile"}
//         </button>

//         <button
//           onClick={handleLogout}
//           className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition cursor-pointer"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export default withAuth(Profile);

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import withAuth from "./WithAuth";

// // eslint-disable-next-line react-refresh/only-export-components
// const Profile = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const isSeller = user.role === "seller";

//   const [profileImage, setProfileImage] = useState(user.profilePic || "");
//   const [name, setName] = useState(user.name || "");
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (user?.profilePic) setProfileImage(user.profilePic);
//   }, [user]);

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     setIsUploading(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("https://backend-shop-cart.onrender.com/profile/pic", {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.message || "Error uploading image");
//         setIsUploading(false);
//         return;
//       }

//       const updatedUser = data.user;
//       setProfileImage(updatedUser.profilePic);
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       setMessage("✅ Profile updated!");
//       setTimeout(() => setMessage(""), 2500);
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while uploading.");
//     }
//     setIsUploading(false);
//   };

//   const handleSave = async () => {
//     if (!name.trim()) return;
//     setIsSaving(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ name }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.message || "Error updating profile");
//         setIsSaving(false);
//         return;
//       }

//       const updatedUser = data.user;
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setMessage("✅ Profile updated!");
//       setTimeout(() => setMessage(""), 2500);
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while saving.");
//     }
//     setIsSaving(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <div className="w-full max-w-md mx-auto mt-8 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
//       {/* Role Info Card */}
//       <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${
//         isSeller ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
//       }`}>
//         {isSeller
//           ? "🎉 You are a seller! Manage your products and dashboard."
//           : "👤 You are a customer. Browse products and enjoy shopping!"}
//       </div>

//       <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Profile</h2>

//       {/* Avatar */}
//       <div className="flex flex-col items-center mb-4 relative">
//         <img
//           src={profileImage || "https://source.unsplash.com/100x100/?avatar"}
//           alt="Profile"
//           className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
//         />

//         {isUploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
//             <div className="w-12 h-12 border-4 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
//           </div>
//         )}

//         <label className="mt-2 sm:mt-3 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600">
//           Change
//           <input
//             type="file"
//             className="hidden"
//             accept="image/*"
//             onChange={handleImageChange}
//             disabled={isUploading}
//           />
//         </label>
//       </div>

//       {/* Form */}
//       <div className="space-y-4 mb-4">
//         <div>
//           <label className="font-semibold block mb-1">Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-1">Email:</label>
//           <input
//             type="email"
//             value={user?.email}
//             disabled
//             className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
//           />
//         </div>

//         <div>
//           <label className="font-semibold block mb-1">Role:</label>
//           <input
//             type="text"
//             value={user?.role}
//             disabled
//             className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
//           />
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4">
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-60 cursor-pointer"
//         >
//           {isSaving ? "Saving..." : "Save Changes"}
//         </button>

//         <button
//           onClick={handleLogout}
//           className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Success message */}
//       {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
//     </div>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export default withAuth(Profile);


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "./WithAuth";

// eslint-disable-next-line react-refresh/only-export-components
const Profile = ({ user, setUser }) => {
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
    setSelectedFile(file); // store temporarily, UI update nahi
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      let updatedUser = { ...user };

      // 1️⃣ Update name
      const resName = await fetch("https://backend-shop-cart.onrender.com/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name }),
      });
      if (!resName.ok) throw new Error("Error updating name");
      const dataName = await resName.json();
      updatedUser = dataName.user;

      // 2️⃣ Update profile pic if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const resPic = await fetch("https://backend-shop-cart.onrender.com/profile/pic", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!resPic.ok) throw new Error("Error updating profile picture");
        const dataPic = await resPic.json();
        updatedUser = dataPic.user;
      }

      // ✅ Only now update UI
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileImage(updatedUser.profilePic);
      setSelectedFile(null);

      setMessage("✅ Profile updated!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong while saving.");
    }

    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      {/* Role info */}
      <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${
        isSeller ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
      }`}>
        {isSeller
          ? "🎉 You are a seller! Manage your products and dashboard."
          : "👤 You are a customer. Browse products and enjoy shopping!"}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Profile</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-4 relative">
        <img
          src={profileImage || "https://source.unsplash.com/100x100/?avatar"}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
        />
        <label className="mt-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600">
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
      <div className="space-y-4 mb-4">
        <div>
          <label className="font-semibold block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Email:</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Role:</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving && <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Success message */}
      {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(Profile);







