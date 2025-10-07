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
    <div className="flex flex-col min-h-screen md:pb-10 pb-24">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />
      <main className="relative md:p-20 md:pl-40 p-4 flex justify-start flex-col">
        <div className="md:pl-190"></div>
        <div className="relative w-full md:w-250 h-auto md:h-300 bg-white md:p-20 p-4 shadow-xl flex-col justify-center rounded-2xl z-10">
          {/* Tab Navigation - Mobile: Stacked, Desktop: Side by side */}
          <div className="flex md:flex-row flex-col gap-2 md:gap-0 mb-4 md:mb-0">
            {/* Analytics Tab */}
            <div
              className={`bg-[#B5C04A] text-white md:w-60 w-full justify-center md:rounded-t-2xl rounded-xl p-4 md:absolute md:-top-14.5 md:right-3 relative top-0 right-0 cursor-pointer transition-all duration-300 ease-in-out border-2 md:border-b-0 text-center text-sm md:text-base ${
                activeTab === "Analytics"
                  ? "z-20"
                  : "z-10 md:-top-10 opacity-80"
              }`}
              onClick={() => handleTabClick("Analytics")}
            >
              <div className="flex justify-center">Analytics</div>
            </div>

            {/* Reports Tab */}
            <div
              className={`bg-[#B5C04A] text-white md:w-60 w-full justify-center md:rounded-t-2xl rounded-xl p-4 md:absolute md:-top-14.5 md:right-65 relative top-0 right-0 cursor-pointer transition-all duration-300 ease-in-out border-2 md:border-b-0 text-center text-sm md:text-base ${
                activeTab === "Reports" ? "z-20 " : "z-10 md:-top-10 opacity-80"
              }`}
              onClick={() => handleTabClick("Reports")}
            >
              <div className="flex justify-center">Reports</div>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="mt-4 md:mt-0">
            {activeTab === "Analytics" ? (
              <AnalyticsContainer totalAmount={totalAmount} />
            ) : (
              <ReportsContainer totalAmount={totalAmount} />
            )}
          </div>
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
