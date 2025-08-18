import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import ProductDashboard from "./components/ProductDashboard.jsx";
import Home from "./components/Home.jsx";
import ProductListing from "./components/ProductListing.jsx";
import SellerRoute from "./components/SellerRoute.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/profile"
          element={<Profile user={user} setUser={setUser} />}
        />
        <Route
          path="/seller"
          element={
            <SellerRoute user={user}>
              <ProductDashboard />
            </SellerRoute>
          }
        />
        <Route path="/products" element={<ProductListing user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
