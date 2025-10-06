import React, { useState } from "react";
import logo from "../assets/whiskerwatchlogo.png";
import { Link, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import Burger from "./Burger";

const pageStyling =
  "flex items-center justify-center box-content h-full w-auto px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] hover:text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer";

const pageCurrent =
  "flex items-center justify-center box-content h-full w-auto px-[10px] py-[6px] rounded-[10px] hover:bg-[#DC8801] text-[#FFF] hover:cursor-pointer active:bg-[#FFF] active:text-[#DC8801] active:cursor-pointer bg-[#DC8801]";

const mobilePageStyling =
  "flex items-center justify-center w-full px-4 py-3 text-lg hover:bg-[#DC8801] hover:text-[#FFF] transition-colors";

const mobilePageCurrent =
  "flex items-center justify-center w-full px-4 py-3 text-lg bg-[#DC8801] text-[#FFF]";

const NavigationBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile (below 768px) */}
      <div className="hidden md:sticky md:top-0 md:left-0 md:grid md:grid-cols-[40%_40%_20%] bg-[#f9f7dc] box-content items-center max-h-[100px] border-b-2 border-b-[#DC8801] z-30">
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
            className={
              location.pathname === "/home" ? pageCurrent : pageStyling
            }
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
          <NotificationBell />
        </div>
      </div>

      {/* Mobile Navigation - Shown only on mobile (below 768px) */}
      <div className="md:hidden sticky top-0 left-0 bg-[#f9f7dc] border-b-2 border-b-[#DC8801] z-30">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 h-[70px]">
          <Link to="/home" className="flex items-center h-full">
            <img
              className="h-[50px] object-contain"
              src={logo}
              alt="whiskerwatch logo"
            />
          </Link>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-[#DC8801] transition-transform ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#DC8801] transition-opacity ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#DC8801] transition-transform ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col bg-[#f9f7dc] border-t border-[#DC8801]">
            <Link
              to="/home"
              className={
                location.pathname === "/home"
                  ? mobilePageCurrent
                  : mobilePageStyling
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/aboutus"
              className={
                location.pathname === "/aboutus"
                  ? mobilePageCurrent
                  : mobilePageStyling
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/catcareguides"
              className={
                location.pathname === "/catcareguides"
                  ? mobilePageCurrent
                  : mobilePageStyling
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Cat Care Guides
            </Link>
            <Link
              to="/contactus"
              className={
                location.pathname === "/contactus"
                  ? mobilePageCurrent
                  : mobilePageStyling
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
