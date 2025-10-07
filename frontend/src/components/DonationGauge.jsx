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

  // Define size configurations - now responsive
  const sizeConfig = {
    small: {
      inner: { mobile: 30, desktop: 40 },
      outer: { mobile: 45, desktop: 55 },
      container: "w-full sm:w-48 h-32 sm:h-36",
    },
    medium: {
      inner: { mobile: 50, desktop: 70 },
      outer: { mobile: 75, desktop: 100 },
      container: "w-full sm:w-64 h-40 sm:h-48",
    },
    large: {
      inner: { mobile: 70, desktop: 90 },
      outer: { mobile: 95, desktop: 120 },
      container: "w-full sm:w-80 h-52 sm:h-60",
    },
    xl: {
      inner: { mobile: 80, desktop: 110 },
      outer: { mobile: 105, desktop: 140 },
      container: "w-full sm:w-96 h-60 sm:h-72",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Determine if mobile based on window width (using media query logic)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px = sm breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const innerRadius = isMobile ? config.inner.mobile : config.inner.desktop;
  const outerRadius = isMobile ? config.outer.mobile : config.outer.desktop;

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

  // Custom label to show the amount in center - responsive text
  const renderCustomLabel = () => {
    const fontSize = isMobile ? 20 : 28;
    const titleSize = isMobile ? 10 : 12;
    const subtitleSize = isMobile ? 8 : 10;

    return (
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-800"
      >
        <tspan x="50%" dy="50" fontSize={fontSize} fontWeight="bold">
          {currency}
          {currentAmount.toLocaleString()}
        </tspan>
        <tspan
          x="50%"
          dy={isMobile ? 40 : 55}
          fontSize={titleSize}
          className="fill-gray-600"
        >
          {title}
        </tspan>
        <tspan
          x="50%"
          dy="15"
          fontSize={subtitleSize}
          className="fill-gray-500"
        >
          {subtitle}
        </tspan>
      </text>
    );
  };

  return (
    <div
      className={`${config.container} bg-white rounded-lg shadow-sm p-3 sm:p-4 flex items-end justify-center`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%" // Position lower to create semicircle effect
            startAngle={180} // Start from left
            endAngle={0} // End at right (creates semicircle)
            innerRadius={innerRadius}
            outerRadius={outerRadius}
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
