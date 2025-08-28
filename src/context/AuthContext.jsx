// // AuthContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { fetchCart } from "../redux/cartSlice";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();

//   const fetchUser = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setUser(null);
//       setLoading(false);
//       dispatch(fetchCart()); // 🟢 guest cart load
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.user) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user)); // 🟢 save logged-in user
//       }
//     } catch (err) {
//       console.error(err);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setUser(null);
//     } finally {
//       setLoading(false);
//       dispatch(fetchCart()); // 🟢 reload cart after user set
//     }
//   };

//   useEffect(() => { fetchUser(); }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     dispatch(fetchCart()); // 🟢 load guest cart
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, fetchUser, handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   return useContext(AuthContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCartAPI } from "../redux/cartSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      fetchCartAPI(dispatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // 🟢 save logged-in user
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
      fetchCartAPI(dispatch); // 🟢 reload cart after user set
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    fetchCartAPI(dispatch); // 🟢 load guest cart
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
