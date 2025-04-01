"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Label } from "./comp/label";
import { Input } from "./comp/input";
import { cn } from "../../../lib/utils";
import axios from "axios";
import { useAuth } from "../../authContext";
import AnimatedLogo from "../home/comp/AnimatedLogo";
import { DarkModeToggle } from "../home/comp/DarkMode";
import { IconBrandGoogle } from "@tabler/icons-react";


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!username.trim()) tempErrors.username = "Username is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tempErrors.email = "Invalid email format";
    if (password.length < 8) tempErrors.password = "Password must be at least 8 characters long";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await axios.post("http://44.211.197.251:3000/signup", {
        email: email,
        password: password,
        username: username,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
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
              <button onClick={() => navigate("/home")} className="ml-2 text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">DevSync</button>
            </div>
            <div className="flex items-center">
              <DarkModeToggle />
              <a href="/auth" className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">Sign In</a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Join DevSync</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <LabelInputContainer>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </LabelInputContainer>

            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {loading ? "Signing up..." : "Create Account"}
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
