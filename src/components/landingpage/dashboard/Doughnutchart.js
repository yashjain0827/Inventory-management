import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({
  outOfStockCount,
  lowStockCount,
  allstockcount,
}) {
  const availableStock = allstockcount - outOfStockCount;
  const data = {
    labels: ["Out of Stock", "Low Stock", "Available Stock"],
    datasets: [
      {
        label: "Inventory Overview",
        data: [outOfStockCount, lowStockCount, availableStock],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
