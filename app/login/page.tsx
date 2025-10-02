"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Login failed");
        return;
      }

      const data = await response.json();
      login(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  const handleDemoLogin = () => {
    setEmail("admin@herbalauth.com");
    setPassword("Admin@123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Logo + Title */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Leaf className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">HerbalAuth</h1>
        </div>
        <p className="text-center text-sm text-gray-500 mb-6">
          AI-Powered Authenticity
        </p>

        {/* Welcome Text */}
        <h2 className="text-xl font-semibold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in to access your herbal authenticity dashboard
        </p>

        {/* Error Display */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@herbalauth.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password + Demo Login */}
          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-gray-600 border px-3 py-1 rounded-lg hover:bg-gray-100"
            >
              Demo Login
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold shadow-md"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 font-medium hover:underline">
            Sign up
          </a>
        </p>

        {/* Demo Credentials Box */}
        <div className="bg-gray-100 p-4 rounded-lg mt-6 text-sm text-gray-700">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Admin: admin@herbalauth.com / Admin@123</p>
          <p>Analyst: analyst@herbalauth.com / Analyst@123</p>
          <p>Viewer: viewer@herbalauth.com / Viewer@123</p>
        </div>
      </div>
    </div>
  );
}
