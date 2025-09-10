import { memo } from "react";
import React from "react";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/SideNavigation";
import Footer from "../../components/Footer";
import CatBot from "../../components/CatBot";
import WhiskerMeter from "../../components/WhiskerMeter";
import { Link } from "react-router-dom";
const AdopteeForm1 = () => {
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter> </WhiskerMeter>
      <div className="grid grid-cols-[80%_20%] h-full">
        <div className="flex flex-col pl-50 p-10 w-full h-full">
          <div className="w-270 h-190 rounded-2xl bg-amber-50 shadow-2xl ml-20 flex">
            <div className="w-50">
              <div>
                <img src="src/assets/icons/backbtn.png" alt="" />
              </div>
            </div>

            <div className="flex flex-col justify-start w-full h-full p-10 pl-40">
              {/* 1 */}
              <div className="pb-10">
                <p>
                  1. Please enter the name of the SPR Cat you’d like to adopt:
                </p>
                <div className="pl-5 pt-2">
                  <input
                    type="text"
                    className="border border-black rounded-3xl p-3 pl-5 w-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="Cat Name"
                  />
                </div>
              </div>
              {/* 2 */}
              <div className="pb-10">
                <p>
                  2. Please let us know how you found out about the adoption
                  opportunity:
                </p>
                <div className="pl-5 pt-2 ">
                  <form action="" className="flex gap-5 flex-wrap">
                    <label
                      htmlFor="1"
                      className="flex gap-2 border-1 border-black rounded-3xl pl-5 p-3 w-60 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      tabIndex={0}
                    >
                      <input
                        type="radio"
                        id="1"
                        name="guestion2"
                        value="SPR Cat Facebook Page"
                        className="hover:cursor-pointer"
                      />
                      SPR Cat Facebook Page
                    </label>

                    <label
                      htmlFor="2"
                      className="flex gap-2 border-1 border-black rounded-3xl pl-5 p-3 w-60 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      tabIndex={0}
                    >
                      <input
                        type="radio"
                        id="2"
                        name="guestion2"
                        value="Facebook Group"
                        className="hover:cursor-pointer"
                      />
                      Facebook Group
                    </label>

                    <label
                      htmlFor="3"
                      className="flex gap-2 border-1 border-black rounded-3xl pl-5 p-3 w-60 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      tabIndex={0}
                    >
                      <input
                        type="radio"
                        id="3"
                        name="guestion2"
                        value="SPR Community Page"
                        className="hover:cursor-pointer"
                      />
                      SPR Community Page
                    </label>

                    <label
                      htmlFor="4"
                      className="flex gap-2 border-1 border-black rounded-3xl pl-5 p-3 w-60 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      tabIndex={0}
                    >
                      <input
                        type="radio"
                        id="4"
                        name="guestion2"
                        value="Referred by a Volunteer"
                        className="hover:cursor-pointer"
                      />
                      Referred by a Volunteer
                    </label>

                    <label
                      htmlFor="5"
                      className="flex gap-2 border-1 border-black rounded-3xl pl-5 p-3 w-125 hover:cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      tabIndex={0}
                    >
                      <input
                        type="radio"
                        id="5"
                        name="guestion2"
                        value="Other"
                        className="hover:cursor-pointer"
                      />
                      Other:
                    </label>
                  </form>
                </div>
              </div>
              {/* 3 */}
              <div className="pb-10">
                <p className="text-wrap w-150">
                  3. Kindly attach an ID to verify your identity - we do our
                  best to make sure our cats are adopted by verified people so
                  that they are assured a safe home. Thank you for
                  understanding.
                </p>
                <p className="text-gray-400 ">
                  (You may opt to blur sensitive data like Social Security info
                  and etc.)
                </p>
                <div className="pl-5 pt-2 ">
                  <div className="flex gap-5 items-center">
                    <img src="src/assets/icons/id-card.png" alt="" />
                    <button className="flex gap-3 bg-yellow-600 text-white rounded-3xl p-3 pl-5 pr-5 ml-5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent hover:cursor-pointer">
                      Attach Photo
                      <img
                        src="src/assets/icons/gallery-add.png"
                        alt=""
                        className="pl-3"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    to="/form2"
                    className=" bg-[#B5C04A] p-5 pl-15 pr-15 rounded-3xl text-amber-50  hover:shadow-lg focus:outline-none  focus:border-transparent hover:cursor-pointer mt-10"
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute left-40 top-80 bg-yellow-600 text-white rounded-bl-lg rounded-tl-lg rounded-br-3xl rounded-tr-3xl p-4 flex justify-between ">
              <p className="pr-5">Adoptee Form</p>
              <img src="src/assets/icons/pinpaper-filled.png" alt="" />
            </div>
            <div className="absolute left-40 top-130 text-wrap w-50  bg-yellow-600 text-white rounded-bl-lg rounded-tl-lg rounded-br-3xl rounded-tr-3xl p-4 flex justify-between ">
              <p>
                Please answer the following questions to submit an adoption
                request to be reviewed by our Head Volunteers!
              </p>
            </div>
          </div>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>
  );
};

export default memo(AdopteeForm1);
