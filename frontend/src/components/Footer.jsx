import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="absolute z-0 bottom-0 flex flex-row justify-between items-center bg-[#DC8801] w-full h-12 pl-50 pr-50">
      <label className="text-[#FFF]">WhiskerWatch est. 2025</label>
      <Link
        to="https://www.facebook.com/sprcats"
        target="_blank"
        className="flex items-center justify-center w-[50px] p-[8px] h-auto  drop-shadow-lg"
      >
        <img
          src="src/assets/icons/facebook.png"
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </Link>
    </div>
  );
};

export default Footer;
