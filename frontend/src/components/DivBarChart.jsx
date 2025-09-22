import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const DivBarChart = ({ labels, dataSet, colors, label }) => {
  // Map labels + dataSet + colors to Recharts format
  const data = labels.map((lbl, idx) => ({
    name: lbl,
    value: dataSet[idx] ?? 0,
    fill: colors[idx] ?? "#8884d8", // default color
  }));

  return (
    <div
      style={{
        width: "75%",
        height: 350,
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <h3>{label}</h3>
      <BarChart width={500} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Use a single Bar but assign fill per data point */}
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default DivBarChart;
