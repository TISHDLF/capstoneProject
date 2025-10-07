import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import SideNavigation from "../../components/HeadVolunteerSideBar";
import Footer from "../../components/Footer";
import CatBot from "../../components/CatBot";
import { useSession } from "../../context/SessionContext";

const HeadVolunteerMainPage = () => {
  const [selectedProof, setSelectedProof] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (proofUrl) => {
    setSelectedProof(proofUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProof(null);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { user, loading } = useSession();
  const itemsPerPage = 9;
  const totalPages = Math.ceil(apps.length / itemsPerPage);
  const [rejectModal, setRejectModal] = useState({
    open: false,
    donationId: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async (donationId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/donate/api/donations/${donationId}/approve`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      setApps((prev) =>
        prev.map((app) =>
          app.donationId === donationId ? { ...app, status: "Approved" } : app
        )
      );
    } catch (err) {
      console.error("❌ Approval error:", err.response?.data || err.message);
      alert("Failed to approve donation");
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/donate/api/donations/${rejectModal.donationId}/reject`,
        { reason: rejectReason },
        { withCredentials: true }
      );
      alert(res.data.message);
      setApps((prev) =>
        prev.map((app) =>
          app.donationId === rejectModal.donationId
            ? { ...app, status: "Rejected" }
            : app
        )
      );
      setRejectModal({ open: false, donationId: null });
      setRejectReason("");
    } catch (err) {
      console.error("❌ Rejection error:", err.response?.data || err.message);
      alert("Failed to reject donation");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "head_volunteer") {
        navigate("/");
        return;
      }

      const fetchUserAndDonations = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/donate/api/donations",
            { withCredentials: true }
          );

          const data = Array.isArray(response.data)
            ? response.data
            : response.data.donations || [];

          setApps(data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch data");
        }
      };

      fetchUserAndDonations();
    }
  }, [user, loading, navigate]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

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
    <div>
      <div className="flex flex-col min-h-screen md:pb-10 pb-24">
        <CatBot />
        <NavigationBar />
        <div className="md:grid md:grid-cols-[80%_20%] h-full pb-30 pt-10">
          <div className="p-4 md:p-10">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentApps.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  No donations found.
                </div>
              ) : (
                currentApps.map((app) => (
                  <div
                    key={app.donationId}
                    className="bg-white rounded-lg shadow-lg p-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#DC8801]">
                          #{app.donationId}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            app.status === "Approved"
                              ? "bg-blue-100 text-blue-600"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p>
                          <span className="font-semibold">User ID:</span>{" "}
                          {app.userId}
                        </p>
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {app.name}
                        </p>
                        <p>
                          <span className="font-semibold">Type:</span>{" "}
                          {Array.isArray(app.type)
                            ? app.type.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold mr-1 px-2 py-0.5 rounded"
                                >
                                  {t}
                                </span>
                              ))
                            : app.type}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {app.date}
                        </p>
                      </div>
                      {app.proofUrl && (
                        <button
                          onClick={() => openModal(app.proofUrl)}
                          className="w-full bg-[#DC8801] text-white px-4 py-2 rounded-lg hover:bg-[#ffb030] active:bg-[#DC8801] font-bold shadow text-sm"
                        >
                          View Proof
                        </button>
                      )}
                      {app.userId !== user.user_id && (
                        <div className="flex gap-2 pt-2">
                          {app.status === "Approved" ||
                          app.status === "Rejected" ? (
                            <button className="flex-1 px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 text-sm">
                              View
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(app.donationId)}
                                className="flex-1 px-4 py-2 rounded-lg text-white bg-lime-500 hover:bg-lime-600 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  setRejectModal({
                                    open: true,
                                    donationId: app.donationId,
                                  })
                                }
                                className="flex-1 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg bg-white h-200">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#DC8801] text-white text-sm">
                    <th className="px-6 py-3">Application No.</th>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date Submitted</th>
                    <th className="px-6 py-3">Proof of Payment</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {currentApps.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-3 text-center">
                        No donations found.
                      </td>
                    </tr>
                  ) : (
                    currentApps.map((app) => (
                      <tr
                        key={app.donationId}
                        className="border-b border-[#DC8801]"
                      >
                        <td className="px-6 py-3">{app.donationId}</td>
                        <td className="px-6 py-3">{app.userId}</td>
                        <td className="px-6 py-3">{app.name}</td>
                        <td className="px-6 py-3">
                          {Array.isArray(app.type)
                            ? app.type.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {t}
                                </span>
                              ))
                            : app.type}
                        </td>
                        <td className="px-6 py-3">{app.date}</td>
                        <td className="px-6 py-3 text-center">
                          {app.proofUrl ? (
                            <button
                              onClick={() => openModal(app.proofUrl)}
                              className="bg-[#DC8801] text-white px-4 py-2 rounded-lg hover:bg-[#ffb030] active:bg-[#DC8801] font-bold shadow"
                            >
                              View Proof
                            </button>
                          ) : (
                            <span className="text-gray-400">No Proof</span>
                          )}
                        </td>
                        <td className="px-6 py-3 flex items-center gap-2">
                          {app.userId !== user.user_id ? (
                            app.status === "Approved" ||
                            app.status === "Rejected" ? (
                              <button className="px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                                View
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleApprove(app.donationId)}
                                  className="px-4 py-1 rounded-lg text-white bg-lime-500 hover:bg-lime-600"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectModal({
                                      open: true,
                                      donationId: app.donationId,
                                    })
                                  }
                                  className="px-4 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </>
                            )
                          ) : (
                            <span className="text-gray-500 italic">
                              Own Donation
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Proof Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-4 md:p-6 relative h-auto z-50 max-h-[90vh] overflow-auto">
                    <button
                      onClick={closeModal}
                      className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                    >
                      ✖
                    </button>
                    <h2 className="text-base md:text-lg font-bold mb-4 text-[#DC8801]">
                      Proof of Payment
                    </h2>
                    <img
                      src={selectedProof}
                      alt="Proof of Payment"
                      className="w-full max-h-[70vh] object-contain rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* Reject Modal */}
              {rejectModal.open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md relative">
                    <h2 className="text-base md:text-lg font-bold mb-4 text-red-600">
                      Reject Donation
                    </h2>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter rejection reason (optional)"
                      className="w-full border rounded p-2 mb-4 text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setRejectModal({ open: false, donationId: null })
                        }
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default HeadVolunteerMainPage;
