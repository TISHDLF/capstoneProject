import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdopterApplicationView = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/adopt/api/adoption/${applicationId}`,
          { withCredentials: true }
        );
        setApplication(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load application");
      }
    };

    fetchApplication();
  }, [applicationId]);
  //accept
  const handleAcceptStatus = async () => {
    try {
      await axios.post(
        `http://localhost:5000/adopt/api/adoption/${applicationId}/approve`
      );
      alert(`Application Approved successfully!`);
      navigate("/adopterapplication");
    } catch (err) {
      console.error("Failed to approve adoption", err);
      alert("Error approving adoption.");
    }
  };

  // Handle reject
  const handleUpdateStatus = async (status) => {
    try {
      await axios.post(
        `http://localhost:5000/adopt/api/adoption/${applicationId}/reject`,
        { status }
      );
      alert(`Application ${status} successfully!`);
      navigate("/adopterapplication");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status.");
    }
  };

  if (!application) {
    return <div className="p-10">Loading application...</div>;
  }

  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <div className="grid grid-cols-[20%_80%] overflow-x-hidden">
        <AdminSideBar />
        <div className="flex flex-col p-10 min-h-screen w-full gap-4 mx-auto overflow-hidden">
          <div className="flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
            <label className="text-[24px] font-bold text-[#2F2F2F]">
              Adoption Application Form
            </label>
            <Link
              to="/adopterapplication"
              className="flex items-center bg-[#2F2F2F] p-1 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px]"
            >
              Go Back
            </Link>
          </div>

          <div className="flex flex-col p-5 bg-[#FFF] h-auto w-full rounded-[10px] gap-2">
            {/* Header info */}
            <div className="flex items-center justify-between border-b-1 border-b-[#595959] shadow-md pb-3">
              <div className="flex justify-start items-center gap-10">
                <div className="flex flex-col">
                  <label className="text-[#595959] text-[14px]">
                    Application No.:
                  </label>
                  <label className="text-[#2F2F2F] text-[18px] font-bold">
                    {application.applicationNo}
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-[#595959] text-[14px]">
                    Name of Applicant:
                  </label>
                  <label className="text-[#2F2F2F] text-[18px] font-bold">
                    {application.name}
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-[#595959] text-[14px]">User ID:</label>
                  <label className="text-[#2F2F2F] text-[18px] font-bold">
                    {application.user_id}
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-[#595959] text-[14px]">
                    Date of Application:
                  </label>
                  <label className="text-[#2F2F2F] text-[18px] font-bold">
                    {application.date}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleAcceptStatus("Accepted")}
                  className="bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus("Rejected")}
                  className="bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Application PDF */}
            <object
              data={`http://localhost:5000/adopt/api/adoption/${applicationId}/pdf`}
              type="application/pdf"
              width="100%"
              height="600"
            >
              <a
                href={`http://localhost:5000/adopt/api/adoption/${applicationId}/pdf`}
              >
                Download PDF
              </a>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdopterApplicationView;
