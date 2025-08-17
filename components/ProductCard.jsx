
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function ProductCard({ product, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    details: product.details,
    quantity: product.quantity,
    category: product.category,
    price: product.price || 0,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") setForm({ ...form, file: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("details", form.details);
    fd.append("quantity", form.quantity);
    fd.append("category", form.category);
    fd.append("price", form.price);
    if (form.file) fd.append("file", form.file);

    try {
      const res = await fetch(`https://backend-shop-cart.onrender.com/products/${product._id}`, {
        method: "PUT",
        body: fd,
      });
      const data = await res.json();
      console.log("Update response:", res.status, data);

      if (res.ok) {
        setEditing(false);
        onRefresh();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!product._id) return console.error("Product ID missing");

    try {
      const res = await fetch(`https://backend-shop-cart.onrender.com/products/${product._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Delete response:", res.status, data);

      if (res.ok) {
        onRefresh();
        setModalOpen(false);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white shadow rounded overflow-hidden flex flex-col w-full md:w-auto">
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={`https://backend-shop-cart.onrender.com${product.imageUrl}`}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {editing ? (
          <form className="space-y-2 w-full" onSubmit={handleUpdate}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Product Name"
              required
            />
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Product Details"
              required
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Category"
              required
            />
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              min={1}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Quantity"
              required
            />
            <input
              type="number"
              name="price"
              value={form.price}
              min={0}
              step="0.01"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Price in ₹"
              required
            />
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex-1">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded flex-1">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-1">{product.details}</p>
            <p className="text-gray-600 text-sm mb-1">Category: {product.category}</p>
            <p className="text-gray-800 font-medium mb-1">Quantity: {product.quantity}</p>
            <p className="text-gray-800 font-medium mb-2">Price: ₹{Number(product.price).toLocaleString("en-IN")}</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex-1"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {modalOpen && (
          <ConfirmModal
            open={modalOpen}
            message="Are you sure you want to delete this product?"
            onConfirm={handleDelete}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
