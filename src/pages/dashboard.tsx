import { useState } from "react";
import { HiArrowTrendingUp } from "react-icons/hi2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Jan 26", checkins: 1, checkouts: 2, transfers: 3, adjustments: 1 },
  { name: "Feb 26", checkins: 4, checkouts: 4, transfers: 3, adjustments: 3 },
  { name: "Mar 26", checkins: 0, checkouts: 0, transfers: 0, adjustments: 0 },
  { name: "Apr 26", checkins: 0, checkouts: 0, transfers: 0, adjustments: 0 },
];

const Dashboard = () => {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("February");

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Top Cards Section */}
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Checkins", value: 5, growth: "25.00%" },
            { label: "Checkouts", value: 2, growth: "100.00%" },
            { label: "Items", value: 50 },
            { label: "Contacts", value: 50 },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-md shadow-sm bg-white border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>
                {stat.growth && (
                  <span className="flex items-center space-x-1 text-sm font-medium text-green-500">
                    <HiArrowTrendingUp className="w-4 h-4" />
                    <span>{stat.growth}</span>
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="block w-full sm:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {["January", "February", "March", "April", "May"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="block w-full sm:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {["2024", "2025", "2026"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Diagram (Chart) Section */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Year Overview
            </h3>
            <p className="text-xs text-gray-400">
              Please review the chart below
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Bar
                  dataKey="checkins"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="checkouts"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="transfers"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="adjustments"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
