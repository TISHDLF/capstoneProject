import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import axios from "axios";

const AdoptersList = () => {
  const [adoptions, setAdoptions] = useState([]);
  const handleFileUpload = async (adoptionId, file) => {
    try {
      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("adoption_id", adoptionId);

      const response = await axios.post(
        "http://localhost:5000/admin/adoptions/upload-certificate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Certificate uploaded!");
    } catch (err) {
      console.error("Error uploading certificate:", err);
    }
  };

  useEffect(() => {
    const fetchApprovedAdoptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/approved"
        );

        setAdoptions(response.data);
      } catch (err) {
        console.error("Error fetching approved adoptions:", err);
      }
    };

    fetchApprovedAdoptions();
  }, []);

  const sendEmail = async (adoption) => {
    if (!adoption.certificate) {
      alert("Please upload the certificate before sending email.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/admin/adoptions/send-email", {
        email: adoption.email,
        adopter: adoption.adopter,
        catName: adoption.cat_name,
        adoptionDate: adoption.adoption_date,
        certificate: adoption.certificate,
      });
      alert("Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="relative flex flex-col items-center p-10 h-screen w-full gap-5 mx-auto">
          <div className="flex flex-row justify-start w-full border-b-2 border-b-[#525252]">
            <label className="font-bold text-[24px]">Adopters</label>
          </div>

          <table className="flex flex-col w-full gap-2">
            <thead className="flex w-full">
              <tr className="grid grid-cols-7 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]">
                <th>Adoption ID</th>
                <th>Name</th>
                <th>Date of Adoption</th>
                <th>Contact Number</th>
                <th>Adopted Cat</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full overflow-y-scroll max-h-[550px] gap-1">
              {adoptions.map((adoption) => (
                <tr
                  key={adoption.adoption_id}
                  className="grid grid-cols-7 w-full place-items-center justify-items-start bg-[#FFF] p-2 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]"
                >
                  <td>{adoption.adoption_id}</td>
                  <td>{adoption.adopter}</td>
                  <td>
                    {new Date(adoption.adoption_date).toLocaleDateString()}
                  </td>
                  <td>{adoption.contactnumber}</td>
                  <td>{adoption.cat_name}</td>
                  <td>
                    {adoption.certificate ? (
                      <a
                        href={`http://localhost:5000/FileUploads/certificates/${adoption.certificate}`}
                        target="_blank"
                        className="flex items-center gap-2 p-2 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]"
                      >
                        View Certificate
                      </a>
                    ) : (
                      <label className="flex items-center gap-2 p-2 pl-4 pr-4 bg-[#F0F0F0] text-[#2F2F2F] rounded-[10px] cursor-pointer border-dashed border-2 border-[#595959]">
                        Attach Certificate
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("certificate", file);
                            formData.append(
                              "adoption_id",
                              adoption.adoption_id
                            );

                            try {
                              const response = await axios.post(
                                `http://localhost:5000/admin/adoptions/upload-certificate`,
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                }
                              );

                              // Update local state instead of reloading
                              setAdoptions((prev) =>
                                prev.map((a) =>
                                  a.adoption_id === adoption.adoption_id
                                    ? { ...a, certificate: file.name } // use file.name or response.file if returned
                                    : a
                                )
                              );

                              alert("Certificate uploaded successfully!");
                            } catch (err) {
                              console.error(
                                "Error uploading certificate:",
                                err
                              );
                              alert("Failed to upload certificate.");
                            }
                          }}
                        />
                      </label>
                    )}
                  </td>

                  <td>
                    <button
                      className="bg-[#DC8801] p-2 text-white rounded-[10px] hover:bg-[#b56a00]"
                      onClick={() => sendEmail(adoption)}
                    >
                      Send Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdoptersList;
