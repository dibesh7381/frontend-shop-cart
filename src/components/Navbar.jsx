import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef();

  const token = localStorage.getItem("token");

  // Fetch profile name
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUserName(data.user.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileOpen(false);
    setSidebarOpen(false);
    navigate("/"); // redirect to home page
  };

  const getInitial = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  // Click outside profile dropdown to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="p-4 bg-blue-900 text-white flex justify-between items-center shadow-md relative">
        <Link to="/"><span className="font-bold text-xl">ShopCart</span></Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/seller" className="hover:underline">Seller</Link>
          <Link to="/products" className="hover:underline">Products</Link> {/* New Route */}
        </div>

        {/* Right side: Profile avatar + Hamburger */}
        <div className="flex items-center space-x-3">
          {token && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg focus:outline-none"
              >
                {getInitial(userName)}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-blue-800 rounded shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none ml-2"
          >
            <span className="block h-0.5 w-full bg-white"></span>
            <span className="block h-0.5 w-full bg-white"></span>
            <span className="block h-0.5 w-full bg-white"></span>
          </button>
        </div>
      </nav>

      {/* Slide-in Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-800 text-white transform transition-transform duration-300 z-50 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-blue-700">
          <span className="font-bold text-lg">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2">
          {/* Always show Home, Seller & Products */}
          <Link
            to="/"
            className="px-4 py-3 hover:bg-blue-700"
            onClick={() => setSidebarOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/seller"
            className="px-4 py-3 hover:bg-blue-700"
            onClick={() => setSidebarOpen(false)}
          >
            Seller
          </Link>
          <Link
            to="/products"
            className="px-4 py-3 hover:bg-blue-700"
            onClick={() => setSidebarOpen(false)}
          >
            Products
          </Link>

          {/* Conditional Sign Up & Login */}
          {!token && (
            <>
              <Link
                to="/signup"
                className="px-4 py-3 hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-3 hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
