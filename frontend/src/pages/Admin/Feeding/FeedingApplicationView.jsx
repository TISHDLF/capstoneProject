import React from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const FeedingApplicationView = () => {
  const { application_id } = useParams();

  const [applicant, setApplicant] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/form/${application_id}`
        );
        console.log(response.data);
        setApplicant(response.data);
      } catch (err) {
        console.error(
          "Error fetching user:",
          err.response?.data || err.message
        );
      }
    };

    fetchApplications();
  }, []);

  console.log("Application form: ", applicant.application_form);
  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden ">
      <div className="grid grid-cols-[20%_80%] overflow-x-hidden">
        <AdminSideBar />
        <div className="flex flex-col p-10 min-h-screen w-full gap-4 mx-auto overflow-hidden">
          <div className="flex w-full justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
            <label className="text-[24px] font-bold text-[#2F2F2F]">
              Feeding Application Form
            </label>
            <Link
              to="/feedingapplications"
              className="flex items-center bg-[#2F2F2F] p-1 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px]"
            >
              {" "}
              Go Back
            </Link>
          </div>

          {applicant && (
            <div className="flex flex-col p-5 bg-[#FFF] h-auto w-full rounded-[10px] gap-2">
              <div className="flex items-center justify-between border-b-1 border-b-[#595959] shadow-md pb-3">
                <div className="flex justify-start items-center gap-10">
                  <div className="flex flex-col justify-start">
                    <label className="text-[#595959] text-[14px]">
                      Application No.:
                    </label>
                    <label className="text-[#2F2F2F] text-[18px] font-bold">
                      {applicant.application_id}
                    </label>
                  </div>
                  <div className="flex flex-col justify-start">
                    <label className="text-[#595959] text-[14px]">
                      Name of Applicant:
                    </label>
                    <label className="text-[#2F2F2F] text-[18px] font-bold">{`${applicant.firstname} ${applicant.lastname}`}</label>
                  </div>
                  <div className="flex flex-col justify-start">
                    <label className="text-[#595959] text-[14px]">
                      Date of Application:
                    </label>
                    <label className="text-[#2F2F2F] text-[18px] font-bold">
                      {applicant.date_applied}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <button className="bg-[#B5C04A] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#E3E697] active:text-[#2F2F2F]">
                    Accept
                  </button>
                  <button className="bg-[#DC8801] text-[#FFF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer active:bg-[#977655]">
                    Reject
                  </button>
                </div>
              </div>

              {/* <object data={`http://localhost:5000/FileUploads/${applicant.application_form}`} type="application/pdf" width="100%" height="600">
                                alt : <a href={`http://localhost:5000/FileUploads/${applicant.application_form}`}>test.pdf</a>
                            </object> */}

              {applicant.application_form && (
                <object
                  data={`http://localhost:5000/FileUploads/${applicant.application_form}`}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                >
                  <p>
                    Your browser does not support embedded PDFs.
                    <a
                      href={`http://localhost:5000/FileUploads/${applicant.application_form}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to download the PDF.
                    </a>
                  </p>
                </object>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedingApplicationView;
