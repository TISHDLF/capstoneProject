import React from "react";
import { useNavigate } from "react-router-dom";

import pic from "../assets/icons/warningicon.png";

const LoginFirstModal = ({ onCancel }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-70">
      <div className="bg-white w-100 flex flex-col justify-center h-45 p-10 rounded-2xl shadow-lg relative">
        <img
          src={pic}
          alt="warning"
          className="bg-white rounded-full absolute top-[-30px] left-[160px] w-16 h-16 p-2 border-4 border-[#f9f7dc]"
        />
        <p className="text-center mb-4">You need to login first to continue.</p>
        <br />
        <div className="flex justify-around gap-4">
          <button
            onClick={onCancel}
            className="text-[#000] p-3 px-6 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-white rounded-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="text-[#000] p-3 px-6 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-white rounded-[10px]"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginFirstModal;
