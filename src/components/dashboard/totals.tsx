import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboard/dashboard";
import type {
  DashboardResponse,
  StatItem,
} from "../../api/dashboard/dashboard";

export const Totals = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const buildStats = (d: DashboardResponse) => [
    { label: "Нийт орлого", ...d.checkins },
    { label: "Нийт зарлага", ...d.checkouts },
    { label: "Бараа материал", ...d.items },
    { label: "Харилцагчид", ...d.contacts },
    { label: "Агуулахууд", ...d.warehouses },
    { label: "Шилжүүлэг", ...d.transfers },
    { label: "Залруулга", ...d.adjustments },
    { label: "Хэрэглэгчид", ...d.users },
  ];

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="p-4 rounded-xl bg-white border border-gray-200 animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-8 w-12 bg-gray-100 rounded" />
        <div className="h-4 w-12 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  );

  return (
    <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {loading || !data
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : buildStats(data).map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.up ? "text-emerald-600" : "text-red-500"
                  }`}
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
