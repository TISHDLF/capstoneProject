import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import LoadingModal from "../../modal/LoadingModal";
const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setPasswordMatchError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HandleSignUp = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/user/send-otp", {
        email,
        username,
        contactnumber,
      });

      navigate("/verify", {
        state: {
          firstname,
          lastname,
          contactnumber,
          birthday,
          email,
          username,
          address,
          password,
        },
      });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // backend duplicate check failed
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[50%_50%] place-items-center h-screen overflow-hidden">
      <div className="block items-center box-border w-auto h-100% overflow-hidden">
        <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
      </div>

      <div className="flex flex-col gap-8 items-center bg-[#FFF] p-12 rounded-[25px] shadow-md">
        <div className="max-w-[200px]">
          <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
        </div>
        <form onSubmit={HandleSignUp} className="grid grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="text"
            placeholder="last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="tel"
            placeholder="Contact Number"
            maxLength={11}
            value={contactnumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) setContactNumber(value);
            }}
            required
            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield] border-b-2 border-b-[#A8784F] p-2"
          />
          <div className="flex gap-2 items-center">
            <label className="text-[#737373]"> Date of Birth </label>
            <input
              type="date"
              placeholder="Date of Birth"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
              className="border-b-2 border-b-[#A8784F] p-2"
            />
          </div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border-b-2 border-b-[#A8784F] p-2 col-span-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={
              password === confirmPassword
                ? "border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]"
                : "border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#000000]"
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={
              password === confirmPassword
                ? "border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#B5C04A]"
                : "border-b-2 border-b-[#A8784F] p-2 grid-col placeholder-[#A3A3A3] text-[#d23f07]"
            }
          />

          <div className="flex flex-col items-center gap-3 col-span-2">
            <label className="text-red-600">{error}</label>
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-[#B5C04A] w-[125px] text-[#FFF] rounded-[50px] active:bg-[#CFDA34] cursor-pointer"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <label>
              Already a member of WhiskerWatch?
              <Link
                to="/login"
                className="font-normal md:font-bold hover:underline text-[#B5C04A]"
              >
                Log in
              </Link>{" "}
              instead!
            </label>
          </div>
        </form>
      </div>
      <LoadingModal isOpen={loading} />
    </div>
  );
};

export default SignUp;
