import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PopLogout from "../modal/PopLogout.jsx";
import { useSession } from "../context/SessionContext.jsx";
import { useWhiskerMeter } from "../context/WhiskerMeterContext.jsx";

const HeadVolunteerSideBar = () => {
  const location = useLocation();
  const { user, logout } = useSession();
  const { resetWhiskerMeter } = useWhiskerMeter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState({ profile_image: "" });

  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profilImage = await axios.get(
          `http://localhost:5000/user/profile`,
          { withCredentials: true }
        );

        setProfileImage(profilImage.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err.response?.data?.error || "Failed to fetch image");
      }
    };

    fetchProfileImage();
  }, []);

  const toggleProfileMenu = () => setIsVisible(!isVisible);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const isLoggedIn = user.firstname && user.lastname;

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    logout();
    resetWhiskerMeter();
    window.location.href = "/home";
  };

  const sideItemStyle =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 border-white shadow-md active:bg-[#fdf4d5] hover:text-[#DC8801]";
  const sideItemStyleCurrent =
    "relative flex items-center justify-start gap-4 min-w-[200px] w-full h-auto rounded-tl-[50px] rounded-bl-[50px] box-border pl-3 pr-6 pt-2 pb-2 cursor-pointer bg-white border-2 drop-shadow-md border-[#DC8801] text-[#DC8801]";

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex flex-col gap-4 min-w-[200px] h-auto pt-10 absolute right-0 top-20 z-20">
        {/* Profile Section */}
        <div
          className={
            location.pathname === "/headvolunteerprofile"
              ? sideItemStyleCurrent
              : sideItemStyle
          }
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-center items-center w-[40px] h-[40px] rounded-[25px] overflow-hidden">
              <img
                src={
                  profileImage.profile_image
                    ? `http://localhost:5000/FileUploads/${profileImage.profile_image}`
                    : "/src/assets/icons/account.png"
                }
                alt="account"
                className="w-full h-full object-cover"
              />
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
                  to="/profile"
                  className="text-[#000] p-3 pl-6 pr-6 w-full bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-[#FFF] rounded-[10px]"
                >
                  My Profile
                </Link>
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

        {/* Sidebar Links */}
        <div className="flex flex-col justify-center gap-4 pl-8">
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
                <label className="cursor-pointer">
                  {" "}
                  Donation Applications{" "}
                </label>
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
                <label className="cursor-pointer">
                  {" "}
                  Adoption Applications{" "}
                </label>
              </Link>

              <Link
                to="/feederapplication"
                className={
                  location.pathname === "/feederapplication"
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
                  <img
                    src="/src/assets/icons/analyticsHV.png"
                    alt="analytics"
                  />
                </div>
                <label className="cursor-pointer"> Report and Analytics </label>
              </Link>
            </>
          )}
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
      </div>

      {/* Mobile Navigation - Shown only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f9f7dc] border-t-2 border-[#DC8801] z-30">
        {/* Bottom Tab Bar */}
        <div className="flex justify-around items-center py-2 px-2">
          <Link
            to="/headvolunteerpage"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-7 h-7">
              <img
                src="/src/assets/icons/donationHV.png"
                alt="donations"
                className={
                  location.pathname === "/headvolunteerpage"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-[10px] text-center ${
                location.pathname === "/headvolunteerpage"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Donations
            </span>
          </Link>

          <Link
            to="/adoptionapplication"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-7 h-7">
              <img
                src="/src/assets/icons/adoptionHV.png"
                alt="adoptions"
                className={
                  location.pathname === "/adoptionapplication"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-[10px] text-center ${
                location.pathname === "/adoptionapplication"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Adoptions
            </span>
          </Link>

          <Link
            to="/feederapplication"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-7 h-7">
              <img
                src="/src/assets/icons/feederHV.png"
                alt="feeders"
                className={
                  location.pathname === "/feederapplication"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-[10px] text-center ${
                location.pathname === "/feederapplication"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Feeders
            </span>
          </Link>

          <Link
            to="/ReportandAnalytics"
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-7 h-7">
              <img
                src="/src/assets/icons/analyticsHV.png"
                alt="analytics"
                className={
                  location.pathname === "/ReportandAnalytics"
                    ? "opacity-100"
                    : "opacity-60"
                }
              />
            </div>
            <span
              className={`text-[10px] text-center ${
                location.pathname === "/ReportandAnalytics"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Analytics
            </span>
          </Link>

          <div
            onClick={toggleProfileMenu}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#DC8801]">
              <img
                src={
                  profileImage.profile_image
                    ? `http://localhost:5000/FileUploads/${profileImage.profile_image}`
                    : "/src/assets/icons/account.png"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-[10px] text-center ${
                location.pathname === "/profile"
                  ? "text-[#DC8801] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Menu
            </span>
          </div>
        </div>

        {/* Mobile Profile/Menu Modal */}
        {isVisible && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setIsVisible(false)}
          >
            <div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-4 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={
                      profileImage.profile_image
                        ? `http://localhost:5000/FileUploads/${profileImage.profile_image}`
                        : "/src/assets/icons/account.png"
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {loading
                      ? "Loading..."
                      : user.firstname && user.lastname
                      ? `${user.firstname} ${user.lastname}`
                      : "Guest"}
                  </p>
                  <p className="text-sm text-gray-500">Head Volunteer</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-center py-3 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl font-medium"
                      onClick={() => setIsVisible(false)}
                    >
                      My Profile
                    </Link>

                    {/* Public Links Section */}
                    <div className="mt-4 mb-2">
                      <p className="text-xs text-gray-500 font-semibold px-2 mb-2">
                        QUICK ACCESS
                      </p>
                    </div>

                    <Link
                      to="/Donate"
                      className="flex items-center gap-3 py-3 px-4 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl"
                      onClick={() => setIsVisible(false)}
                    >
                      <img
                        src="/src/assets/icons/donation.png"
                        alt="donation"
                        className="w-6 h-6"
                      />
                      <span className="font-medium">Donation</span>
                    </Link>

                    <Link
                      to="/catadoption"
                      className="flex items-center gap-3 py-3 px-4 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl"
                      onClick={() => setIsVisible(false)}
                    >
                      <img
                        src="/src/assets/icons/paws.png"
                        alt="adoption"
                        className="w-6 h-6"
                      />
                      <span className="font-medium">Cat Adoption</span>
                    </Link>

                    <Link
                      to="/feeding"
                      className="flex items-center gap-3 py-3 px-4 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl"
                      onClick={() => setIsVisible(false)}
                    >
                      <img
                        src="/src/assets/icons/pet-food.png"
                        alt="feeding"
                        className="w-6 h-6"
                      />
                      <span className="font-medium">Feeding</span>
                    </Link>

                    <Link
                      to="/communityguide"
                      className="flex items-center gap-3 py-3 px-4 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl"
                      onClick={() => setIsVisible(false)}
                    >
                      <img
                        src="/src/assets/icons/information.png"
                        alt="info"
                        className="w-6 h-6"
                      />
                      <span className="font-medium">Community Guidelines</span>
                    </Link>

                    <button
                      className="mt-4 text-center py-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-500 rounded-xl font-medium"
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsVisible(false);
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block text-center py-3 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] rounded-xl font-medium"
                    onClick={() => setIsVisible(false)}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <PopLogout
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default HeadVolunteerSideBar;
