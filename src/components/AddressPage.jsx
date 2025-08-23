import React, { useState } from "react";

function AddressPage() {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch("/api/profile/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    if (res.ok) alert("Address saved!");
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Address</h2>
      {Object.keys(address).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={address[key]}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
      ))}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Save Address
      </button>
    </div>
  );
}

export default AddressPage;
