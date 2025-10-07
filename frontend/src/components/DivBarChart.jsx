import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DivBarChart = ({ labels, dataSet, colors, label }) => {
  const data = labels.map((lbl, idx) => ({
    name: lbl,
    value: dataSet[idx] ?? 0,
    fill: colors[idx] ?? "#8884d8",
  }));

  return (
    <div className="w-full md:w-[75%] h-auto md:h-[350px] p-3 md:p-5 bg-white rounded-lg shadow-md">
      <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-4 text-gray-800 text-center md:text-left">
        {label}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 25,
          }}
          barSize={window.innerWidth < 768 ? 25 : 40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
            angle={window.innerWidth < 768 ? -30 : 0}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: window.innerWidth < 768 ? 10 : 12,
            }}
            iconType="circle"
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DivBarChart;
