import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportsContainer = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/report/feeding/reports",
          {
            withCredentials: true,
          }
        );
        setReports(res.data);
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="w-full px-4 md:px-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
        Volunteer Reports
      </h2>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <p className="p-5 text-center">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="p-5 text-center">No reports found.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-6 py-3">Report ID</th>
                    <th className="px-6 py-3">Volunteer</th>
                    <th className="px-6 py-3">Report</th>
                    <th className="px-6 py-3">Feeding Date</th>
                    <th className="px-6 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.report_id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{r.report_id}</td>
                      <td className="px-6 py-3">{r.volunteer_name}</td>
                      <td className="px-6 py-3">{r.feeders_report}</td>
                      <td className="px-6 py-3">
                        {new Date(r.feeding_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y">
              {reports.map((r) => (
                <div key={r.report_id} className="p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Volunteer:</span>{" "}
                    {r.volunteer_name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Report:</span>{" "}
                    {r.feeders_report}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Feeding Date:</span>{" "}
                    {new Date(r.feeding_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Submitted:</span>{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsContainer;
