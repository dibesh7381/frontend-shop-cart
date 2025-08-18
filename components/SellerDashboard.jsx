import { useState } from "react";

export default function SellerDashboard() {
  const [message, setMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token"); // login ke time save kiya hoga
      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await fetch("https://backend-shop-cart.onrender.com/seller-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setMessage(data.message || "No message");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching seller dashboard");
    }
  };

  return (
    <div>
      <button onClick={fetchDashboard}>Access Seller Dashboard</button>
      <p>{message}</p>
    </div>
  );
}
