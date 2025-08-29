
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import withAuth from "./WithAuth";
import { addItemAPI, fetchCartAPI } from "../redux/cartSlice";

const API = "https://backend-shop-cart.onrender.com";

// eslint-disable-next-line react-refresh/only-export-components
function ProductListing() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const token = localStorage.getItem("token");

  // ---------------- Fetch Products ----------------
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products/listing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const cats = ["All", ...new Set(data.map((p) => p.category))];
      setCategories(cats);
      setProducts(data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // ---------------- Show Message Helper ----------------
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  // ---------------- Add to Cart Handler ----------------
  const handleAddToCart = async (product) => {
    if (product.quantity <= 0) return showMessage("Out of Stock!", "error");

    // Backend update
    await addItemAPI(dispatch, product);

    // Fetch latest cart and sync UI
    await fetchCartAPI(dispatch);

    // Optional: refresh products list to show updated stock
    await fetchProducts();

    showMessage("✅ Added to cart!", "success");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Welcome, {user.name} ({user.role})
      </h2>

      {/* ✅ Message Box */}
      {message && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium transition ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition cursor-pointer duration-200 ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 flex flex-col items-center overflow-hidden"
          >
            <div className="w-full p-4 flex justify-center items-center bg-gray-50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-1 self-start px-4">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 self-start px-4 mb-2">
              From Seller: {product.sellerId?.name || "Unknown"}
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-1 self-start px-4">
              ₹{product.price}
            </p>
            <p
              className={`text-sm font-medium mb-4 self-start px-4 ${
                product.quantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `In Stock: ${product.quantity}`
                : "Out of Stock"}
            </p>

            <div className="flex gap-3 w-full px-4 mb-4">
              <button
                disabled={user.role === "seller" || product.quantity <= 0}
                onClick={() => handleAddToCart(product)}
                className={`flex-1 font-semibold py-3 rounded-xl cursor-pointer transition-colors text-white ${
                  user.role === "seller" || product.quantity <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Add to Cart
              </button>

              <button
                disabled={user.role === "seller" || product.quantity <= 0}
                className={`flex-1 font-semibold py-3 rounded-xl cursor-pointer transition-colors text-white ${
                  user.role === "seller" || product.quantity <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(ProductListing);
