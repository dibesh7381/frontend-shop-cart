import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import ProductDashboard from "./components/ProductDashboard.jsx"
import Home from "./components/Home.jsx";
import ProductListing from "./components/ProductListing.jsx";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/seller" element={<ProductDashboard />} />
        <Route path="/products" element={<ProductListing />} />
      </Routes>
    </div>
  );
};

export default App;
