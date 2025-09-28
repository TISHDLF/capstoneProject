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
    <div className="absolute z-50">
      <div className="relative w-full h-100 bg-white rounded-3xl p-10 flex flex-col justify-center shadow-xl">
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
    </div>
  );
};

export default AnalyticsContainer;
