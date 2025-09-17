import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/AdminSideBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCatProfile = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cats");

        console.log(response.data);
        setCats(response.data);
      } catch (err) {
        console.error("Error fetching cat:", err);
      }
    };
    fetchCat();
  }, []);

  return (
    <div className="flex flex-col -h-screen overflow-x-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="flex flex-col items-start p-10 h-screen gap-5 mx-auto">
          <div className="flex w-full items-center justify-start ">
            <label className="text-[24px] w-full text-[#2F2F2F] font-bold border-b-2 border-b-[#595959]">
              Cat Profiles
            </label>
          </div>

          <div className="flex flex-row items-center justify-between w-full gap-4">
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

            <div className="flex flex-row items-center gap-4">
              <Link
                to="/catprofilecreate"
                className="flex flex-row items-center justify-center gap-3 p-3 pl-6 pr-6 min-w-[225px] h-auto bg-[#B5C04A] text-[#FFF] rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]"
              >
                <div className="flex justify-center items-center w-[15px] h-auto">
                  <img src="/src/assets/icons/add-white.png" alt="" />
                </div>
                <label className="inline-block text-[#FFF]">
                  Create Cat Profile
                </label>
              </Link>
            </div>
          </div>

          {/* TABLE */}
          <table className="flex flex-col gap-2 w-full">
            <thead className="flex bg-[#DC8801] text-[#FFF] rounded-[10px]">
              <tr className="grid grid-cols-[10%_15%_15%_25%_25%_10%] place-items-start w-full p-3">
                <th>Cat ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Description</th>
                <th>Adoption Status</th>
              </tr>
            </thead>

            <tbody className="flex flex-col w-full overflow-y-scroll max-h-[550px] gap-1">
              {cats.map((cat) => (
                <tr
                  key={cat.cat_id}
                  className="grid grid-cols-[10%_15%_15%_25%_35%] place-items-center justify-items-start w-full p-3 bg-[#FFF] rounded-[15px] border-b-1 border-b-[#2F2F2F]"
                >
                  <td>{cat.cat_id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.gender}</td>
                  <td className="break-words break-all whitespace-normal pr-4">
                    {cat.description}
                  </td>
                  <td className="flex flex-row items-center justify-between w-full">
                    <label>{cat.adoption_status}</label>
                    <Link
                      to={`/catprofileproperty/${cat.cat_id}`}
                      className="p-2 pl-6 pr-6 w-auto h-auto bg-[#2F2F2F] text-[#FFF] rounded-[15px] cursor-pointer active:bg-[#595959]"
                    >
                      View
                    </Link>
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

export default AdminCatProfile;
