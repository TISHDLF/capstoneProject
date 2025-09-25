import React, { useState, useEffect } from "react";
import CatBot from "../../components/CatBot";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/SideNavigation";
import Footer from "../../components/Footer";
import WhiskerMeter from "../../components/WhiskerMeter";
import { useSession } from "../../context/SessionContext";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";
import { Link } from "react-router-dom";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";
import BarChart from "../../components/DivBarChart";
import DonationGauge from "../../components/DonationGauge"; // <-- new chart component
import AdoptionData from "../../components/AdoptionData";
import axios from "axios";
const ReportandAnalytics = () => {
  const { user } = useSession();
  const { points } = useWhiskerMeter();
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
  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />

      <main className="p-20 pl-40 flex justify-start flex-col ">
        <div className="pl-190">
          <div className="bg-[#B5C04A] text-white w-60 justify-end rounded-t-2xl p-4">
            <div className="flex">Reports and Analytics</div>
          </div>
        </div>
        <div className="w-250 h-300 bg-white p-20 shadow-lg flex-col justify-center rounded-tl-2xl rounded-bl-2xl rounded-br-2xl">
          <div className="w-full h-100 bg-white rounded-3xl p-10 flex flex-col justify-center shadow-xl">
            <p className="text-center">Average Cat per Feeding Session</p>
            <div className="flex">
              <BarChart
                labels={["", "", "", "", "", ""]}
                dataSet={[5, 2, 3, 4, 3, 4]}
                colors={[
                  "#A52A2A",
                  "#FFA500",
                  "#CBC3E3",
                  "#FF00FF",
                  "#808000",
                  "#DDA0DD",
                ]}
                label="Cats per Building"
              />
              <div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#A52A2A] w-5 h-5"></div>Auburn Building
                </div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#FFA500] w-5 h-5"></div>Clubhouse
                </div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#CBC3E3] w-5 h-5"></div>Lavender Building
                </div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#FF00FF] w-5 h-5"></div>Magenta Building
                </div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#808000] w-5 h-5"></div>Olive Building
                </div>
                <div className="flex gap-4 pb-4">
                  <div className="bg-[#DDA0DD] w-5 h-5"></div>Plum Building
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="w-full bg-white p-10 flex shadow-2xl rounded-3xl">
            <div className="pr-10">
              <DonationGauge currentAmount={totalAmount} targetAmount={10000} />
            </div>
            <div>
              <AdoptionData />
            </div>
          </div>
          <div className="pt-50 w-auto flex justify-center ">
            <button className="bg-[#B5C04A] text-white px-4 py-2 rounded-xl hover:bg-lime-600 w-90">
              Generate Monthly Report
            </button>
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
