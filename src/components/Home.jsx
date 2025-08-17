import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
      <p className="text-gray-700 mb-6 text-center">
        This is your Home Page. You can add your dashboard, products, or any other content here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mb-6">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="font-bold text-lg mb-2">Dashboard</h2>
          <p className="text-gray-600">View your dashboard and stats.</p>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="font-bold text-lg mb-2">Products</h2>
          <p className="text-gray-600">Manage your products and inventory.</p>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="font-bold text-lg mb-2">Profile</h2>
          <p className="text-gray-600">View or edit your profile information.</p>
        </div>
      </div>

      {/* View Products Button */}
      <button
        onClick={() => navigate("/products")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors"
      >
        View Products
      </button>
    </div>
  );
}
