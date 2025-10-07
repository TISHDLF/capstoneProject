import React, { useEffect, useState } from "react";
import axios from "axios";
import pic1 from "../assets/componentsAssets/adoptiondata1.png";
import pic2 from "../assets/componentsAssets/adoptiondata2.png";
import pic3 from "../assets/componentsAssets/adoptiondata3.png";

const AdoptionData = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCats: 0,
    totalDonations: 0,
    newUsers: 0,
    catsAdopted: 0,
    monthlyDonations: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/admin/api/dashboard"
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[360px] flex flex-col gap-4 text-[13px] sm:text-[14px]">
      {/* Cats Adopted */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 border-b border-gray-200 pb-3">
        <img
          src={pic1}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20 sm:h-24 sm:w-24"
        />
        <div className="text-center sm:text-left">
          <p className="pb-2 font-medium text-gray-700">
            Cats adopted this month:
          </p>
          <p className="bg-[#B5C04A] text-white px-6 py-2 rounded-xl hover:bg-lime-600 transition-all duration-200 text-center inline-block min-w-[60px]">
            {data.catsAdopted}
          </p>
        </div>
      </div>

      {/* Remaining Cat Food */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 border-b border-gray-200 pb-3">
        <img
          src={pic2}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20 sm:h-24 sm:w-24"
        />
        <div className="text-center sm:text-left">
          <p className="pb-2 font-medium text-gray-700">
            Remaining cat food for this month
          </p>
          <div className="flex justify-center sm:justify-start gap-2 mb-1">
            <span>Dry Food:</span>
            <span className="bg-[#B5C04A] text-white px-4 py-1 rounded-xl hover:bg-lime-600 transition-all duration-200">
              3kg
            </span>
          </div>
          <div className="flex justify-center sm:justify-start gap-2">
            <span>Wet Food:</span>
            <span className="bg-[#B5C04A] text-white px-4 py-1 rounded-xl hover:bg-lime-600 transition-all duration-200">
              6kg
            </span>
          </div>
        </div>
      </div>

      {/* Cats Available */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
        <img
          src={pic3}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20 sm:h-24 sm:w-24"
        />
        <div className="text-center sm:text-left">
          <p className="pb-2 font-medium text-gray-700">
            Cats available to adopt:
          </p>
          <p className="bg-[#B5C04A] text-white px-6 py-2 rounded-xl hover:bg-lime-600 transition-all duration-200 text-center inline-block min-w-[60px]">
            {data.totalCats}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdoptionData;
