import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { LogOut, Menu, User2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-20 max-w-7xl mx-auto h-14">
        {/* Logo */}
        <div>
          <h1 className="text-xl font-bold">
            Quick <span className="text-red-600">Hire</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          {user && user.role === "recruiter" ? (
            <>
              <Link to="/admin/companies">Companies</Link>
              <Link to="/admin/jobs">Jobs</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/browse">Browse</Link>
            </>
          )}
        </nav>

        {/* Right-side: Auth or Profile */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden md:flex gap-3">
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
                <div className="shadow space-y-2">
                  <div className="flex gap-2">
                    <Avatar className="w-9 h-10 cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="User Avatar"
                        className="rounded-full"
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

                  {user.role === "student" && (
                    <div className="flex items-center gap-2 cursor-pointer">
                      <User2 />
                      <Link to="/profile">
                        <Button variant="link" className="text-black">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center gap-2 cursor-pointer">
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
              </PopoverContent>
            </Popover>
          )}

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-3 font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies" onClick={() => setMenuOpen(false)}>Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                <li>
                  <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
                </li>
              </>
            )}
            {!user && (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                </li>
                <li>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
