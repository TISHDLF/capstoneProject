import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopLogout from "../modal/PopLogout.jsx";
import { useWhiskerMeter } from "../context/WhiskerMeterContext.jsx";
import { useSession } from "../context/SessionContext.jsx";
import LoginFirstModal from "../modal/LoginFirstModal.jsx";

const SideNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading: sessionLoading } = useSession();
  const { resetWhiskerMeter } = useWhiskerMeter();

  const [profileImage, setProfileImage] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "head_volunteer";
  const dashboardPath =
    user?.role === "admin"
      ? "/dashboard"
      : user?.role === "head_volunteer"
      ? "/headvolunteer-dashboard"
      : null;

  // Fetch profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) return;

      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });

        setProfileImage(res.data.profile_image);
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const handleLogout = () => {
    logout();
    resetWhiskerMeter();
    navigate("/home"); // ✅ instead of window.location.href
  };

  const toggleProfileMenu = () => {
    setIsVisible((prev) => !prev);
  };

  const handleProtectedNav = (path) => {
    if (!isLoggedIn) {
      setModalOpen(true);
    } else {
      navigate(path); // ✅ single-page navigation
    }
  };

  const sideItemStyle =
    "relative flex items-center justify-start gap-4 min-w-[200px]  h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 border-white shadow-md active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const sideItemStyleCurrent =
    "relative flex items-center justify-start gap-4 min-w-[200px]  h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#DC8801] text-[#DC8801]";

  // Mobile styles
  const mobileItemStyle =
    "flex items-center justify-start gap-3 w-full px-4 py-3 bg-white rounded-xl border-2 border-white shadow-sm active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const mobileItemStyleCurrent =
    "flex items-center justify-start gap-3 w-full px-4 py-3 bg-white rounded-xl border-2 border-[#DC8801] text-[#DC8801] shadow-md";

  return (
    <>
      {/* Desktop SideNavigation - Hidden on mobile */}
      <div
        ref={menuRef}
        className="hidden md:flex flex-col gap-4 min-w-[200px] h-auto pt-10 absolute right-0 top-20 z-10"
      >
        {/* Profile Section */}
        <div
          onClick={toggleProfileMenu}
          className={
            location.pathname === "/profile"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
              <img
                src={
                  profileImage
                    ? `http://localhost:5000/FileUploads/${profileImage}`
                    : "/src/assets/icons/account.png"
                }
                alt="account"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="cursor-pointer">
              {sessionLoading
                ? "Loading..."
                : user
                ? `${user.firstname} ${user.lastname}`
                : "Guest"}
            </label>
            <button className="grid place-items-center w-[35px] h-auto p-2 rounded-[25px] hover:bg-[#f9e390] active:bg-[#FFF]">
              <img src="/src/assets/icons/down-arrow-orange.png" alt="down" />
            </button>
          </div>
        </div>

        {/* Profile Dropdown Menu */}
        <div
          className="absolute right-30 top-24 w-40 box-border bg-[#FFF] shadow-md rounded-[15px] rounded-tr-[0px] overflow-hidden z-[9999]"
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
                className="text-[#000] text-center p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
                onClick={() => setIsVisible(false)}
              >
                My Profile
              </Link>

              {isAdmin && dashboardPath && (
                <Link
                  to={dashboardPath}
                  className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
                  onClick={() => setIsVisible(false)}
                >
                  Dashboard
                </Link>
              )}

              <button
                className="text-[#000] text-center p-3 pl-6 bg-[#fef8e2] pr-6 w-full hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
                onClick={() => {
                  setShowLogoutModal(true);
                  setIsVisible(false);
                }}
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
                onClick={() => setIsVisible(false)}
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-center gap-4 pl-12">
          <div
            onClick={() => handleProtectedNav("/donate")}
            className={
              location.pathname === "/donate"
                ? sideItemStyleCurrent
                : sideItemStyle
            }
          >
            <div className="flex justify-center items-center w-[40px] h-auto">
              <img src="/src/assets/icons/donation.png" alt="donation" />
            </div>
            <label className="cursor-pointer">Donate</label>
          </div>

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
            <label className="cursor-pointer">Cat Adoption</label>
          </Link>

          <div
            onClick={() => handleProtectedNav("/feeding")}
            className={
              location.pathname === "/feeding"
                ? sideItemStyleCurrent
                : sideItemStyle
            }
          >
            <div className="flex justify-center items-center w-[40px] h-auto">
              <img src="/src/assets/icons/pet-food.png" alt="feeding" />
            </div>
            <label className="cursor-pointer">Feeding</label>
          </div>

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
            <label className="cursor-pointer">Community Guidelines</label>
          </Link>
        </div>
      </div>

      {/* Mobile SideNavigation - Shown only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f9f7dc] border-t-2 border-[#DC8801] z-30 pb-safe">
        {/* Bottom Navigation Bar */}
        <div className="flex justify-around items-center py-3 px-2">
          <div
            onClick={() => handleProtectedNav("/donate")}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-8 h-8">
              <img
                src="/src/assets/icons/donation.png"
                alt="donation"
                className={
                  location.pathname === "/donate" ? "opacity-100" : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-xs ${
                location.pathname === "/donate"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Donate
            </span>
          </div>

          <Link
            to="/catadoption"
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-8 h-8">
              <img
                src="/src/assets/icons/paws.png"
                alt="adoption"
                className={
                  location.pathname === "/catadoption"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-xs ${
                location.pathname === "/catadoption"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Adopt
            </span>
          </Link>

          <div
            onClick={() => handleProtectedNav("/feeding")}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-8 h-8">
              <img
                src="/src/assets/icons/pet-food.png"
                alt="feeding"
                className={
                  location.pathname === "/feeding"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-xs ${
                location.pathname === "/feeding"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Feed
            </span>
          </div>

          <Link
            to="/communityguide"
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-8 h-8">
              <img
                src="/src/assets/icons/information.png"
                alt="info"
                className={
                  location.pathname === "/communityguide"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-xs ${
                location.pathname === "/communityguide"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Guide
            </span>
          </Link>

          <div
            onClick={toggleProfileMenu}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#DC8801]">
              <img
                src={
                  profileImage
                    ? `http://localhost:5000/FileUploads/${profileImage}`
                    : "/src/assets/icons/account.png"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-xs ${
                location.pathname === "/profile"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Profile
            </span>
          </div>
        </div>

        {/* Mobile Profile Menu Modal */}
        {isVisible && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setIsVisible(false)}
          >
            <div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={
                      profileImage
                        ? `http://localhost:5000/FileUploads/${profileImage}`
                        : "/src/assets/icons/account.png"
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {sessionLoading
                      ? "Loading..."
                      : user
                      ? `${user.firstname} ${user.lastname}`
                      : "Guest"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "Not logged in"}
                  </p>
                </div>
              </div>

              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="text-center py-3 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl font-medium"
                    onClick={() => setIsVisible(false)}
                  >
                    My Profile
                  </Link>

                  {isAdmin && dashboardPath && (
                    <Link
                      to={dashboardPath}
                      className="text-center py-3 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl font-medium"
                      onClick={() => setIsVisible(false)}
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    className="text-center py-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 rounded-xl font-medium"
                    onClick={() => {
                      setShowLogoutModal(true);
                      setIsVisible(false);
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => navigate("/login"), 100);
                  }}
                  className="block text-center py-3 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl font-medium w-full"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <PopLogout
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
      {modalOpen && (
        <LoginFirstModal
          onCancel={() => setModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default SideNavigation;
