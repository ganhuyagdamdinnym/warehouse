import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { useEffect, useState } from "react";

export const Totals = () => {
  const stats = [
    {
      label: "Нийт орлого",
      value: 478,
      growth: "+12.4%",
      up: true,
      sub: "Энэ сар",
    },
    {
      label: "Нийт зарлага",
      value: 392,
      growth: "+8.7%",
      up: true,
      sub: "Энэ сар",
    },
    {
      label: "Бараа материал",
      value: 50,
      growth: "-2.1%",
      up: false,
      sub: "Нийт төрөл",
    },
    {
      label: "Харилцагчид",
      value: 50,
      growth: "+5.0%",
      up: true,
      sub: "Нийт бүртгэл",
    },
    { label: "Агуулахууд", value: 4, growth: "0%", up: true, sub: "Идэвхтэй" },
    {
      label: "Шилжүүлэг",
      value: 183,
      growth: "+19.3%",
      up: true,
      sub: "Энэ сар",
    },
    {
      label: "Залруулга",
      value: 95,
      growth: "-4.5%",
      up: false,
      sub: "Энэ сар",
    },
    { label: "Хэрэглэгчид", value: 25, growth: "+1.0%", up: true, sub: "Нийт" },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-emerald-600" : "text-red-500"}`}
            >
              {stat.up ? (
                <HiArrowTrendingUp className="w-3.5 h-3.5" />
              ) : (
                <HiArrowTrendingDown className="w-3.5 h-3.5" />
              )}
              {stat.growth}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 leading-none">
            {stat.label}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
        </div>
      ))}
    </section>
  );
};
