// ProgressBar.jsx - Mobile Responsive Version
import React, { useState } from "react";
import { useWhiskerMeter } from "../context/WhiskerMeterContext";

const ProgressBar = () => {
  const circleCount = 5;
  const { points } = useWhiskerMeter();
  const maxPoints = 200;

  const progressValue = Math.min(
    Math.ceil((points / maxPoints) * circleCount),
    circleCount
  );

  const labels = [
    "Toe Bean Trainee",
    "Snuggle Scout",
    "Furmidable Friend",
    "Meowntain Mover",
    "The Catnip Captain",
  ];

  const [activeCircle, setActiveCircle] = useState(null);

  const handleCircleClick = (index) => {
    setActiveCircle(index === activeCircle ? null : index);
  };

  return (
    <div className="flex p-4 md:p-6 md:pl-12 justify-between items-center w-full max-w-[600px]">
      <div className="relative flex flex-row items-center justify-between w-full">
        {/* Background line */}
        <div className="absolute top-1/2 transform -translate-y-1/2 h-1 w-full bg-yellow-600/30 rounded-full"></div>

        {/* Filled line */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-yellow-600 rounded-full transition-all duration-500"
          style={{
            width: `${(progressValue / circleCount) * 100}%`,
            left: 0,
          }}
        ></div>

        {/* Circles */}
        {Array.from({ length: circleCount }).map((_, i) => {
          const isFilled = i < progressValue && progressValue > 0;

          return (
            <div key={i} className="relative flex flex-col items-center group">
              {/* Circle */}
              <div
                onClick={() => handleCircleClick(i)}
                className={`z-10 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 
                  ${
                    isFilled
                      ? "bg-yellow-600 border-yellow-600 text-white"
                      : "bg-white border-yellow-600"
                  } hover:scale-110 active:scale-95`}
              ></div>

              {/* Label - Mobile: shows on click, Desktop: shows on hover */}
              <span
                className={`absolute top-8 md:top-10 text-[10px] md:text-xs text-center w-20 md:w-28 p-1 bg-white rounded-md shadow-md transition-opacity duration-300 z-20
                  ${
                    activeCircle === i
                      ? "opacity-100"
                      : "opacity-0 md:group-hover:opacity-100"
                  }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
