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

      {/* Cat Community News Section */}
      <div className="h-full flex">
        <div className="w-14"></div>
        <div className="flex flex-col  p-10 pl-0 pr-0 ">
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
        </div>
        <div className="w-10"></div>
        <WhiskerMeter />
        <div className="grid grid-cols-[80%_20%] h-full">
          <div className="flex flex-col pl-50 p-10">
            {/* ALL CONTENTS HERE */}
            HOME PAGE <br />
            <Link to="/catcommunitynews" className="bg-[#DC8801]">
              View More Button
            </Link>
          </div>

          {/* Conditional Sidebar */}
          {user?.role === "head_volunteer" ? (
            <HeadVolunteerSideBar />
          ) : (
            <SideNavigation />
          )}
        </div>
        {/* Cat Community Adoption Section */}
        <div className="h-full flex">
          <div className="w-14"></div>
          <div className="flex flex-col  p-10 pl-0 pr-0 ">
            <div className="text-center flex justify-center flex-col p-5 ">
              <p className="text-4xl font-bold"> These Whiskers Are waiting</p>
              <div className="flex justify-around ">
                <div className="pt-10 flex-col gap-10 ">
                  <div className="flex pb-10 justify-around items-center w-full ">
                    <CardAdoption />
                  </div>
                  pagination
                </div>
              </div>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
        <SideNavigation />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
