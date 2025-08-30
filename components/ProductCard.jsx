import { useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmModal from "./ConfirmModal";

export default function ProductCard({ product, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product.name,
      details: product.details,
      quantity: product.quantity,
      category: product.category,
      price: product.price || 0,
    },
  });

  const onSubmit = async (values) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("details", values.details);
    fd.append("quantity", values.quantity);
    fd.append("category", values.category);
    fd.append("price", values.price);

    if (values.file?.[0]) fd.append("file", values.file[0]);

    try {
      const res = await fetch(
        `https://backend-shop-cart.onrender.com/products/${product._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );
      const data = await res.json();
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
      const res = await fetch(
        `https://backend-shop-cart.onrender.com/products/${product._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
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

  const categories = [
    "Soap","Dress","Electronics","Food","Books","Shoes","Cosmetics","Toys",
    "Mobiles","Laptops","Watches","Bags","Home Decor","Furniture","Kitchen Appliances",
    "Sports","Stationery","Jewelry","Hair Care","Skincare","Gaming","Grocery","Pet Supplies",
    "Music","Automotive","Baby Products","Health & Wellness",
  ];

  return (
    <div className="bg-white shadow rounded overflow-hidden flex flex-col w-full md:w-auto
                    transform transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {editing ? (
          <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* Form inputs remain same */}
            <div className="flex flex-col">
              <input
                {...register("name", { required: "Product name is required" })}
                className="w-full p-2 border rounded"
                placeholder="Product Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <textarea
                {...register("details", { required: "Product details are required" })}
                className="w-full p-2 border rounded"
                placeholder="Product Details"
              />
              {errors.details && (
                <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-2 border rounded"
                defaultValue=""
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                min={1}
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                })}
                className="w-full p-2 border rounded"
                placeholder="Quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                min={0}
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className="w-full p-2 border rounded"
                placeholder="Price in ₹"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                {...register("file", {
                  validate: (fileList) => {
                    if (!fileList?.[0]) return true;
                    const file = fileList[0];
                    if (!["image/jpeg","image/png","image/jpg"].includes(file.type))
                      return "Only JPG or PNG images allowed";
                    if (file.size > 2*1024*1024) return "Image size must be <= 2MB";
                    return true;
                  },
                })}
                className="w-full p-2 border rounded"
              />
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                type="submit"
                className="bg-green-500 cursor-pointer text-white py-2 px-4 rounded flex-1"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white  cursor-pointer py-2 px-4 rounded flex-1"
              >
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
                className="bg-yellow-500 text-white py-2 px-4 rounded flex-1 cursor-pointer hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-red-500 text-white py-2 px-4 rounded flex-1 cursor-pointer hover:bg-red-600"
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
