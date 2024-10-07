import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ todaysSales, allstock }) {
  function extractProductSales(salesData) {
    const productSales = new Map();

    salesData.forEach((sale) => {
      sale.products.forEach((product) => {
        const { productName, quantity } = product;
        if (productSales.has(productName)) {
          productSales.set(
            productName,
            productSales.get(productName) + quantity
          );
        } else {
          productSales.set(productName, quantity);
        }
      });
    });

    return productSales;
  }

  function extractProductStock(stockData) {
    const productStock = new Map();

    stockData.forEach((stockItem) => {
      const { productName, quantity } = stockItem;
      productStock.set(productName, quantity);
    });

    return productStock;
  }

  const productSales = extractProductSales(todaysSales);
  const productStock = extractProductStock(allstock);

  // Filter out products that have no sales
  const productNames = Array.from(productSales.keys());
  const quantitiesSold = productNames.map(
    (name) => productSales.get(name) || 0
  );
  const quantitiesLeft = productNames.map(
    (name) => productStock.get(name) || 0
  );

  const backgroundColorgenerator = (length) => {
    const backgroundColor = [];

    for (let index = 0; index < length; index++) {
      const randomColor = Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
      backgroundColor[index] = `#${randomColor}`;
    }
    return backgroundColor;
  };

  const backgroundColor = backgroundColorgenerator(productNames.length);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Sales",
        data: quantitiesSold,
        backgroundColor: "blue",
      },
      {
        label: "Stock Left",
        data: quantitiesLeft,
        backgroundColor: quantitiesLeft.map((quantity) =>
          quantity === 0 ? "gray" : "red"
        ),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales and Stock Quantity by Product",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
