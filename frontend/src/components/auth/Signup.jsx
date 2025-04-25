import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const navigate = useNavigate();
  const { loading ,user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration.");
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
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <form onSubmit={submitHandler} className="space-y-4">
          <h1 className="font-bold text-xl text-gray-800 text-center">Signup</h1>

          <div>
            <Label className="block text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              name="fullname"
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">Email</Label>
            <Input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="xyz@gmail.com"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">Phone Number</Label>
            <Input
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="1234567890"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">Password</Label>
            <Input
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                value="student"
                name="role"
                checked={input.role === "student"}
                onChange={changeEventHandler}
              />
              <Label className="text-sm text-gray-700">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                value="recruiter"
                name="role"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
              />
              <Label className="text-sm text-gray-700">Recruiter</Label>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">Profile Picture</Label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-600 cursor-pointer h-[40px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Please wait
              </>
            ) : (
              "Signup"
            )}
          </button>


          <p className="text-sm text-center text-gray-600">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
