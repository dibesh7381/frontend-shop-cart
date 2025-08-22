import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const onSubmit = async (data) => {
    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError("apiError", { message: result.message || "Login failed" });
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Show backend success message
      setSuccessMessage(result.message || "Login successful");

      // Redirect after short delay
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("apiError", { message: err.message });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {/* API Error */}
        {errors.apiError && (
          <p className="text-red-600 text-center font-medium">{errors.apiError.message}</p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-600 text-center font-medium">{successMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
