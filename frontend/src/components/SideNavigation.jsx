import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PopLogout from "../modal/PopLogout.jsx";
import { useWhiskerMeter } from "../context/WhiskerMeterContext.jsx";
import { useSession } from "../context/SessionContext.jsx";

const SideNavigation = () => {
  const location = useLocation();
  const { logout } = useSession();
  const { resetWhiskerMeter } = useWhiskerMeter();
  const [user, setUser] = useState({ firstname: "", lastname: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = sessionStorage.getItem("user"); // ✅ from sessionStorage
      if (!loggedUser) {
        console.log("No logged in user yet!");
        setUser({ firstname: "", lastname: "", role: "" }); // reset user
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(loggedUser);
      setUser(parsedUser); // we already have firstname/lastname from login
      setLoading(false);
    };

    fetchUser();
  }, []);

  const [isVisible, setIsvisible] = useState(false);
  const toggleProfileMenu = () => {
    setIsvisible(!isVisible);
  };

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
    <div className="fixed right-0 top-[20%] flex flex-col gap-4 min-w-[200px] h-auto">
      {/* Login or Signup button */}
      <div
        className={
          location.pathname === "/profile"
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
        {/* Dropdown for */}
      </div>

      <div
        className="absolute  right-18 top-12 w-40 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-tr-[0px] overflow-hidden z-10"
        style={{ minHeight: "fit-content" }}
      >
        {isLoggedIn ? (
          <div
            className={
              isVisible ? "grid place-items-center gap-1 p-2" : "hidden"
            }
          >
            <Link
              to="/profile"
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
          <div
            className={
              isVisible ? "grid place-items-center gap-1 p-2" : "hidden"
            }
          >
            <Link
              to="/login"
              className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 pl-12]">
        {/* Donate */}
        <Link
          to="/donate"
          className={
            location.pathname === "/donate"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/donation.png" alt="donation" />
          </div>
          <label className="cursor-pointer"> Donate </label>
        </Link>

        {/* Cat Adoption */}
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

        {/* Feeding */}
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

        {/* Community Guidelines */}
        <Link
          to="/communityguide"
          className={
            location.pathname === "/communityguide"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex justify-center items-center w-[40px] h-auto">
            <img src="/src/assets/icons/information.png" alt="information" />
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

export default SideNavigation;
