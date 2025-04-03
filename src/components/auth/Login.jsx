"use client"
import { useState } from "react";
import { Label } from "./comp/label";
import { Input } from "./comp/input";
import { cn } from "../../../lib/utils";
import axios from "axios";
import { useAuth } from "../../authContext";
import AnimatedLogo from "../home/comp/AnimatedLogo";
import { DarkModeToggle } from "../home/comp/DarkMode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      setLoading(true);
      const res = await axios.post("https://dev-sync-backend.vercel.app/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AnimatedLogo />
              <button 
                onClick={() => navigate("/home")} 
                className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
              >
                DevSync
              </button>
            </div>
            <div className="flex items-center">
              <DarkModeToggle />
              <a href="/signup" className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your DevSync account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <LabelInputContainer>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children }) => {
  return <div className="flex flex-col space-y-2 w-full">{children}</div>;
};