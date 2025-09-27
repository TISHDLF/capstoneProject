import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get user data from SignUp page
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
      // ✅ Verify OTP
      await axios.post(
        "http://localhost:5000/user/verify-otp",
        { email: userData.email, otp },
        { withCredentials: true }
      );

      // ✅ If OTP is valid → sign up user immediately
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
    <div className="grid grid-cols-[50%_50%] place-items-center h-screen overflow-hidden">
      <div className="block items-center box-border w-auto h-100% overflow-hidden">
        <img src="src/assets/stray-cat.jpg" alt="stray-cat" />
      </div>

      <div className="flex flex-col gap-8 items-center bg-[#FFF] p-12 rounded-[25px] shadow-md">
        <div className="max-w-[200px]">
          <img src="src/assets/whiskerwatchlogo-vertical.png" alt="" />
        </div>

        <div className="flex flex-col gap-2 col-span-2 items-center">
          <p>
            Your Verification code was sent to: <b>{userData.email}</b>
          </p>
          <br />
          <input
            type="text"
            placeholder="Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border-b-2 border-b-[#A8784F] p-2 w-40"
          />

          {!isCodeSent ? (
            <button
              type="button"
              onClick={sendCode}
              className="bg-[#A8784F] text-white rounded-2xl p-2 hover:bg-[#8f623b]"
            >
              Send Code
            </button>
          ) : (
            <button
              type="button"
              onClick={verifyAndSignUp}
              disabled={loading}
              className="bg-[#B5C04A] text-white rounded-2xl p-2 hover:bg-[#838d2f]"
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 col-span-2">
          <label className="text-red-600">{error}</label>

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
      </div>
    </div>
  );
};

export default VerificationPage;
