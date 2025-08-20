


import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import ProductDashboard from "./components/ProductDashboard.jsx";
import Home from "./components/Home.jsx";
import ProductListing from "./components/ProductListing.jsx";
import CartPage from "./components/CartPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import withAuth from "./components/WithAuth.jsx";

const App = () => {
  const [user, setUser] = useState(null);

  // Wrap components once
  const ProtectedProfile = withAuth(Profile, { requireSeller: false });
  const ProtectedSeller = withAuth(ProductDashboard, { requireSeller: true });
  const ProtectedProducts = withAuth(ProductListing, { requireSeller: false });
  const ProtectedCart = withAuth(CartPage, { requireSeller: false });

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedProfile />} />
        <Route path="/seller" element={<ProtectedSeller />} />

        {/* Products & Cart */}
        <Route path="/products" element={<ProtectedProducts user={user} />} />
        <Route path="/cart" element={<ProtectedCart user={user} />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </div>
  );
};

export default App;
