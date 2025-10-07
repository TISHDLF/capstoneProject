import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import SideNavigation from "../components/SideNavigation";
import Footer from "../components/Footer";
import CatBot from "../components/CatBot";
import HeadVolunteerSideBar from "../components/HeadVolunteerSideBar";
import CardAdoption from "../components/CardAdoption";
import { useSession } from "../context/SessionContext";

const CatAdoption = () => {
  const { user } = useSession();

  return (
    <div className="flex flex-col min-h-screen md:pb-10 pb-24">
      <CatBot />
      <NavigationBar />
      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}
      <div className="md:grid md:grid-cols-[80%_20%] h-full">
        <div className="flex flex-col md:pl-50 md:p-10 p-4">
          <CardAdoption />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CatAdoption;
