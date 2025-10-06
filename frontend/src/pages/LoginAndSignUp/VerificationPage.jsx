import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = location.state || {};
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const sendCode = async () => {
    if (!userData.email) {
      setError("No email found. Please go back and enter your email.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/user/send-otp",
        { email: userData.email },
        { withCredentials: true }
      );
      alert("OTP sent to your email!");
      setIsCodeSent(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP");
    }
  };

  const verifyAndSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/user/verify-otp",
        { email: userData.email, otp },
        { withCredentials: true }
      );

      const res = await axios.post("http://localhost:5000/user/signup", {
        ...userData,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error verifying or signing up:", err);
      setError("Invalid OTP or signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:grid md:grid-cols-2 flex flex-col min-h-screen">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:block items-center box-border w-full h-full overflow-hidden">
        <img
          src="src/assets/stray-cat.jpg"
          alt="stray-cat"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-6 md:gap-8 items-center justify-center bg-[#FFF] p-8 md:p-12 min-h-screen">
        <div className="w-32 md:w-48">
          <img src="src/assets/whiskerwatchlogo-vertical.png" alt="logo" />
        </div>

        <div className="flex flex-col gap-4 items-center w-full max-w-md">
          <p className="text-center text-sm md:text-base">
            Your Verification code was sent to: <b>{userData.email}</b>
          </p>
          <br />
          <input
            type="text"
            placeholder="Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border-b-2 border-b-[#A8784F] p-2 w-40 text-center text-sm md:text-base"
          />

          <button
            type="button"
            onClick={verifyAndSignUp}
            disabled={loading}
            className="bg-[#B5C04A] text-white rounded-2xl p-3 px-6 hover:bg-[#838d2f] text-sm md:text-base"
          >
            {loading ? "Verifying..." : "Verify & Sign Up"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <label className="text-red-600 text-xs md:text-sm text-center">
            {error}
          </label>

          <label className="text-xs md:text-sm text-center">
            Already a member of WhiskerWatch?{" "}
            <Link
              to="/login"
              className="font-normal md:font-bold hover:underline text-[#B5C04A]"
            >
              Log in
            </Link>{" "}
            instead!
          </label>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
