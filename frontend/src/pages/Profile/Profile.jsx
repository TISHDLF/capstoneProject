import React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/SideNavigation";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";
import ProgressBar from "../../components/ProgressBar";

import WhiskerMeter from "../../components/WhiskerMeter";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";
import { useSession } from "../../context/SessionContext";

const Profile = () => {
  const location = useLocation();
  const [profile, setProfile] = useState([]);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});
  const [error, setError] = useState("");

  const { user } = useSession();
  const { points } = useWhiskerMeter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/profile`, {
          withCredentials: true,
        });
        const res = JSON.stringify(response.data);
        console.log("User fetched: ", response.data);

        setProfile(response.data);
      } catch (err) {
        console.error(
          "Error fetching user:",
          err.response?.data || err.message
        );
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      profile_image: previewUrl,
      _newFile: file,
      old_image: prev.profile_image,
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("firstname", profile.firstname);
      formData.append("lastname", profile.lastname);
      formData.append("address", profile.address);
      formData.append("email", profile.email);
      formData.append("birthday", profile.birthday);
      formData.append("badge", profile.badge);

      if (profile._newFile) {
        formData.append("profile_image", profile._newFile);
        formData.append("old_image", profile.old_image || "");
      }

      const response = await axios.patch(
        "http://localhost:5000/user/profile/update",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile updated:", response.data);

      URL.revokeObjectURL(profile.profile_image);

      const updated = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true,
      });

      setProfile(updated.data);
      setOriginalProfile(updated.data);
      setUpdateProfile(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const profileUpdateWindow = () => {
    if (updateProfile) {
      setProfile(originalProfile);
      if (profile.profile_image?.startsWith("blob:")) {
        URL.revokeObjectURL(profile.profile_image);
      }
    } else {
      setOriginalProfile(profile);
    }
    setUpdateProfile((prev) => !prev);
    setError("");
  };

  useEffect(() => {
    return () => {
      if (profile.profile_image?.startsWith("blob:")) {
        URL.revokeObjectURL(profile.profile_image);
      }
    };
  }, [profile.profile_image]);

  return (
    <div className="flex flex-col min-h-screen md:pb-10 pb-24">
      <NavigationBar />

      <div className="md:grid md:grid-cols-[80%_20%] h-full">
        <div className="flex flex-col md:pl-50 md:p-10 p-4">
          {/* ALL CONTENTS HERE */}
          <div className="md:grid md:grid-cols-[20%_80%] flex flex-col bg-[#FFF] rounded-[12px] overflow-hidden">
            <div className="flex flex-col gap-6 md:gap-10 md:pt-10 pt-4 p-4 md:p-0">
              <div className="flex flex-row justify-between items-center p-3 bg-[#FFF] md:rounded-tr-[20px] md:rounded-br-[20px] rounded-[15px] shadow-md">
                <label className="font-bold text-[#DC8801] text-sm md:text-base">
                  My Profile
                </label>
                <div className="flex items-center justify-center w-[25px] md:w-[30px] h-auto">
                  <img
                    src="/src/assets/icons/account.png"
                    alt="profile icon"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-[#FFF] p-4 md:p-10 gap-5">
              <div className="flex flex-col gap-4 bg-[#FDF5D8] p-4 md:p-10 rounded-[15px] shadow-md">
                {/* MAIN PROFILE */}

                {!updateProfile && (
                  <>
                    {profile && (
                      <div className="relative flex md:flex-row flex-col gap-5">
                        <div className="flex w-full md:w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2">
                          <img
                            src={
                              `http://localhost:5000/FileUploads/${profile.profile_image}` ||
                              "/src/assets/UserProfile/default_profile_image.jpg"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="font-bold text-sm md:text-base">
                              Name:
                            </label>
                            <label className="text-sm md:text-base">{`${profile.firstname} ${profile.lastname}`}</label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/location-orange.png"
                                  alt=""
                                />
                              </div>
                              Address:
                            </label>
                            <label className="text-sm md:text-base">
                              {profile.address}
                            </label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/email-orange.png"
                                  alt=""
                                />
                              </div>
                              Email:
                            </label>
                            <label className="text-sm md:text-base break-all">
                              {profile.email}
                            </label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/birthday-cake.png"
                                  alt=""
                                />
                              </div>
                              Birthday:
                            </label>
                            <label className="text-sm md:text-base">
                              {profile.birthday}
                            </label>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/badge-orange.png"
                                  alt=""
                                />
                              </div>
                              Badge:
                            </label>
                            <label className="text-sm md:text-base">
                              {profile.badge}
                            </label>
                          </div>
                          <label className="leading-tight text-xs md:text-[14px] pt-4 pb-2 text-[#645e5f]">
                            You've received the <strong>Snuggle Scout</strong>{" "}
                            badge! You're cuddly corners and warming hearts
                            along the way. <br />
                            Thanks for your growing support! Your cozy
                            contributions don't go unnoticed!
                          </label>
                        </div>
                        <div className="md:absolute relative md:bottom-0 md:left-0 bottom-auto left-auto flex flex-row gap-2 mt-4 md:mt-0">
                          <button
                            onClick={profileUpdateWindow}
                            className="bg-[#B5C04A] w-full md:min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A] text-sm md:text-base"
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {updateProfile && (
                  <>
                    {profile && (
                      <form
                        onSubmit={handleSave}
                        className="relative flex md:flex-row flex-col gap-5"
                      >
                        <div className="relative flex w-full md:w-[250px] h-[200px] bg-[#B5C04A] rounded-sm p-2">
                          <label
                            htmlFor="profile_image"
                            className="absolute bottom-3 left-3 bg-[#DC8801] rounded-[15px] cursor-pointer pl-2 pr-2 py-1"
                          >
                            <label
                              htmlFor="profile_image"
                              className="cursor-pointer text-[#FFF] text-[10px] md:text-[12px]"
                            >
                              {!profile.profile_image ? "Add Photo" : "Replace"}
                            </label>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              accept="image/jpeg, image/png"
                              id="profile_image"
                              hidden
                            />
                          </label>
                          <img
                            src={
                              profile.profile_image?.startsWith("blob:")
                                ? profile.profile_image
                                : profile.profile_image
                                ? `http://localhost:5000/FileUploads/${profile.profile_image}`
                                : "/src/assets/UserProfile/default_profile_image.jpg"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col w-full">
                          <div className="flex md:flex-row flex-col w-full gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <div className="flex items-center gap-2 w-full">
                              <label className="font-bold text-sm md:text-base whitespace-nowrap">
                                Firstname:
                              </label>
                              <input
                                type="text"
                                className="w-full text-sm md:text-base"
                                value={profile.firstname || ""}
                                onChange={(e) =>
                                  setProfile((prev) => ({
                                    ...prev,
                                    firstname: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2 w-full">
                              <label className="font-bold text-sm md:text-base whitespace-nowrap">
                                Lastname:
                              </label>
                              <input
                                type="text"
                                className="w-full text-sm md:text-base"
                                value={profile.lastname || ""}
                                onChange={(e) =>
                                  setProfile((prev) => ({
                                    ...prev,
                                    lastname: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base whitespace-nowrap">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/location-orange.png"
                                  alt=""
                                />
                              </div>
                              Address:
                            </label>
                            <input
                              type="text"
                              value={profile.address || ""}
                              className="w-full text-sm md:text-base"
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base whitespace-nowrap">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/email-orange.png"
                                  alt=""
                                />
                              </div>
                              Email:
                            </label>
                            <input
                              type="text"
                              value={profile.email}
                              className="w-full text-sm md:text-base"
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base whitespace-nowrap">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/birthday-cake.png"
                                  alt=""
                                />
                              </div>
                              Birthday:
                            </label>
                            <input
                              type="date"
                              value={profile.birthday}
                              className="text-sm md:text-base"
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  birthday: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-row items-center gap-3 border-b-2 border-dashed border-[#bbc3c1] pt-2 pb-2">
                            <label className="flex flex-row items-center font-bold gap-[5px] text-sm md:text-base">
                              <div className="w-[25px] md:w-[30px] h-auto">
                                <img
                                  src="/src/assets/icons/badge-orange.png"
                                  alt=""
                                />
                              </div>
                              Badge:
                            </label>
                            <label className="text-sm md:text-base">
                              {profile.badge}
                            </label>
                          </div>
                          <label className="leading-tight text-xs md:text-[14px] pt-4 pb-2 text-[#645e5f]">
                            You've received the <strong>Snuggle Scout</strong>{" "}
                            badge! You're cuddly corners and warming hearts
                            along the way. <br />
                            Thanks for your growing support! Your cozy
                            contributions don't go unnoticed!
                          </label>
                        </div>
                        <div className="md:absolute relative md:bottom-0 md:left-0 bottom-auto left-auto flex flex-row gap-2 mt-4 md:mt-0">
                          <button
                            type="submit"
                            className="bg-[#B5C04A] w-full md:min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#CFDA34] active:bg-[#B5C04A] cursor-pointer text-sm md:text-base"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={profileUpdateWindow}
                            className="bg-[#DC8801] w-full md:min-w-[90px] p-2 rounded-[10px] text-[#000] hover:bg-[#fe9f07] active:bg-[#977655] cursor-pointer text-sm md:text-base"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 bg-[#FDF5D8] p-4 md:p-10 rounded-[15px] shadow-md">
                {/* WHISKER METER */}
                <ProgressBar user={{ points }} />
              </div>
            </div>
          </div>
        </div>

        {user?.role === "head_volunteer" ? (
          <HeadVolunteerSideBar />
        ) : (
          <SideNavigation />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
