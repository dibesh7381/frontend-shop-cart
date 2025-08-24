// import { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import ConfirmModal from "./ConfirmModal";

// export default function ProductForm({ onRefresh }) {
//   const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
//     defaultValues: { name: "", details: "", quantity: 1, category: "", price: "" }
//   });

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [confirmMessage, setConfirmMessage] = useState("");
//   const fileInputRef = useRef(null);
//   const token = localStorage.getItem("token");

//   const onSubmit = (data) => {
//     if (!data.file?.[0]) {
//       setConfirmMessage("Product image is required");
//       setShowConfirm(true);
//       return;
//     }

//     setConfirmMessage("Are you sure you want to add this product?");
//     setShowConfirm(true);
//   };

//   const handleConfirm = async () => {
//     setShowConfirm(false);

//     const fd = new FormData();
//     const values = watch();
//     fd.append("name", values.name);
//     fd.append("details", values.details);
//     fd.append("quantity", values.quantity);
//     fd.append("category", values.category);
//     fd.append("price", values.price);
//     fd.append("file", values.file[0]);

//     try {
//       const res = await fetch("https://backend-shop-cart.onrender.com/products", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         reset();
//         if (fileInputRef.current) fileInputRef.current.value = null;
//         onRefresh();
//       } else {
//         setConfirmMessage(data.message || "Something went wrong");
//         setShowConfirm(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setConfirmMessage("Upload failed!");
//       setShowConfirm(true);
//     }
//   };

//   const handleCancel = () => setShowConfirm(false);

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col gap-4"
//       >
//         {/* Product Name */}
//         <div className="flex flex-col">
//           <input
//             type="text"
//             placeholder="Product Name"
//             className="border p-2 rounded"
//             {...register("name", { required: "Product name is required" })}
//           />
//           {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//         </div>

//         {/* Product Details */}
//         <div className="flex flex-col">
//           <textarea
//             placeholder="Product Details"
//             className="border p-2 rounded"
//             {...register("details", { required: "Product details are required" })}
//           />
//           {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>}
//         </div>

//         {/* Category */}
//         <div className="flex flex-col">
//           <input
//             type="text"
//             placeholder="Category"
//             className="border p-2 rounded"
//             {...register("category", { required: "Category is required" })}
//           />
//           {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
//         </div>

//         {/* Quantity */}
//         <div className="flex flex-col">
//           <input
//             type="number"
//             min={1}
//             className="border p-2 rounded"
//             {...register("quantity", {
//               required: "Quantity is required",
//               min: { value: 1, message: "Quantity must be at least 1" }
//             })}
//           />
//           {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
//         </div>

//         {/* Price */}
//         <div className="flex flex-col">
//           <input
//             type="number"
//             step="0.01"
//             min={0}
//             placeholder="Price in ₹"
//             className="border p-2 rounded"
//             {...register("price", {
//               required: "Price is required",
//               min: { value: 0, message: "Price cannot be negative" }
//             })}
//           />
//           {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
//         </div>

//         {/* File Upload */}
//         <div className="flex flex-col">
//           <input
//             type="file"
//             accept="image/jpeg,image/png,image/jpg"
//             className="border p-2 rounded"
//             ref={fileInputRef}
//             {...register("file", { required: "Product image is required" })}
//           />
//           {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           Add Product
//         </button>
//       </form>

//       <ConfirmModal
//         open={showConfirm}
//         message={confirmMessage}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//       />
//     </>
//   );
// }

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmModal from "./ConfirmModal";

export default function ProductForm({ onRefresh }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      details: "",
      quantity: 1,
      category: "",
      price: "",
    },
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const onSubmit = (data) => {
    if (!data.file?.[0]) {
      setConfirmMessage("Product image is required");
      setShowConfirm(true);
      return;
    }

    setConfirmMessage("Are you sure you want to add this product?");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    const fd = new FormData();
    const values = watch();
    fd.append("name", values.name);
    fd.append("details", values.details);
    fd.append("quantity", values.quantity);
    fd.append("category", values.category);
    fd.append("price", values.price);
    fd.append("file", values.file[0]);

    try {
      const res = await fetch(
        "https://backend-shop-cart.onrender.com/products",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const data = await res.json();
      if (res.ok) {
        reset();
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

  const categories = [
    "Soap",
    "Dress",
    "Electronics",
    "Food",
    "Books",
    "Shoes",
    "Cosmetics",
    "Toys",
    "Mobiles",
    "Laptops",
    "Watches",
    "Bags",
    "Home Decor",
    "Furniture",
    "Kitchen Appliances",
    "Sports",
    "Stationery",
    "Jewelry",
    "Hair Care",
    "Skincare",
    "Gaming",
    "Pet Supplies",
    "Music",
    "Automotive",
    "Baby Products",
    "Health & Wellness",
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded"
          {...register("name", { required: "Product name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}

        <textarea
          placeholder="Product Details"
          className="border p-2 rounded"
          {...register("details", { required: "Product details are required" })}
        />
        {errors.details && (
          <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>
        )}

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border rounded"
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        
        <input
          type="number"
          min={1}
          className="border p-2 rounded"
          {...register("quantity", {
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" },
          })}
        />
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}

        <input
          type="number"
          step="0.01"
          min={0}
          placeholder="Price in ₹"
          className="border p-2 rounded"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price cannot be negative" },
          })}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="border p-2 rounded"
          ref={fileInputRef}
          {...register("file", { required: "Product image is required" })}
        />
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded"
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
