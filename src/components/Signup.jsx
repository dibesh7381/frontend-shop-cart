import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("https://backend-shop-cart.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Something went wrong");
        return;
      }

      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5 max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
          className="mb-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mb-3">{errors.name.message}</p>}

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
          className="mb-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          className="mb-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>}

        {/* ✅ Simple red text for backend error */}
        {serverError && (
          <p className="text-red-600 font-semibold text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? "Processing..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
