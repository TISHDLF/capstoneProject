import React, { useState, useEffect } from "react";
import CatBot from "../../components/CatBot";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import WhiskerMeter from "../../components/WhiskerMeter";
import HeadVolunteerSideBar from "../../components/HeadVolunteerSideBar";
import SideNavigation from "../../components/SideNavigation";
import { useSession } from "../../context/SessionContext";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";
import axios from "axios";

import map from "/src/assets/FeedingMap.png";
import clip from "/src/assets/icons/clipboard-white.png";
const FeedingInfo = () => {
  const { user } = useSession();
  const [schedule, setSchedule] = useState([]);

  const { points } = useWhiskerMeter();
  const [showReportBox, setShowReportBox] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/report/feeding/schedule",
          {
            withCredentials: true,
          }
        );
        setSchedule(res.data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };

    if (user) fetchSchedule();
  }, [user]);
  const handleWriteReport = () => {
    setShowReportBox(true);
  };

  const handleSubmitReport = async () => {
    try {
      if (!schedule.length) {
        alert("No schedule found to submit report for.");
        return;
      }

      // Example: report for the first schedule entry
      const volunteerId = schedule[0].volunteer_id;

      await axios.post(
        "http://localhost:5000/report/feeding/report",
        { reportText, volunteerId },
        { withCredentials: true }
      );

      alert("Report submitted!");
      setReportText("");
      setShowReportBox(false);
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <WhiskerMeter user={{ points }} />

      {user?.role === "head_volunteer" ? (
        <HeadVolunteerSideBar />
      ) : (
        <SideNavigation />
      )}

      <div className="relative p-10 pl-50 h-full">
        <div className="relative flex flex-col gap-5 bg-[#FFF] rounded-[25px] w-240 h-auto">
          <div className="absolute -left-11.5 top-10 flex items-center gap-5 p-4 bg-[#ffffff] shadow-md rounded-[15px] w-40">
            <label className="flex flex-row font-bold text-[#DC8801]">
              Feeding Information
            </label>
            <div className="w-[40px] h-auto">
              <img src={clip} alt="white clipboard" className="w-full h-auto" />
            </div>
          </div>

          <img src={map} alt="" className="rounded-t-2xl" />

          <div className="relative p-5 flex-col">
            <p className="text-[#5d5d5d] absolute top-0 text-[14px]">
              you can also find this map sent to you on your email
            </p>

            <div className="h-full pt-5">
              <h2 className="text-xl font-bold mb-4">Feeding Reports</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <h2>Your Feeding Schedule</h2>
                  {schedule.length > 0 ? (
                    <ul>
                      {schedule.map((item) => (
                        <li key={item.volunteer_id}>
                          {item.volunteer_name} –{" "}
                          {new Date(item.feeding_date).toDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No schedule found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Animated report box */}
            <div
              className={`transition-all duration-500 ease-out overflow-hidden pt-10 ${
                showReportBox ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <textarea
                type="text"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Write your report here..."
                className="h-40 w-full text-start p-2 border rounded-lg"
              />
            </div>

            {/* Animated button group */}
            <div className="pt-10 flex gap-3 justify-end transition-all duration-500 ease-in-out">
              {!showReportBox && (
                <button
                  onClick={handleWriteReport}
                  className="bg-[#DC8801] rounded-2xl p-3 pl-5 pr-5 transition-all duration-300 hover:scale-105"
                >
                  Write Report
                </button>
              )}

              {showReportBox && (
                <div className="flex gap-3 transition-all duration-500 ease-in-out">
                  <button
                    className="bg-gray-400 rounded-2xl p-3 pl-5 pr-5 transition-all duration-300 hover:scale-105"
                    onClick={() => setShowReportBox(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    className="bg-[#DC8801] rounded-2xl p-3 pl-5 pr-5 transition-all duration-300 hover:scale-105"
                  >
                    Submit Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeedingInfo;
