import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://backend-shop-cart.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching profile");

        setUser(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!user)
    return (
      <p className="p-4 text-center text-red-500">
        No user data available. Please login.
      </p>
    );

  return (
    <div className="p-4 sm:p-6 w-[90%] max-w-md mx-auto mt-10 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center sm:text-left">
        Profile
      </h2>
      <p className="mb-4 text-green-600 font-medium text-center sm:text-left">
        {user.message}
      </p>
      <div className="space-y-2 text-gray-700 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Name:</span> {user.user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.user.email}
        </p>
      </div>
    </div>
  );
}
