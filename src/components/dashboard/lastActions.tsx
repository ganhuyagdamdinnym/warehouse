import { useEffect, useState } from "react";
import { getRecentActivity } from "../../api/dashboard/dashboard";
import type { ActivityItem, ActivityType } from "../../api/dashboard/dashboard";

const typeConfig: Record<
  ActivityType,
  { label: string; dot: string; badge: string }
> = {
  checkin: {
    label: "Орлого",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  checkout: {
    label: "Зарлага",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  adjustment: {
    label: "Залруулга",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
};

const statusConfig: Record<string, string> = {
  Draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

const statusLabel: Record<string, string> = {
  Draft: "Ноорог",
  Completed: "Дууссан",
  Pending: "Хүлээгдэж буй",
};

function timeAgo(dateStr: string): string {
  const normalized =
    dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";

  const diffMs = Date.now() - new Date(normalized).getTime();
  if (diffMs <= 0) return "Дөнгөж сая";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}с өмнө`;
  if (diffMin < 60) return `${diffMin}м өмнө`;
  if (diffHour < 24) return `${diffHour}ц өмнө`;
  return `${diffDay}х өмнө`;
}

export const LastActions = () => {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentActivity(5)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Сүүлийн үйлдлүүд
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Хамгийн сүүлд хийгдсэн бүртгэлүүд
          </p>
        </div>
        {!loading && (
          <span className="text-xs text-gray-400">{data.length} бүртгэл</span>
        )}
      </div>

      <div className="divide-y divide-gray-100/80">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-5 py-3.5 flex items-center gap-3 animate-pulse"
            >
              <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-md" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Үйлдэл олдсонгүй
          </div>
        ) : (
          data.map((item) => {
            const tc = typeConfig[item.type];
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/70 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${tc.dot} shrink-0`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {item.code}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ring-1 ${tc.badge}`}
                    >
                      {tc.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      statusConfig[item.status] ??
                      "bg-gray-50 text-gray-500 ring-1 ring-gray-200"
                    }`}
                  >
                    {statusLabel[item.status] ?? item.status}
                  </span>
                  <span className="text-[10px] text-gray-300">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
