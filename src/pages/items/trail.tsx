// pages/items/ItemTrail.tsx
import React, { useState, useEffect } from "react";
import { type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineSwitchHorizontal,
  HiOutlineAdjustments,
} from "react-icons/hi";
import { getItemTrail, getItemStockSummary } from "../../api/item/trail";
import type { TrailItem, StockSummary } from "../../api/item/trail";

const typeConfig: Record<
  TrailItem["type"],
  { label: string; color: string; icon: ReactNode } // React.ReactNode → ReactNode
> = {
  CHECKIN: {
    label: "Орлого",
    color: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200",
    icon: <HiOutlineArrowDown className="w-3.5 h-3.5" />,
  },
  CHECKOUT: {
    label: "Зарлага",
    color: "text-red-600 bg-red-50 ring-1 ring-red-200",
    icon: <HiOutlineArrowUp className="w-3.5 h-3.5" />,
  },
  TRANSFER_IN: {
    label: "Шилжилт (+)",
    color: "text-blue-600 bg-blue-50 ring-1 ring-blue-200",
    icon: <HiOutlineSwitchHorizontal className="w-3.5 h-3.5" />,
  },
  TRANSFER_OUT: {
    label: "Шилжилт (-)",
    color: "text-orange-600 bg-orange-50 ring-1 ring-orange-200",
    icon: <HiOutlineSwitchHorizontal className="w-3.5 h-3.5" />,
  },
  ADJUSTMENT: {
    label: "Тохируулга",
    color: "text-purple-600 bg-purple-50 ring-1 ring-purple-200",
    icon: <HiOutlineAdjustments className="w-3.5 h-3.5" />,
  },
};
const ItemTrail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [trailData, setTrailData] = useState<TrailItem[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchTrail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [trailRes, summaryRes] = await Promise.all([
        getItemTrail(id, { page: currentPage, limit: itemsPerPage }),
        getItemStockSummary(id),
      ]);
      setTrailData(trailRes.data);
      setTotal(trailRes.total);
      setSummary(summaryRes);
    } catch (err) {
      console.error("Түүх татахад алдаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrail();
  }, [id, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayFrom = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, total);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("mn-MN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/items")}
            >
              Бараа
            </span>
            {" / "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate(`/items/${id}/trail`)}
            >
              Түүх
            </span>
            {summary && ` / ${summary.item.name}`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Барааны хөдөлгөөний бүртгэл
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Нийт үлдэгдэл */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                Нийт үлдэгдэл
              </p>
              <p
                className={`text-2xl font-bold ${summary.totalStock < 0 ? "text-red-500" : "text-gray-900"}`}
              >
                {summary.totalStock}
              </p>
            </div>

            {/* Агуулах тус бүр */}
            {summary.warehouseStocks.map((ws) => (
              <div
                key={ws.warehouseId}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
                  {ws.warehouseName}
                </p>
                <p
                  className={`text-2xl font-bold ${ws.quantity < 0 ? "text-red-500" : "text-gray-900"}`}
                >
                  {ws.quantity}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Шинэчлэгдсэн: {formatDate(ws.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Trail Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/60">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Төрөл
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Агуулах
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Лавлах
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Тоо хэмжээ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : trailData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    Хөдөлгөөний түүх байхгүй байна
                  </td>
                </tr>
              ) : (
                trailData.map((row) => {
                  const cfg = typeConfig[row.type];
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-800">
                          {formatDate(row.createdAt)}
                        </div>
                        {row.note && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {row.note}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${cfg.color}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {row.type === "CHECKIN" || row.type === "TRANSFER_IN"
                          ? (row.warehouseTo ?? "—")
                          : (row.warehouseFrom ?? "—")}
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-500">
                        {row.referenceCode ?? "—"}
                      </td>
                      <td
                        className={`px-4 py-4 text-sm text-right font-semibold ${
                          row.quantity < 0 ? "text-red-500" : "text-emerald-600"
                        }`}
                      >
                        {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Харуулах</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-400">
                {displayFrom}–{displayTo} / {total}
              </span>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                    currentPage === i + 1
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Дараах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTrail;
