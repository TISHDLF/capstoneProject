import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios"; // ✅ missing import
import { useSession } from "../../../context/SessionContext";

const Donation = () => {
  const navigate = useNavigate();
  const { user, loading } = useSession();

  const [donations, setDonations] = useState([]); // ✅ renamed apps → donations
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/");
        return;
      }

      const fetchDonations = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/donate/api/donations",
            { withCredentials: true }
          );

          const data = Array.isArray(response.data)
            ? response.data
            : response.data.donations || [];

          setDonations(data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      };

      fetchDonations();
    }
  }, [user, loading, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="flex flex-col items-center p-10 min-h-screen gap-5 mx-auto overflow-y-scroll">
          <div className="flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
            <label className="text-[24px] font-bold text-[#2F2F2F]">
              Donations
            </label>
          </div>

          {/* FILTERS */}
          <div className="flex flex-row justify-between w-full">
            <form className="flex gap-2">
              <input
                type="search"
                placeholder="Search"
                className="bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]"
              />
              <button className="bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]">
                Search
              </button>
            </form>

            <form className="flex flex-row items-center gap-2">
              <div className="flex items-center gap-1">
                <label className="leading-tight">Date</label>
                <input
                  type="date"
                  className="bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]"
                />
              </div>
              <button className="bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]">
                Search
              </button>
            </form>
          </div>

          <table className="flex flex-col w-full gap-2">
            <thead className="flex w-full">
              <tr className="grid grid-cols-4 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]">
                <th>Donation Type</th>
                <th>Description</th>
                <th>Donated By</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody className="flex flex-col w-full overflow-y-scroll min-h-[550px]">
              {donations.length > 0 ? (
                donations.map((d) => (
                  <tr
                    key={d.donationId}
                    className="grid grid-cols-4 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]"
                  >
                    <td>
                      {Array.isArray(d.type) ? d.type.join(", ") : d.type}
                    </td>
                    <td>{d.description}</td>
                    <td>{d.name}</td>
                    <td>{d.date}</td>
                  </tr>
                ))
              ) : (
                <tr className="w-full text-center p-3">
                  <td colSpan="4">No donations found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Donation;
