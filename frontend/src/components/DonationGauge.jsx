import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonationGauge = ({
  currentAmount = 7542,
  targetAmount = 10000,
  currency = "₱",
  title = "Donation money raised",
  subtitle = "Last Check on 27 Apr",
  size = "xl", // Add size prop: "small", "medium", "large", "xl"
}) => {
  // Calculate percentage
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);

  // Define size configurations
  const sizeConfig = {
    small: { inner: 40, outer: 55, container: "w-48 h-36" },
    medium: { inner: 70, outer: 100, container: "w-64 h-48" },
    large: { inner: 90, outer: 120, container: "w-80 h-60" },
    xl: { inner: 110, outer: 140, container: "w-96 h-72" },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Create data for the gauge
  const data = [
    { name: "completed", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  // Colors for the gauge
  const COLORS = {
    completed: "#FF8C00", // Orange
    remaining: "#E5E5E5", // Light gray
  };

  // Custom label to show the amount in center
  const renderCustomLabel = () => {
    return (
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-800"
      >
        <tspan x="50%" dy="50" fontSize="28" fontWeight="bold">
          {currency}
          {currentAmount.toLocaleString()}
        </tspan>
        <tspan x="50%" dy="55" fontSize="12" className="fill-gray-600">
          {title}
        </tspan>
        <tspan x="50%" dy="15" fontSize="10" className="fill-gray-500">
          {subtitle}
        </tspan>
      </text>
    );
  };

  return (
    <div
      className={`${config.container} bg-white rounded-lg shadow-sm p-4 w-100 h-80 flex align-end`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%" // Position lower to create semicircle effect
            startAngle={180} // Start from left
            endAngle={0} // End at right (creates semicircle)
            innerRadius={config.inner}
            outerRadius={config.outer}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name === "completed"
                    ? COLORS.completed
                    : COLORS.remaining
                }
                stroke="none"
              />
            ))}
          </Pie>
          {renderCustomLabel()}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default DonationGauge;
