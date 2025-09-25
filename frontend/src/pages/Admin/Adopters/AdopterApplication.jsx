import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../../../context/SessionContext";
import axios from "axios"; // ✅ import axios

const AdopterApplication = () => {
  const { user, loading } = useSession();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/");
        return;
      }

      const fetchAdoptions = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/adopt/api/adoption",
            { withCredentials: true }
          );
          setApps(response.data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      };

      fetchAdoptions();
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
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="flex flex-col items-center p-10 h-screen gap-5 mx-auto">
          <div className="flex flex-row justify-start w-full border-b-2 border-b-[#525252]">
            <label className="font-bold text-[24px]">
              Adoption Application
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

          {/* Application List */}
          <table className="flex flex-col w-full gap-2">
            <thead className="flex w-full">
              <tr className="grid grid-cols-6 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]">
                <th>Application No.</th>
                <th>Applicant Name</th>
                <th>Cat Name</th>
                <th>Date Applied</th>
                <th>Application Form</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full overflow-y-scroll min-h-[550px]">
              {apps.length > 0 ? (
                apps.map((app) => (
                  <tr
                    key={app.applicationNo}
                    className="grid grid-cols-6 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]"
                  >
                    <td>{app.applicationNo}</td>
                    <td>{app.name}</td>
                    <td>{app.catName}</td>
                    <td>{app.date || "N/A"}</td>
                    <td>
                      <Link
                        to={`/adopterapplication/${app.applicationNo}/view`}
                        className="flex items-center gap-4 text-[#DC8801] underline font-bold hover:text-[#977655] active:text-[#DC8801]"
                      >
                        View Application
                      </Link>
                    </td>
                    <td
                      className={`p-2 pl-4 pr-4 rounded-[10px] font-bold text-white ${
                        app.status === "Approved"
                          ? "bg-green-500"
                          : app.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-[#B5C04A]"
                      }`}
                    >
                      {app.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full text-center p-4">
                  <td colSpan="6">No adoption applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdopterApplication;
