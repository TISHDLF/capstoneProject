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
    <div className="bg-white rounded-lg shadow-sm p-4 w-80 h-80 flex-col text-[12px]">
      <div className="flex pb-5 gap-2">
        <img
          src={pic1}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20 "
        />
        <div className="">
          <p className="pb-3">Cats adopted this month:</p>
          <p className="bg-[#B5C04A] text-white p-2 pr-6 pl-6 flex justify-center w-15 rounded-xl hover:bg-lime-600 ">
            {data.catsAdopted}
          </p>
        </div>
      </div>
      <div className="flex pb-5 gap-2">
        <img
          src={pic2}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20"
        />
        <div>
          <p className="pb-2">Remaining cat food for this month</p>
          <div className="flex gap-[5px]">
            <p className="pt-1">Dry Food:</p>
            <p className="bg-[#B5C04A] text-white  p-1 pr-6 pl-6 flex justify-center w-15 rounded-xl hover:bg-lime-600 ">
              3kg
            </p>
          </div>
          <br />
          <div className="flex gap-[5px]">
            <p className="pt-1">Wet Food:</p>
            <p className="bg-[#B5C04A] text-white p-1 pr-6 pl-6 flex justify-center w-16 rounded-xl hover:bg-lime-600 ">
              6kg
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <img
          src={pic3}
          alt=""
          className="border-[#DC8801] border-4 rounded-2xl h-20 w-20"
        />
        <div className="">
          <p className="pb-3">Cats available to adopt:</p>
          <p className="bg-[#B5C04A] text-white p-2 pr-6 pl-6 flex justify-center w-15 rounded-xl hover:bg-lime-600 ">
            {data.totalCats}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdoptionData;
