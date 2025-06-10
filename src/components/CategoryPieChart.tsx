"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a2d2ff"];

export default function CategoryPieChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const all = await res.json();

      const grouped = all.reduce((acc: any, curr: any) => {
        acc[curr.category] =
          (acc[curr.category] || 0) + parseFloat(curr.amount);
        return acc;
      }, {});

      const formatted = Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));
      setData(formatted);
    };
    fetchData();
  }, [refresh]);

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-xl text-center font-semibold mb-4">
        Category-wise Pie Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
