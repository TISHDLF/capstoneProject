import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import AdminSideBar from "../../components/AdminSideBar";

const Dashboard = () => {
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
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="flex flex-col items-center p-10 min-h-screen gap-10 mx-auto overflow-y-scroll">
          <div className="flex flex-col gap-10 w-full">
            {/* TOTALS */}
            <div className="flex flex-col gap-5 p-5 border-dashed border-2 border-[#DC8801] rounded-[25px]">
              <label className="font-bold text-2xl">Admin Dashboard</label>
              <div className="grid grid-cols-3 w-full h-auto gap-5">
                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>Total Users</label>
                    <label className="font-bold">{data.totalUsers}</label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total--user.png"
                    alt=""
                  />
                </div>

                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>Total Cats</label>
                    <label className="font-bold">{data.totalCats}</label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total-cats.png"
                    alt=""
                  />
                </div>

                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>Total Financial Donations</label>
                    <label className="font-bold">
                      ₱{Number(data.totalDonations).toFixed(2)}
                    </label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total-donation.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* MONTHLY SUMMARY */}
            <div className="flex flex-col gap-5 bg-[#977655] p-5 rounded-[25px]">
              <label className="font-bold text-2xl text-white">
                Monthly Summary
              </label>
              <div className="grid grid-cols-3 w-full h-auto gap-5">
                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>New Users</label>
                    <label className="font-bold">{data.newUsers}</label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total--user.png"
                    alt=""
                  />
                </div>

                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>Total Cats Adopted</label>
                    <label className="font-bold">{data.catsAdopted}</label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total-cats.png"
                    alt=""
                  />
                </div>

                <div className="flex flex-row items-center justify-evenly p-5 bg-white rounded-[20px] shadow-md">
                  <div className="flex flex-col">
                    <label>Total Financial Donations</label>
                    <label className="font-bold">
                      <label className="font-bold">
                        ₱{Number(data.monthlyDonations).toFixed(2)}
                      </label>
                    </label>
                  </div>
                  <img
                    src="/src/assets/icons/admin-icons/total-donation.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
