import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  if (!token) return <Navigate to="/login" replace />;


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://backend-shop-cart.onrender.com/products/listing", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Extract unique categories
        const cats = ["All", ...new Set(data.map((p) => p.category))];
        setCategories(cats);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (filteredProducts.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No products available in this category
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Products
      </h2>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition duration-200 ${
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
            {/* Image */}
            <div className="w-full p-4 flex justify-center items-center bg-gray-50">
              <img
                src={`https://backend-shop-cart.onrender.com${product.imageUrl}`}
                alt={product.name}
                className="w-full h-64 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2 self-start px-4">
              {product.name}
            </h3>

            {/* Price */}
            <p className="text-lg font-semibold text-gray-800 mb-4 self-start px-4">
              ₹{product.price}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full px-4 mb-4">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl transition-colors">
                Add to Cart
              </button>
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
