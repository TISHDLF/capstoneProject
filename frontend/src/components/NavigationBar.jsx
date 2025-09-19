import React from "react";
import logo from "../assets/whiskerwatchlogo.png";
import { Link, useLocation } from "react-router-dom";

const pageStyling =
  "flex items-center justify-center box-content h-full w-auto px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] hover:text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer";

const pageCurrent =
  "flex items-center justify-center box-content h-full w-auto px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer bg-[#DC8801]";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <div className=" sticky top-0 left-0 grid grid-cols-[40%_40%_20%] bg-[#f9f7dc] box-content items-center max-h-[100px] border-b-2 border-b-[#DC8801] z-10">
      <Link
        to="/home"
        className="flex items-center justify-center w-auto h-[100px]"
      >
        <img
          className="max-w-full max-h-full object-contain p-[10px]"
          src={logo}
          alt="whiskerwatch logo"
        />
      </Link>

      <div className="flex flex-row justify-evenly items-center">
        <Link
          to="/home"
          className={location.pathname === "/home" ? pageCurrent : pageStyling}
        >
          Home
        </Link>
        <Link
          to="/aboutus"
          className={
            location.pathname === "/aboutus" ? pageCurrent : pageStyling
          }
        >
          About Us
        </Link>
        <Link
          to="/catcareguides"
          className={
            location.pathname === "/catcareguides" ? pageCurrent : pageStyling
          }
        >
          Cat Care Guides
        </Link>
        <Link
          to="/contactus"
          className={
            location.pathname === "/contactus" ? pageCurrent : pageStyling
          }
        >
          Contact Us
        </Link>
      </div>

      <div className="flex items-center justify-center w-auto h-[100px] box-border">
        <button
          className="flex items-center justify-center w-[40px] p-[8px] h-auto bg-[#FFFFFF] rounded-[10px] drop-shadow-lg
        active:scale-100 active:border-2 border-[#DC8801] border-solid"
        >
          <img
            className="max-w-full max-h-full object-contain"
            src="/src/assets/icons/notification-bell.png"
            alt="notification bell"
          />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
