
import { useState, useEffect } from "react";
import ProductForm from "../../components/ProductForm";
import ProductCard from "../../components/ProductCard";
import withAuth from "./WithAuth";

// eslint-disable-next-line react-refresh/only-export-components
function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://backend-shop-cart.onrender.com/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center flex-col p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          Seller Dashboard
        </h2>

        <div className="mb-8">
          <ProductForm onRefresh={loadProducts} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full mt-10">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRefresh={loadProducts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ only sellers can access
// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(Dashboard, { requireSeller: true });
