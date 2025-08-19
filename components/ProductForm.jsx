import { useState, useRef } from "react";
import ConfirmModal from "./ConfirmModal";

export default function ProductForm({ onRefresh }) {
  const [form, setForm] = useState({
    name: "",
    details: "",
    quantity: 1,
    category: "",
    price: "",
    file: null,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token"); // ✅ token lena zaroori hai

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") setForm({ ...form, file: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.file) {
      setConfirmMessage("Please select an image");
      setShowConfirm(true);
      return;
    }
    setConfirmMessage("Are you sure you want to add this product?");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("details", form.details);
    fd.append("quantity", form.quantity);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("file", form.file);

    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token header me bhejna
        },
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", details: "", quantity: 1, category: "", price: "", file: null });
        if (fileInputRef.current) fileInputRef.current.value = null;
        onRefresh();
      } else {
        setConfirmMessage(data.message || "Something went wrong");
        setShowConfirm(true);
      }
    } catch (err) {
      console.error(err);
      setConfirmMessage("Upload failed!");
      setShowConfirm(true);
    }
  };

  const handleCancel = () => setShowConfirm(false);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="Product Details"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          min={1}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          min={0}
          step="0.01"
          onChange={handleChange}
          placeholder="Price in ₹"
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          name="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Add Product
        </button>
      </form>

      <ConfirmModal
        open={showConfirm}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
