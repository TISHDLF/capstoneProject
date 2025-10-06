import React, { useState } from "react";
import { useWhiskerMeter } from "../context/WhiskerMeterContext";
import meterPhoto from "/src/assets/paw1.png";
import meterPhoto1 from "/src/assets/paw2.png";

const WhiskerMeter = () => {
  const [expanded, setExpanded] = useState(false);
  const circleCount = 5;
  const { points, badge } = useWhiskerMeter();

  const maxPoints = 200;
  const progressValue = Math.min(
    Math.ceil((points / maxPoints) * circleCount),
    circleCount
  );

  const labels = [
    "The Catnip Captain",
    "Meowtain Mover",
    "Furmidable Friend",
    "Snuggle",
    "Toe Bean Trainee",
  ];

  return (
    <>
      {/* Desktop WhiskerMeter - Hidden on mobile */}
      <div className="hidden md:block fixed -left-4 top-[20%] scale-90 z-10 pointer-events-none">
        <div
          className={`transition-all duration-300 ease-in-out ${
            expanded ? "w-80" : "w-24"
          } flex-shrink-0 pointer-events-auto cursor-pointer`}
          onClick={() => setExpanded((prev) => !prev)}
          style={{ height: "500px" }}
        >
          <nav>
            <header>
              <div
                className={`bg-yellow-50 rounded-r-[40px] shadow-lg h-full transition-all duration-300 overflow-hidden ${
                  expanded ? "w-70" : "w-26"
                }`}
              >
                {/* Header Section */}
                <div
                  className={`rounded-r-[40px] shadow-lg p-5 pt-2 pb-2 flex justify-between items-center transition-all duration-500 ${
                    expanded ? "bg-yellow-600" : ""
                  }`}
                >
                  <div
                    className={`ml-10 overflow-hidden transition-all duration-700 ${
                      expanded
                        ? "opacity-100 translate-x-0 max-w-[200px]"
                        : "opacity-0 -translate-x-10 max-w-0"
                    }`}
                  >
                    <span className="block whitespace-nowrap font-semibold text-gray-800">
                      The Whisker Meter
                    </span>
                  </div>

                  <img
                    src={expanded ? meterPhoto1 : meterPhoto}
                    alt="Whisker Meter Icon"
                    className="w-15 h-15 transition-all duration-700 ml-4"
                  />
                </div>

                {/* Step Progress */}
                <div className="flex p-6 pr-12 space-x-4 justify-between items-center h-[350px]">
                  {/* Progress Line */}
                  <div className="relative flex flex-col items-center justify-between h-full">
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
                    className={`flex flex-col justify-between h-full text-sm text-nowrap font-medium text-[#2F2F2F] transition-all duration-700 ease-in-out overflow-hidden ${
                      expanded
                        ? "max-w-[200px] opacity-100 translate-x-0"
                        : "max-w-0 opacity-0 -translate-x-10"
                    }`}
                  >
                    {labels.map((label, i) => (
                      <span
                        key={i}
                        className={
                          label === badge ? "text-yellow-600 font-bold" : ""
                        }
                      >
                        {label.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>
          </nav>
        </div>
      </div>

      {/* Mobile WhiskerMeter - Shown only on mobile */}
      <div className="md:hidden fixed bottom-25 left-4 z-10">
        <div
          className={`transition-all duration-300 ease-in-out cursor-pointer ${
            expanded ? "bg-yellow-50 rounded-3xl shadow-lg p-4 w-64" : ""
          }`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {/* Collapsed Circle - Just the icon */}
          {!expanded && (
            <div className="bg-yellow-600 rounded-full p-3 shadow-lg w-14 h-14 flex items-center justify-center">
              <img
                src={meterPhoto1}
                alt="Whisker Meter Icon"
                className="w-8 h-8"
              />
            </div>
          )}

          {/* Expanded View */}
          {expanded && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center bg-yellow-600 rounded-2xl p-3 mb-3">
                <span className="font-semibold text-gray-800 text-sm">
                  The Whisker Meter
                </span>
                <img
                  src={meterPhoto1}
                  alt="Whisker Meter Icon"
                  className="w-10 h-10"
                />
              </div>

              {/* Progress Section */}
              <div className="flex justify-between items-start py-4 px-2">
                {/* Progress Line */}
                <div className="relative flex flex-col items-center justify-between h-64">
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
                        className={`z-10 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                          isFilled
                            ? "bg-yellow-600 border-yellow-600"
                            : "bg-white border-yellow-600"
                        }`}
                      ></div>
                    );
                  })}
                </div>

                {/* Labels */}
                <div className="flex flex-col justify-between h-64 text-xs font-medium text-[#2F2F2F] ml-4">
                  {labels.map((label, i) => (
                    <span
                      key={i}
                      className={
                        label === badge ? "text-yellow-600 font-bold" : ""
                      }
                    >
                      {label.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Points Display */}
              <div className="text-center text-sm font-semibold text-gray-700 mt-2 pb-2">
                {points} / {maxPoints} Points
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WhiskerMeter;
