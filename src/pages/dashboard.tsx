import { useState } from "react";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Totals } from "../components/dashboard/totals";
import { LastActions } from "../components/dashboard/lastActions";

const monthlyData = [
  { name: "7-р сар", checkins: 12, checkouts: 8, transfers: 5, adjustments: 3 },
  {
    name: "8-р сар",
    checkins: 19,
    checkouts: 14,
    transfers: 9,
    adjustments: 6,
  },
  {
    name: "9-р сар",
    checkins: 15,
    checkouts: 11,
    transfers: 7,
    adjustments: 4,
  },
  {
    name: "10-р сар",
    checkins: 28,
    checkouts: 22,
    transfers: 13,
    adjustments: 8,
  },
  {
    name: "11-р сар",
    checkins: 34,
    checkouts: 27,
    transfers: 18,
    adjustments: 11,
  },
  {
    name: "12-р сар",
    checkins: 41,
    checkouts: 35,
    transfers: 22,
    adjustments: 14,
  },
  {
    name: "1-р сар",
    checkins: 38,
    checkouts: 30,
    transfers: 19,
    adjustments: 12,
  },
  {
    name: "2-р сар",
    checkins: 52,
    checkouts: 44,
    transfers: 28,
    adjustments: 17,
  },
  {
    name: "3-р сар",
    checkins: 47,
    checkouts: 39,
    transfers: 24,
    adjustments: 15,
  },
  {
    name: "4-р сар",
    checkins: 61,
    checkouts: 53,
    transfers: 31,
    adjustments: 20,
  },
  {
    name: "5-р сар",
    checkins: 58,
    checkouts: 48,
    transfers: 29,
    adjustments: 18,
  },
  {
    name: "6-р сар",
    checkins: 73,
    checkouts: 62,
    transfers: 38,
    adjustments: 24,
  },
];

const stockTrendData = [
  { name: "1-р сар", stock: 420 },
  { name: "2-р сар", stock: 390 },
  { name: "3-р сар", stock: 450 },
  { name: "4-р сар", stock: 410 },
  { name: "5-р сар", stock: 480 },
  { name: "6-р сар", stock: 520 },
  { name: "7-р сар", stock: 495 },
  { name: "8-р сар", stock: 560 },
  { name: "9-р сар", stock: 530 },
  { name: "10-р сар", stock: 610 },
  { name: "11-р сар", stock: 580 },
  { name: "12-р сар", stock: 640 },
];

const topItems = [
  {
    name: "Туршилтын бараа 01",
    category: "Ангилал 4",
    stock: 142,
    trend: "up",
  },
  { name: "Туршилтын бараа 07", category: "Ангилал 2", stock: 98, trend: "up" },
  {
    name: "Туршилтын бараа 13",
    category: "Ангилал 7",
    stock: 76,
    trend: "down",
  },
  { name: "Туршилтын бараа 22", category: "Ангилал 1", stock: 54, trend: "up" },
  {
    name: "Туршилтын бараа 31",
    category: "Ангилал 9",
    stock: 33,
    trend: "down",
  },
];

const Dashboard = () => {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Февраль");

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Хяналтын самбар
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Агуулахын үйл ажиллагааны ерөнхий мэдээлэл
          </p>
        </div>

        {/* Stats Grid */}
        <Totals />
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Bar Chart — 2/3 width */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Жилийн үзүүлэлт
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Орлого, зарлага, шилжүүлэг, залруулга
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  {[
                    "1-р сар",
                    "2-р сар",
                    "3-р сар",
                    "4-р сар",
                    "5-р сар",
                    "6-р сар",
                    "7-р сар",
                    "8-р сар",
                    "9-р сар",
                    "10-р сар",
                    "11-р сар",
                    "12-р сар",
                  ].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  {["2024", "2025", "2026"].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "none",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ paddingTop: "16px", fontSize: 12 }}
                  />
                  <Bar
                    dataKey="checkins"
                    name="Орлого"
                    fill="#10b981"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
                  <Bar
                    dataKey="checkouts"
                    name="Зарлага"
                    fill="#f59e0b"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
                  <Bar
                    dataKey="transfers"
                    name="Шилжүүлэг"
                    fill="#6366f1"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
                  <Bar
                    dataKey="adjustments"
                    name="Залруулга"
                    fill="#ef4444"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart — 1/3 width */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Үлдэгдлийн чиг хандлага
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Нийт үлдэгдлийн өөрчлөлт
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockTrendData}>
                  <defs>
                    <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "none",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stock"
                    name="Үлдэгдэл"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#stockGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity — 2/3 */}
          <LastActions />

          {/* Top Items — 1/3 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Эрэлттэй бараанууд
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Хамгийн их үлдэгдэлтэй бараанууд
              </p>
            </div>
            <div className="divide-y divide-gray-100/80">
              {topItems.map((item, i) => (
                <div
                  key={i}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {item.stock}
                    </span>
                    {item.trend === "up" ? (
                      <HiArrowTrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <HiArrowTrendingDown className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
