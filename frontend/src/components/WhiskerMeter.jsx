// WhiskerMeter.jsx
import React, { useState } from "react";
import { useWhiskerMeter } from "../context/WhiskerMeterContext"; // ✅ import context
import meterPhoto from "../assets/paw1.png";
import meterPhoto1 from "../assets/paw2.png";

const WhiskerMeter = () => {
  const [expanded, setExpanded] = useState(false);
  const circleCount = 5;

  // ✅ Get points from context
  const { points } = useWhiskerMeter();

  const maxPoints = 200;
  const progressValue = Math.min(
    Math.ceil((points / maxPoints) * circleCount),
    circleCount
  );

  const labels = [
    "The Catnip Captain",
    "Meowntain Mover",
    "Furmidable Friend",
    "Snuggle Scout",
    "Toe Bean Trainee",
  ];

  return (
    <div className="w-24 h-full z-50 fixed left-0 top-[20%]">
      <div
        className={`transition-all duration-300 ${
          expanded ? "w-80 " : "w-24 "
        } flex-shrink-0 absolute left-0 z-10`}
        onClick={() => setExpanded((prev) => !prev)}
        style={{ cursor: "pointer", height: "500px" }}
      >
        <nav>
          <header>
            <div
              className={
                "bg-yellow-50 rounded-r-4xl shadow-lg h-full transition-all duration-300 " +
                (expanded ? "w-80" : "w-24 ")
              }
              style={{ height: "500px" }}
            >
              <span>
                <div
                  className={
                    "rounded-r-4xl shadow-lg p-5 pt-2 pb-2 flex justify-end transition-all duration-500 " +
                    (expanded ? "bg-yellow-600" : "")
                  }
                >
                  <h1
                    className={
                      "flex flex-col justify-center ml-10 text-nowrap text-sm font-semibold text-gray-800 space-y-8 transition-all duration-700 " +
                      (expanded ? "w-64" : "w-0 overflow-hidden")
                    }
                  >
                    The Whisker Meter
                  </h1>
                  <img
                    src={expanded ? meterPhoto1 : meterPhoto}
                    alt="Whisker Meter Icon"
                    className="w-15 h-15 transition-all duration-700"
                  />
                </div>

                {/* Step-based Progress Section */}
                <div className="flex px-8 py-8 space-x-4 items-center h-[420px]">
                  {/* Progress bar container */}
                  <div className="relative flex flex-col items-center justify-between h-full px-4">
                    {/* Background line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-600/30 rounded-full"></div>

                    {/* Filled line */}
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-yellow-600 rounded-full transition-all duration-500"
                      style={{
                        height: `${(progressValue / circleCount) * 100}%`,
                        bottom: 0,
                      }}
                    ></div>

                    {/* Circles */}
                    {Array.from({ length: circleCount }).map((_, i) => {
                      const circleIndexFromBottom = circleCount - i;
                      const isFilled =
                        circleIndexFromBottom <= progressValue &&
                        progressValue > 0;

                      return (
                        <div
                          key={i}
                          className={`z-10 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                            isFilled
                              ? "bg-yellow-600 border-yellow-600"
                              : "bg-white border-yellow-600"
                          }`}
                        ></div>
                      );
                    })}
                  </div>

                  {/* Labels */}
                  <div
                    className={
                      "flex flex-col justify-between h-full text-sm text-nowrap font-medium text-gray-800 transition-all duration-300 " +
                      (expanded ? "w-64" : "w-0 overflow-hidden")
                    }
                  >
                    {labels.map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>
                </div>
              </span>
            </div>
          </header>
        </nav>
      </div>
    </div>
  );
};

export default WhiskerMeter;
