"use client";

import { useEffect, useState } from "react";
import CategoryPieChart from "@/components/CategoryPieChart";
import ExpenseChart from "@/components/ExpenseChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react";

const categoryColors: { [key: string]: string } = {
  Food: "#e86d25",
  Rent: "#e8aa25",
  Travel: "#118c2c",
  Entertainment: "#d14532",
  Others: "#293241",
};

const budgets: { [key: string]: number } = {
  Food: 5000,
  Rent: 10000,
  Travel: 3000,
  Entertainment: 2000,
  Others: 1000,
};

export default function DashboardStats({ refresh }: { refresh: boolean }) {
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {}
  );
  const [insights, setInsights] = useState<{
    topCategory: string;
    overBudget: string[];
  }>({
    topCategory: "",
    overBudget: [],
  });

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     const res = await fetch("/api/transactions");
  //     const data = await res.json();

  //     const now = new Date();
  //     const monthly = data.filter((t: any) => {
  //       const date = new Date(t.date);
  //       return (
  //         date.getMonth() === now.getMonth() &&
  //         date.getFullYear() === now.getFullYear()
  //       );
  //     });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      console.log("Fetched data:", data);

      const transactions = Array.isArray(data)
        ? data
        : Array.isArray(data.transactions)
        ? data.transactions
        : [];

      const now = new Date();
      const monthly = transactions.filter((t: any) => {
        const date = new Date(t.date);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });

      const sum = monthly.reduce(
        (acc: number, curr: any) => acc + parseFloat(curr.amount),
        0
      );
      setTotal(sum);

      const grouped: { [key: string]: number } = {};
      monthly.forEach((t: any) => {
        if (!grouped[t.category]) grouped[t.category] = 0;
        grouped[t.category] += parseFloat(t.amount);
      });

      const chartData = Object.entries(grouped).map(([cat, amt]) => ({
        category: cat,
        actual: amt,
        budget: budgets[cat] || 0,
      }));

      setCategoryData(chartData);

      const top = chartData.reduce(
        (max, curr) => (curr.actual > max.actual ? curr : max),
        { category: "", actual: 0, budget: 0 }
      );

      const overBudget = chartData
        .filter((c) => c.actual > c.budget)
        .map((c) => c.category);

      setInsights({ topCategory: top.category, overBudget });

      // const sorted = [...data].sort(
      //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      // );
      // setRecentTransactions(sorted.slice(0, 5));
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentTransactions(sorted.slice(0, 5));

      const categories: Record<string, number> = {};
      monthly.forEach((t: any) => {
        if (!categories[t.category]) categories[t.category] = 0;
        categories[t.category] += parseFloat(t.amount);
      });
      setCategoryTotals(categories);
    };

    fetchStats();
  }, [refresh]);

  return (
    <div
      className="space-y-8 max-w-5xl mx-auto my-8 px-2"
      style={{ background: "#e0fbfc" }}
    >
      <h2 className="text-2xl md:text-4xl  font-bold text-center text-[#096886] tracking-tight md:pt-6 pt-4 ">
        Dashboard
      </h2>

      {/* Total Expenses Card */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border border-[#98c1d9]">
          <span className="uppercase text-lg tracking-widest text-[#3d5a80] mb-2">
            Total monthly expenses
          </span>
          <span className="text-3xl font-extrabold text-[#ee6c4d] mb-1">
            ₹{total.toFixed(2)}
          </span>
        </div>
        <div className="flex-1">
          <CategoryPieChart refresh={refresh} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-[#98c1d9]">
        <h3 className="text-lg font-bold mb-4 text-[#096886] flex items-center gap-2">
          {/* <TrendingUp className="text-[#3d5a80]" /> Category-wise Breakdown */}
          Category-wise Breakdown
        </h3>
        <ul className="divide-y divide-[#e0fbfc]">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <li key={cat} className="flex justify-between py-2 items-center">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: categoryColors[cat] || "#e0fbfc" }}
                />
                <span className="font-medium">{cat}</span>
              </span>
              <span className="font-semibold text-[#3d5a80]">
                ₹{amt.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-[#98c1d9]">
        <h3 className="text-lg font-bold mb-4 text-[#096886] flex items-center gap-2">
          Recent Transactions
        </h3>
        <ul className="space-y-3">
          {recentTransactions.map((t, idx) => (
            <li
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-[#d9dddd] to-[#dee3e3] border border-[#e0fbfc] rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{
                    background: categoryColors[t.category] || "#e0fbfc",
                  }}
                />
                <span className="font-semibold text-[#293241]">
                  {t.category}
                </span>
              </div>
              <div className="text-sm text-center italic text-[#3d5a80] mt-1 md:mt-0">
                {t.description}
              </div>
              <div className="flex flex-col md:items-end">
                <span className="font-bold text-[#f7642a] text-lg">
                  ₹{parseFloat(t.amount).toFixed(2)}
                </span>
                <span className="text-xs text-[#3d5a80]">
                  {new Date(t.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Budget vs Actual Bar Chart */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-[#98c1d9]">
        <h3 className="text-lg font-semibold mb-4 text-[#07607b] flex items-center gap-2">
          <BarChart className="text-[#3d5a80]" /> Budget vs Actual (per
          Category)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={categoryData}
            margin={{ top: 16, right: 24, left: 8, bottom: 32 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#98c1d9"
            />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 14, fill: "#3d5a80" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 14, fill: "#293241" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              cursor={{ fill: "#e0fbfc" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 16px #0001",
                background: "#fff",
                color: "#222",
                fontSize: "1rem",
              }}
              formatter={(value: number) => [`₹${value}`, "Amount"]}
            />
            <Legend />
            <Bar
              dataKey="budget"
              fill="#43aade"
              name="Budget"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="actual"
              name="Actual"
              radius={[6, 6, 0, 0]}
              fill="#ee6c4d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-[#98c1d9]">
        <h3 className="text-lg font-semibold mb-4 text-[#07607b] flex items-center gap-2">
          {/* <AlertTriangle className="text-[#ef233c]" /> Spending Insights */}
          Spending Insights
        </h3>
        {insights.overBudget.length > 0 && (
          <p className="text-[#ef233c] font-semibold mb-2">
            Over budget in: {insights.overBudget.join(", ")}
          </p>
        )}
        {insights.topCategory && (
          <p className="mt-2 text-[#293241]">
            Top Spending Category: <strong>{insights.topCategory}</strong>
          </p>
        )}
        {categoryData.length === 0 && (
          <p className="text-[#3d5a80]">No data available yet.</p>
        )}
      </div>
    </div>
  );
}
