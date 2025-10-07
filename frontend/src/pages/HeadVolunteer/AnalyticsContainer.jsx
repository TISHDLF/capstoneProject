import React from "react";
import BarChart from "../../components/DivBarChart";
import DonationGauge from "../../components/DonationGauge";
import AdoptionData from "../../components/AdoptionData";
import { useSession } from "../../context/SessionContext";
import { useWhiskerMeter } from "../../context/WhiskerMeterContext";

const AnalyticsContainer = ({ totalAmount }) => {
  const { user } = useSession();
  const { points } = useWhiskerMeter();

  return (
    <div className="md:absolute relative z-50 w-full flex flex-col gap-6">
      {/* Average Cat per Feeding Session */}
      <div className="relative w-full bg-white rounded-3xl md:p-10 p-5 flex flex-col justify-center shadow-xl">
        <p className="text-center text-base md:text-lg font-semibold mb-4">
          Average Cat per Feeding Session
        </p>

        <div className="flex md:flex-row flex-col items-center gap-6">
          {/* Bar Chart */}
          <div className="w-full md:w-[70%]">
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
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-2 text-xs md:text-sm">
            {[
              ["#A52A2A", "Auburn Building"],
              ["#FFA500", "Clubhouse"],
              ["#CBC3E3", "Lavender Building"],
              ["#FF00FF", "Magenta Building"],
              ["#808000", "Olive Building"],
              ["#DDA0DD", "Plum Building"],
            ].map(([color, label], i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 md:w-5 md:h-5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donation + Adoption */}
      <div className="w-full bg-white md:p-10 p-5 flex md:flex-row flex-col items-center justify-center gap-8 shadow-2xl rounded-3xl">
        <div className="w-full md:w-1/2 flex justify-center">
          <DonationGauge currentAmount={totalAmount} targetAmount={10000} />
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <AdoptionData />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContainer;
