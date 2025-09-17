import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PopLogout from "../modal/PopLogout.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { useWhiskerMeter } from "../context/WhiskerMeterContext.jsx";

const HeadVolunteerSideBar = () => {
  const location = useLocation();
  const { logout } = useSession();
  const { resetWhiskerMeter } = useWhiskerMeter();

  const [user, setUser] = useState({ firstname: "", lastname: "", role: "" });
  const [loading, setLoading] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isOpen, setIsOpen] = useState(true); // 👈 controls sidebar links

  useEffect(() => {
    const loggedUser = sessionStorage.getItem("user");
    if (!loggedUser) {
      setUser({ firstname: "", lastname: "", role: "" });
      setLoading(false);
      return;
    }
    const parsedUser = JSON.parse(loggedUser);
    setUser(parsedUser);
    setLoading(false);
  }, []);

  const toggleProfileMenu = () => setIsVisible(!isVisible);
  const toggleSidebar = () => setIsOpen(!isOpen); // 👈 toggle button

  const isLoggedIn = user.firstname && user.lastname;
  const isAdminOrHeadVolunteer =
    user.role === "admin" || user.role === "head_volunteer";
  const dashboardPath =
    user.role === "admin" ? "/dashboard" : "/testhvhomepage";

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    logout(); // ✅ sets actualUser to null
    resetWhiskerMeter(); // optional, will reset points immediately
    window.location.href = "/home";
  };

  const sideItemStyle =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 border-white shadow-md active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const sideItemStyleCurrent =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#DC8801] text-[#DC8801]";

  return (
    <div className="flex flex-col gap-4 min-w-[200px] h-auto pt-10 fixed -right-5 top-20">
      {/* Profile Section */}
      <div
        className={
          location.pathname === "/headvolunteerprofile"
            ? sideItemStyleCurrent
            : sideItemStyle
        }
      >
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/account.png" alt="account" />
          </div>
          <label className="cursor-pointer">
            {loading
              ? "Loading..."
              : user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : "Guest"}
          </label>
          <button
            className="grid place-items-center w-[35px] h-auto p-2 rounded-[25px] hover:bg-[#f9e390] active:bg-[#FFF]"
            onClick={toggleProfileMenu}
          >
            <img src="/src/assets/icons/down-arrow-orange.png" alt="" />
          </button>
        </div>
      </div>

      {/* Profile Dropdown */}
      {isVisible && (
        <div className="absolute right-[80px] top-[90px] w-40 bg-[#FFF] shadow-md rounded-[15px] rounded-tr-[0px] z-[9999]">
          {isLoggedIn ? (
            <div className="grid place-items-center gap-1 p-2">
              <Link
                to="/headvolunteerprofile"
                className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              >
                My Profile
              </Link>
              {isAdminOrHeadVolunteer && (
                <Link
                  to={dashboardPath}
                  className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setIsVisible(false);
                }}
                className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 p-2">
              <Link
                to="/login"
                className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Sidebar Toggle */}
      <div className="flex flex-col justify-center gap-4 pl-8">
        <button
          onClick={toggleSidebar}
          className="bg-white shadow-2xl text-black px-4 py-2 rounded-lg hover:bg-[#b96a01]"
        >
          {isOpen ? "Close" : "Open"}
        </button>

        {/* Sidebar Links (toggle with isOpen) */}
        {isOpen && (
          <>
            <Link
              to="/headvolunteerpage"
              className={
                location.pathname === "/headvolunteerpage"
                  ? sideItemStyleCurrent
                  : sideItemStyle
              }
            >
              <div className="flex justify-center items-center w-[40px] h-auto">
                <img src="/src/assets/icons/donationHV.png" alt="donation" />
              </div>
              <label className="cursor-pointer"> Donation Applications </label>
            </Link>

            <Link
              to="/adoptionapplication"
              className={
                location.pathname === "/adoptionapplication"
                  ? sideItemStyleCurrent
                  : sideItemStyle
              }
            >
              <div className="flex justify-center items-center w-[40px] h-auto">
                <img src="/src/assets/icons/adoptionHV.png" alt="adoption" />
              </div>
              <label className="cursor-pointer"> Adoption Applications </label>
            </Link>

            <Link
              to="/FeederApplications"
              className={
                location.pathname === "/FeederApplications"
                  ? sideItemStyleCurrent
                  : sideItemStyle
              }
            >
              <div className="flex justify-center items-center w-[40px] h-auto">
                <img src="/src/assets/icons/feederHV.png" alt="feeder" />
              </div>
              <label className="cursor-pointer"> Feeder Applications </label>
            </Link>

            <Link
              to="/ReportandAnalytics"
              className={
                location.pathname === "/ReportandAnalytics"
                  ? sideItemStyleCurrent
                  : sideItemStyle
              }
            >
              <div className="flex justify-center items-center w-[40px] h-auto">
                <img src="/src/assets/icons/analyticsHV.png" alt="analytics" />
              </div>
              <label className="cursor-pointer"> Report and Analytics </label>
            </Link>
          </>
        )}
        {/* Public Links */}
        <Link
          to="/Donate"
          className={
            location.pathname === "/Donate"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/donation.png" alt="donation" />
          </div>
          <label className="cursor-pointer"> Donation</label>
        </Link>
        <Link
          to="/catadoption"
          className={
            location.pathname === "/catadoption"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/paws.png" alt="cat adoption" />
          </div>
          <label className="cursor-pointer"> Cat Adoption </label>
        </Link>
        <Link
          to="/feeding"
          className={
            location.pathname === "/feeding"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/pet-food.png" alt="feeding" />
          </div>
          <label className="cursor-pointer"> Feeding </label>
        </Link>
        <Link
          to="/communityguide"
          className={
            location.pathname === "/communityguide"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/information.png" alt="info" />
          </div>
          <label className="cursor-pointer"> Community Guidelines </label>
        </Link>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <PopLogout
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default HeadVolunteerSideBar;
