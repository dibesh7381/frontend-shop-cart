
import React from "react";
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
import AddressPage from "./components/AddressPage.jsx";
import withAuth from "./components/WithAuth.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {

  const ProtectedProfile = withAuth(Profile, { requireSeller: false });
  const ProtectedSeller = withAuth(ProductDashboard, { requireSeller: true });
  const ProtectedProducts = withAuth(ProductListing, { requireSeller: false });
  const ProtectedCart = withAuth(CartPage, { requireSeller: false });

  return (
    <AuthProvider>
            <ErrorBoundary>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/seller" element={<ProtectedSeller />} />

          {/* Products & Cart */}
          <Route path="/products" element={<ProtectedProducts />} />
          <Route path="/cart" element={<ProtectedCart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/address" element={<AddressPage />} />
        </Routes>
      </ErrorBoundary>
          </AuthProvider>
  );
};

export default App;
