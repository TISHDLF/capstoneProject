import React from "react";

const ReportsContainer = ({ totalAmount }) => {
  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-10 pb-10 text-center">
        Volunteer Reports
      </h2>

      <div className="p-10">
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white h-200">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className=" text-sm ">
                <th className="px-6 py-3">Feeder ID</th>
                <th className="px-6 py-3">Report</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>asdasda</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsContainer;
