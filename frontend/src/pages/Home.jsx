import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import WhiskerMeter from "../components/WhiskerMeter";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";

const Home = () => {
  // Get logged-in user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
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
      <Footer />
    </div>
  );
};

export default Home;
