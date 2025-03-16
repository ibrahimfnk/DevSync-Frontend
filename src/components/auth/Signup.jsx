"use client"
import { Label } from "./comp/label"
import { Input } from "./comp/input"
import { cn } from "../../../lib/utils"
import axios from "axios"
import { useState } from "react"
import { useAuth } from "../../authContext"
import ShinyText from './comp/ShinyText';

export default function Signup() {
  const[username, setUsername] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault()
    try{

      setLoading(true);
      const res=await axios.post("http://localhost:3000/Signup", {
        email: email,
        password: password,
        username: username,
      });
      const token = res.data.token;
      const userId = res.data.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId); 
      setCurrentUser(userId);
      setLoading(false);
      window.location.href = "/";
    } catch(err){
      console.error(err);
      alert("Signup Failed!");
      setLoading(false);
    }

  }
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:w-[400px] shadow md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome to DevSync</h2>
      {/* <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to DevSync if you can because we don&apos;t have a login flow
        yet
      </p>*/}
      <form className="my-8 " >
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="tylerdurden" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}  />
          </LabelInputContainer>
          {/* <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>*/}
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </LabelInputContainer>

        <button
      className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
      type="submit" onClick={handleSignup}
      disabled={loading}>
    {loading ? "Signing up..." : "Sign up "}   &rarr;
      <BottomGradient />
    </button>


        <div className="flex flex-col space-y-4 mt-6">
          <p className="text-neutral-600 text-sm text-center dark:text-neutral-300">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

