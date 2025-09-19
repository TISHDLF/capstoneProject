import React, { useState, useEffect } from "react";
import AdminSideBar from "../../../components/AdminSideBar";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import AssignNewAdmin from "./AssignNewAdmin";

export const AdminList = () => {
  const [assignVisible, setAssignVisible] = useState(false);
  const [updateRoleVisible, setUpdateRoleVisible] = useState(false);

  const [adminlist, setAdminlist] = useState([]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/manage/adminlist"
        );
        setAdminlist(response.data);

        console.log(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <div className="grid grid-cols-[20%_80%]">
        <AdminSideBar />
        <div className="relative flex flex-col items-center p-10 min-h-screen gap-10 mx-auto overflow-hidden">
          <div className="flex w-full items-center justify-between pb-2 border-b-1 border-b-[#2F2F2F]">
            <label className="text-[26px] font-bold text-[#2F2F2F]">
              Admin List
            </label>
            <Link
              to="/adminlist/assign"
              className="flex items-center bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer"
            >
              {" "}
              Assign New Admin
            </Link>
          </div>

          <table className="flex flex-col w-full gap-2">
            <thead className="flex w-full">
              <tr className="grid grid-cols-5 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]">
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full">
              {adminlist.map((admin) => (
                <tr
                  key={admin.user_id}
                  className="grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]"
                >
                  <td>{admin.user_id}</td>
                  <td>{`${admin.firstname} ${admin.lastname}`}</td>
                  <td>{admin.email}</td>
                  <td>{admin.last_login}</td>
                  <td>
                    <Link
                      to={`/adminlist/update/${admin.user_id}`}
                      className="bg-[#2F2F2F] text-[#FFF] font-bold p-1 pl-4 pr-4 rounded-[15px] cursor-disabled"
                    >
                      Update Role
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Displays the Assign new Admin window  */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminList;
