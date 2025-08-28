import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartAPI } from "../redux/cartSlice";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const desktopRef = useRef();
  const mobileRef = useRef();

  const [avatar, setAvatar] = useState(user?.profilePic || "");
  useEffect(() => setAvatar(user?.profilePic || ""), [user]);

  // ✅ Redux se uniqueCount le lo
// Redux se unique products count lo
const badgeCount = useSelector((state) => state.cart.uniqueCount);


  // ✅ Navbar load hone par cart fetch karo
useEffect(() => {
  if (user?.role === "customer") {
    fetchCartAPI(dispatch); // ✅ manual helper, dispatch pass kar ke call
  }
}, [user, dispatch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setDesktopProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDesktopProfileOpen(false);
    setMobileProfileOpen(false);
    setSidebarOpen(false);
    navigate("/");
  };

  const getInitial = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  const renderAvatar = () =>
    avatar ? (
      <img
        src={avatar}
        alt="avatar"
        className="w-10 h-10 mt-1.5 rounded-full object-cover border-2 border-white shadow-md"
      />
    ) : (
      <span className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {user ? getInitial(user.name) : "?"}
      </span>
    );

  const navLink =
    "relative cursor-pointer after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <>
      <nav className="p-4 bg-blue-900 text-white flex justify-between items-center shadow-md relative">
        <Link to="/">
          <span className="font-extrabold text-xl cursor-pointer">ShopCart</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className={navLink}>Home</Link>
          <Link to="/seller" className={navLink}>Seller</Link>
          <Link to="/products" className={navLink}>Products</Link>

          {user?.role === "customer" && (
            <Link to="/cart" className="relative text-3xl cursor-pointer">
              🛒
              {badgeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/signup" className={navLink}>Sign Up</Link>
              <Link to="/login" className={navLink}>Login</Link>
            </>
          ) : (
            <div ref={desktopRef} className="relative">
              <button className="cursor-pointer" onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}>
                {renderAvatar()}
              </button>
              {desktopProfileOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-blue-800 rounded shadow-lg py-1 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-white hover:bg-blue-700" onClick={() => setDesktopProfileOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left cursor-pointer px-4 py-2 text-white hover:bg-blue-700">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          {user?.role === "customer" && (
            <Link to="/cart" className="relative text-3xl cursor-pointer">
              🛒
              {badgeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div ref={mobileRef} className="relative">
              <button onClick={() => setMobileProfileOpen(!mobileProfileOpen)}>
                {renderAvatar()}
              </button>
              {mobileProfileOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-blue-800 rounded shadow-lg py-1 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-white hover:bg-blue-700" onClick={() => setMobileProfileOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-white hover:bg-blue-700">Logout</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setSidebarOpen(true)} className="flex flex-col justify-between w-6 h-5 focus:outline-none cursor-pointer">
            <span className="block h-0.5 w-full bg-white"></span>
            <span className="block h-0.5 w-full bg-white"></span>
            <span className="block h-0.5 w-full bg-white"></span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-blue-800 text-white transform transition-transform duration-300 z-50 shadow-lg ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b border-blue-700">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl font-bold">&times;</button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2">
          <Link to="/" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/seller" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Seller</Link>
          <Link to="/products" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Products</Link>

          {!user ? (
            <>
              <Link to="/signup" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Sign Up</Link>
              <Link to="/login" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className={`${navLink} px-4 py-3`} onClick={() => setSidebarOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-left px-4 py-3 hover:bg-blue-700 cursor-pointer">Logout</button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

