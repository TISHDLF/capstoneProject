import React, { useState, useEffect } from "react";
import CatBot from "../../components/CatBot";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/SideNavigation";
import Footer from "../../components/Footer";
import WhiskerMeter from "../../components/WhiskerMeter";
import { useSession } from "../../context/SessionContext";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";
import axios from "axios";
import AnalyticsContainer from "./AnalyticsContainer";
import ReportsContainer from "./ReportsContainer";

const ReportandAnalytics = () => {
  const { user } = useSession();
  const { points } = useWhiskerMeter();
  const [activeTab, setActiveTab] = useState("Analytics");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/donate/api/donations/total"
        );
        setTotalAmount(res.data.totalAmount);
      } catch (err) {
        console.error("Failed to fetch donation total:", err);
      }
    };
    fetchTotal();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />
      <main className="relative p-20 pl-40 flex justify-start flex-col">
        <div className="pl-190"></div>
        <div className="relative w-250 h-300 bg-white p-20 shadow-xl  flex-col justify-center rounded-2xl  z-10">
          {/* Analytics Tab */}
          <div
            className={`bg-[#B5C04A] text-white w-60 justify-center rounded-t-2xl p-4 absolute -top-14.5 right-3 cursor-pointer transition-all duration-300 ease-in-out border-2 border-b-0 ${
              activeTab === "Analytics" ? "z-20" : "z-10 -top-10 opacity-80"
            }`}
            onClick={() => handleTabClick("Analytics")}
          >
            <div className="flex">Analytics</div>
          </div>

          {/* Reports Tab */}
          <div
            className={`bg-[#B5C04A] text-white w-60 justify-center rounded-t-2xl p-4 absolute -top-14.5 right-65 cursor-pointer transition-all duration-300 ease-in-out border-2 border-b-0 ${
              activeTab === "Reports" ? "z-20 " : "z-10 -top-10 opacity-80"
            }`}
            onClick={() => handleTabClick("Reports")}
          >
            <div className="flex">Reports</div>
          </div>

          {/* Dynamic Content */}
          {activeTab === "Analytics" ? (
            <AnalyticsContainer totalAmount={totalAmount} />
          ) : (
            <ReportsContainer totalAmount={totalAmount} />
          )}
        </div>
      </main>

      {user?.role === "head_volunteer" || user?.role === "admin" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}
      <Footer />
    </div>
  );
};

export default ReportandAnalytics;
