import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/HeadVolunteerSideBar";
import Footer from "../../components/Footer";
import { useSession } from "../../context/SessionContext";

const AdoptionApplications = () => {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(apps.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "head_volunteer") {
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

  const handleViewPDF = async (adoptionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/adopt/api/adoption/${adoptionId}/pdf`,
        { responseType: "blob" }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (err) {
      alert("Failed to fetch PDF");
      console.error(err);
    }
  };

  const handleProcess = async (adoptionId) => {
    try {
      await axios.post(
        `http://localhost:5000/adopt/api/adoption/${adoptionId}/approve`,
        {},
        { withCredentials: true }
      );
      setApps((prev) =>
        prev.map((app) =>
          app.applicationNo === adoptionId
            ? { ...app, status: "Approved" }
            : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to process application");
    }
  };

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
    <div className="flex flex-col min-h-screen md:pb-10 pb-24">
      <NavigationBar />
      <div className="md:grid md:grid-cols-[80%_20%] h-full pb-30 pt-10">
        <div className="p-4 md:p-10">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {currentApps.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                No adoption applications found.
              </div>
            ) : (
              currentApps.map((app) => (
                <div
                  key={app.applicationNo}
                  className="bg-white rounded-lg shadow-lg p-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#DC8801]">
                        #{app.applicationNo}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.status === "Approved"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p>
                        <span className="font-semibold">User ID:</span>{" "}
                        {app.user_id}
                      </p>
                      <p>
                        <span className="font-semibold">Name:</span> {app.name}
                      </p>
                      <p>
                        <span className="font-semibold">Cat:</span> {app.type}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span> {app.date}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleViewPDF(app.applicationNo)}
                        className="flex-1 px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 text-sm"
                      >
                        View PDF
                      </button>
                      {app.user_id !== user.user_id && (
                        <button
                          onClick={() => handleProcess(app.applicationNo)}
                          className="flex-1 px-4 py-2 rounded-lg text-white bg-lime-500 hover:bg-lime-600 text-sm"
                        >
                          Process
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg bg-white h-250">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#DC8801] text-white text-sm">
                  <th className="px-6 py-3">Adoption No.</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Cat Name</th>
                  <th className="px-6 py-3">Date Submitted</th>
                  <th className="px-6 py-3">Form</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-3 text-center">
                      No adoption applications found.
                    </td>
                  </tr>
                ) : (
                  currentApps.map((app) => (
                    <tr
                      key={app.applicationNo}
                      className="border-b border-[#DC8801]"
                    >
                      <td className="px-6 py-3">{app.applicationNo}</td>
                      <td className="px-6 py-3">{app.user_id}</td>
                      <td className="px-6 py-3">{app.name}</td>
                      <td className="px-6 py-3">{app.type}</td>
                      <td className="px-6 py-3">{app.date}</td>
                      <td className="px-6 py-3 flex items-center gap-2">
                        <button
                          onClick={() => handleViewPDF(app.applicationNo)}
                          className="px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                        >
                          View PDF
                        </button>
                      </td>
                      <td className="px-6 py-3 ">
                        <span
                          className={
                            app.status === "Approved"
                              ? "text-blue-600 font-semibold pr-4"
                              : "text-red-600 font-semibold pr-4"
                          }
                        >
                          {app.status}
                        </span>
                        {app.user_id !== user.user_id ? (
                          <button
                            onClick={() => handleProcess(app.applicationNo)}
                            className="px-4 py-1 rounded-lg text-white bg-lime-500 hover:bg-lime-600"
                          >
                            Process
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 md:px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 md:px-4 py-2 rounded text-sm ${
                  page === i + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 md:px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-screen">
          <SideNavigation />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptionApplications;
