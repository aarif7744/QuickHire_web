import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input"; // Replace with your actual Input component
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const { loading ,user} = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred.");
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[])

  return (
    <>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
      >
        <form onSubmit={submitHandler} className="space-y-4">
          <h1 className="font-bold text-xl text-gray-800 text-center">Login</h1>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="xyz@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <RadioGroup defaultValue="student" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  value="student"
                  name="role"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 accent-blue-500"
                />
                <Label htmlFor="student" className="text-sm text-gray-700">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  value="recruiter"
                  name="role"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 accent-blue-500"
                />
                <Label htmlFor="recruiter" className="text-sm text-gray-700">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full py-2 flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
              <Loader2 className="mr-2 h-5 animate-spin" /> Please wait
            </Button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              Login
            </motion.button>
          )}

          <p className="text-sm text-center text-gray-600">
            Don't have an account?
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">
              Signup
            </Link>
          </p>
        </form>
      </motion.div>
    </>
  );
}
export default Login;
