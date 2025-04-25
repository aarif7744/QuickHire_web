  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@radix-ui/react-popover";
  import React from "react";
  import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
  import { Button } from "../ui/button";
  import { LogOut, User2 } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { toast } from "sonner";
  import axios from "axios"; // Ensure axios is imported
  import { USER_API_END_POINT } from "@/utils/constant";
  import { setUser } from "@/redux/authSlice"; // Adjust import path as per your setup

  function Navbar() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/logout`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(null));
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    return (
      <div className="w-full border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 md:px-20 max-w-7xl mx-auto h-12">
          {/* Logo */}
          <div>
            <h1 className="text-xl font-bold">
              Quick <span className="text-red-600">Hire</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <ul className="hidden md:flex items-center gap-6 font-medium">
              {user && user.role == "recruiter" ? (
                <>
                  <li>
                    <Link to="/admin/companies">Companies</Link>
                  </li>
                  <li>
                    <Link to="/admin/jobs">Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/jobs">Jobs</Link>
                  </li>
                  <li>
                    <Link to="/browse">Browse</Link>
                  </li>
                </>
              )}
            </ul>

            {/* User Authentication Buttons */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="bg-lime-300 hover:bg-lime-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    className="bg-violet-300 hover:bg-violet-500"
                  >
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="w-8 h-9 cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="User Avatar"
                      className="rounded-full"
                    />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-60 my-4 mx-3">
                  <div className="shadow">
                    <div className="flex gap-2 space-y-2">
                      <Avatar className="w-9 h-10 cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="User Avatar"
                          className="w-10 my-2 rounded-full"
                        />
                      </Avatar>
                      <div>
                        <h2 className="text-sm font-semibold">
                          {user?.fullname || "User"}
                        </h2>
                        <p className="text-sm text-zinc-800">
                          {user?.email || "Welcome!"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col text-gray-600">
                      {user && user.role === "student" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <User2 />
                          <Button variant="link" className="text-black">
                            <Link to="/profile">View profile</Link>
                          </Button>
                        </div> 
                      )}

                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button
                          onClick={logoutHandler}
                          variant="link"
                          className="text-black"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default Navbar;
