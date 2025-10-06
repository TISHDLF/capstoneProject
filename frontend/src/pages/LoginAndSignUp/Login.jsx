import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { useSession } from "../../context/SessionContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    let user = null;
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        { email, password },
        { withCredentials: true }
      );

      user = response.data.user;
      setUser(user);

      if (user.role === "regular") {
        navigate("/home");
      } else if (user.role === "head_volunteer") {
        navigate("/headvolunteerpage");
      } else if (user.role === "admin") {
        navigate("/home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Login Failed: Incorrect Email or Password";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
    }
  };

  return (
    <div className="md:grid md:grid-cols-[60%_40%] flex flex-col min-h-screen">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:block items-center box-border w-full h-full overflow-hidden">
        <img
          src="src/assets/stray-cat.jpg"
          alt="stray-cat"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-center gap-8 md:gap-10 w-full bg-[#FFF] p-8 md:p-20 min-h-screen">
        <div className="w-40 md:w-[250px]">
          <img src="src/assets/whiskerwatchlogo-vertical.png" alt="logo" />
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-sm"
        >
          <input
            type="email"
            id="userEmail"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2 w-full text-sm md:text-base"
          />
          <input
            type="password"
            id="userPassword"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            className="border-b-2 border-b-[#A8784F] p-2 w-full text-sm md:text-base"
          />
          <div className="flex flex-col items-center gap-3 w-full">
            {error && (
              <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg text-xs md:text-sm text-center w-full">
                {error}
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-2 md:gap-1 justify-stretch w-full md:w-auto">
              <button
                type="submit"
                className="bg-[#B5C04A] text-[#FFF] p-3 md:p-[10px] w-full md:w-30 rounded-[50px] active:bg-[#CFDA34] cursor-pointer text-sm md:text-base"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="bg-amber-600 text-[#FFF] p-3 md:p-[10px] w-full md:w-30 text-center rounded-[50px] active:bg-[#977655] text-sm md:text-base"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
