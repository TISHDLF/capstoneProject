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
    <div>
      <h2 className="text-2xl font-semibold mb-10 pb-10 text-center">
        Volunteer Reports
      </h2>

      <div className="p-10">
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white h-200">
          {loading ? (
            <p className="p-5 text-center">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="p-5 text-center">No reports found.</p>
          ) : (
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-sm bg-gray-100">
                  <th className="px-6 py-3">Report ID</th>
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Report</th>
                  <th className="px-6 py-3">Feeding Date</th>
                  <th className="px-6 py-3">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.report_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-3">{report.report_id}</td>
                    <td className="px-6 py-3">{report.volunteer_name}</td>
                    <td className="px-6 py-3">{report.feeders_report}</td>
                    <td className="px-6 py-3">
                      {new Date(report.feeding_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(report.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsContainer;
