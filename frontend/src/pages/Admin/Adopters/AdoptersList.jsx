import React, { useState } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { Link } from "react-router-dom";

// TODO: Certicates: After approval -- option of admin/HV to attach/upload certicate of adopter
// After adoption -- Certificate will be picked up by adopter

const AdoptersList = () => {
  // FETCH DATA FROM HERE USING AXIOS
  // TO FETCH USER DATA : adoption_id, adopter_name, contactnumber, cat_adopted

  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="relative flex flex-col items-center p-10 h-screen w-full gap-5 mx-auto">
          <div className="flex flex-row justify-start w-full border-b-2 border-b-[#525252]">
            <label className="font-bold text-[24px]">Adopters</label>
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
                  name=""
                  id=""
                  className="bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]"
                />
              </div>
              <button className="bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]">
                Search
              </button>
            </form>
          </div>

          {/* CERTIFICATE */}

          <table className="flex flex-col w-full gap-2">
            <thead className="flex w-full">
              <tr className="grid grid-cols-6 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]">
                <th>Adoption ID</th>
                <th>Name</th>
                <th>Date of Adoption</th>
                <th>Contact Number</th>
                <th>Adopted Cat</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full overflow-y-scroll max-h-[550px] gap-1">
              <tr className="grid grid-cols-6 w-full place-items-center justify-items-start bg-[#FFF] p-2 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]">
                <td>01</td>
                <td>Angelo Cabangal</td>
                <td>01/10/2025</td>
                <td>09084853419</td>
                <td className="flex flex-row items-center justify-between gap-3 w-full">
                  Bob
                </td>
                <td>
                  {/* Click to open certificate file on new tab: PDF FORMAT */}
                  <a
                    href="/src/assets/UserProfile/(01 Laboratory Exercise 1 - ARG) Angelo Cabangal - Game Development.pdf"
                    target="_blank"
                    className="flex items-center justify-between self-start gap-3 p-2 pl-4 pr-4 bg-[#FDF5D8] text-[#2F2F2F] rounded-[10px] hover:underline border-dashed border-2 border-[#595959]"
                  >
                    View Certificate
                    <div className="w-[25px] h-auto">
                      <img src="/src/assets/icons/document-black.png" alt="" />
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdoptersList;
