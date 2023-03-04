import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ chartData }) {
  const [countArray, setCountArray] = useState([]);
  useEffect(() => {
    if (chartData) {
      let mp = new Map();
      console.log(chartData);
      chartData.map((data) => {
        let date = new Date(data.date).getMonth();
        if (mp.get(date)) {
          mp.set(date, mp.get(date) + 1);
        } else {
          mp.set(date, 1);
        }
      });
      let tmpArray = [];
      for (let [key, value] of mp.entries()) {
        tmpArray[key] = value;
      }
      setCountArray(tmpArray);
    }
  }, [chartData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: countArray,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Budget Trends",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Noverber",
  "December",
];
