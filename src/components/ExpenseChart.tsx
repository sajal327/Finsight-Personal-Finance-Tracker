"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

type Transaction = {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
};

function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "short", year: "2-digit" });
}

export default function ExpenseChart({ refresh }: { refresh: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, [refresh]);

  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month: formatMonth(month),
      amount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="bg-white/20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-blue-400 w-7 h-7" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Monthly Expenses
          </h2>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60">
            <Loader2 className="animate-spin w-8 h-8 text-blue-400 mb-2" />
            <span className="text-gray-500">Loading chart...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <BarChart3 className="w-10 h-10 text-gray-300 mb-2" />
            <span className="text-gray-500">No transactions to display.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 24, left: 8, bottom: 32 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ccc"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 14, fill: "#666" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 14, fill: "#666" }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 2px 16px #0001",
                  background: "#fff",
                  color: "#222",
                  fontSize: "1rem",
                }}
                formatter={(value: number) => [`₹${value}`, "Total"]}
              />
              <Bar
                dataKey="amount"
                fill="url(#gradientColor)"
                radius={[5, 5, 0, 0]}
              />
              <defs>
                <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1b85b3" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#9618b5" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
