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
    <div className="md:absolute relative z-50 w-full">
      <div className="relative w-200 h-auto bg-white rounded-3xl md:p-10 p-4 flex flex-col justify-center shadow-xl">
        <p className="text-center text-sm md:text-base font-semibold mb-4">
          Average Cat per Feeding Session
        </p>

        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full md:w-auto">
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
          <div className="flex flex-col gap-2 text-xs md:text-sm">
            <div className="flex gap-4 items-center">
              <div className="bg-[#A52A2A] w-5 h-5 flex-shrink-0"></div>
              <span>Auburn Building</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#FFA500] w-5 h-5 flex-shrink-0"></div>
              <span>Clubhouse</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#CBC3E3] w-5 h-5 flex-shrink-0"></div>
              <span>Lavender Building</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#FF00FF] w-5 h-5 flex-shrink-0"></div>
              <span>Magenta Building</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#808000] w-5 h-5 flex-shrink-0"></div>
              <span>Olive Building</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#DDA0DD] w-5 h-5 flex-shrink-0"></div>
              <span>Plum Building</span>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="w-200 bg-white md:p-10 p-4 flex md:flex-row flex-col gap-6 shadow-2xl rounded-3xl">
        <div className="w-full md:w-auto md:pr-10">
          <DonationGauge currentAmount={totalAmount} targetAmount={10000} />
        </div>
        <div className="w-full md:w-auto">
          <AdoptionData />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContainer;
