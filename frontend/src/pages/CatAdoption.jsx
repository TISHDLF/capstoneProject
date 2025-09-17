import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import CardAdoption from "../components/CardAdoption";
// Get logged-in user from sessionStorage
const storedUser = sessionStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;
const CatAdoption = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CatBot />
      <NavigationBar />
      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}
      <div className="grid grid-cols-[80%_20%] h-full">
        <div className="flex flex-col pl-50 p-10">
          <CardAdoption></CardAdoption>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CatAdoption;
