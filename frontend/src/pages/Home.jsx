import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import WhiskerMeter from "../components/WhiskerMeter";
import CardNews from "../components/CardNews";
import CardAdoption from "../components/CardAdoption";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";

const Home = () => {
  // Get logged-in user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />

      <WhiskerMeter> </WhiskerMeter>
      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}
      {/* Cat Community News Section */}
      <div className="h-full  w-full ">
        <div className="flex p-10 pl-0 pr-0 ">
          <div className="w-12"></div>
          <div className="text-center flex justify-center flex-col p-5 ">
            <p className="text-4xl font-bold"> SPR Cat Community News</p>
            <div className="flex justify-around ">
              <div className="pt-10 flex-col gap-10 ">
                <div className="flex pb-10 justify-around items-center w-full ">
                  <CardNews />
                  <CardNews />
                  <CardNews />
                </div>
                pagination
              </div>
            </div>
          </div>
          <div className="w-40"></div>
        </div>
        <WhiskerMeter />

        {/* Cat Community Adoption Section */}
        <div className="h-full flex justify-center">
          <div className="flex  p-10 pl-0 pr-0 ">
            <div className="w-12"></div>
            <div className="text-center flex justify-center flex-col p-5 ">
              <p className="text-4xl font-bold"> These Whiskers Are waiting</p>
              <div className="flex justify-around ">
                <div className="pt-10 flex-col gap-10 ">
                  <div className="flex  pb-10 justify-around items-center w-full flex-wrap ">
                    <CardAdoption />
                  </div>
                  pagination
                </div>
              </div>
            </div>
            <div className="w-40"></div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
