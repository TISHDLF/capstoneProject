import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { useSession } from "../../context/SessionContext";

/// TODO: Separate account for Admin/User
// Admin user have separate access for login user/ admin user

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
      console.log("Login response:", response.data);

      setUser(user); // from context
      // Cookies.set("user", JSON.stringify(user), { expires: 30 });
      // sessionStorage.setItem("user", JSON.stringify(user));

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

    console.log("email:", email);
    console.log("password:", password);
  };

  return (
    <div className="grid grid-cols-[60%_40%] place-items-center h-screen overflow-hidden">
      <div className="block items-center box-border w-auto h-100% overflow-hidden">
        <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
      </div>
      <div className="flex flex-col items-center gap-10 w-100% max-h-100% bg-[#FFF] p-20 rounded-[25px] shadow-md">
        <div className="w-[250px] max-w-auto">
          <img src="src/assets/whiskerwatchlogo-vertical.png" alt="logo" />
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-10"
        >
          <input
            type="email"
            id="userEmail"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="password"
            id="userPassword"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <div className="flex flex-col items-center gap-3">
            {error && (
              <div className="mb-4 p-3 text-[#DC8801] bg-[#FDF5D8] rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-row gap-1 justify-stretch">
              <button
                type="submit"
                className="bg-[#B5C04A] text-[#FFF] p-[10px] w-30 rounded-[50px] active:bg-[#CFDA34] cursor-pointer"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="bg-amber-600 text-[#FFF] p-[10px] w-30 text-center rounded-[50px] active:bg-[#977655]"
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
