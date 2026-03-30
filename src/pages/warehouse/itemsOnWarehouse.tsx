// pages/warehouse/ItemsOnWarehouse.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineSearch,
  HiOutlineExclamation,
} from "react-icons/hi";
import {
  getWarehouse,
  getWarehouseItems,
  type WarehouseStockItem,
} from "../../api/warehouse/warehouse_api";

const ItemsOnWarehouse: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [items, setItems] = useState<WarehouseStockItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [warehouseName, setWarehouseName] = useState("");

  // Агуулахын нэр татах
  useEffect(() => {
    if (!id) return;
    getWarehouse(id)
      .then((res: any) => setWarehouseName(res.warehouse?.name ?? "Агуулах"))
      .catch(console.error);
  }, [id]);

  const fetchItems = useCallback(
    async (page: number, searchVal: string) => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getWarehouseItems(id, {
          search: searchVal,
          page,
          limit: itemsPerPage,
        });
        setItems(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchItems(currentPage, appliedSearch);
  }, [currentPage, appliedSearch, fetchItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedSearch(search);
  };

  const handleClear = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayFrom = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/50">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/warehouses")}
              >
                Агуулах
              </span>
              {" / "}
              {warehouseName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Энэ агуулахад байгаа бүх бараа материал
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Бараа хайх..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Хайх
            </button>
            {appliedSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Цэвэрлэх
              </button>
            )}
          </form>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Нийт төрөл
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Нийт үлдэгдэл
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </p>
          </div>
          <div className="bg-white border border-red-100 rounded-xl p-4">
            <p className="text-xs text-red-400 uppercase tracking-wider font-medium">
              Дутагдалтай
            </p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {items.filter((i) => i.isLowStock).length}
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Бараа
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ангилал
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Нэгж
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Үлдэгдэл
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Шинэчлэгдсэн
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Энэ агуулахад бараа байхгүй байна
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/item/${row.item.id}/trail`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {row.isLowStock && (
                          <HiOutlineExclamation className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {row.item.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {row.item.internalCode ?? row.item.sku ?? "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {row.item.category ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {row.item.unit ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`text-lg font-bold ${
                          row.isLowStock ? "text-red-500" : "text-gray-900"
                        }`}
                      >
                        {row.quantity}
                      </span>
                      {row.item.stockAlert != null && (
                        <div className="text-xs text-gray-400 mt-0.5 text-right">
                          мин: {row.item.stockAlert}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(row.updatedAt).toLocaleDateString("mn-MN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <span>
              {displayFrom}–{displayTo} / нийт {total}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 border rounded-lg transition-colors ${
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
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Дараах
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Уншиж байна...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Энэ агуулахад бараа байхгүй байна
            </div>
          ) : (
            items.map((row) => (
              <div
                key={row.id}
                onClick={() => navigate(`/item/${row.item.id}/trail`)}
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {row.isLowStock && (
                      <HiOutlineExclamation className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {row.item.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {row.item.internalCode ?? row.item.sku ?? "—"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-bold ${row.isLowStock ? "text-red-500" : "text-gray-900"}`}
                  >
                    {row.quantity}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>
                    Ангилал:{" "}
                    <span className="text-gray-700">
                      {row.item.category ?? "—"}
                    </span>
                  </span>
                  <span>
                    Нэгж:{" "}
                    <span className="text-gray-700">
                      {row.item.unit ?? "—"}
                    </span>
                  </span>
                </div>
                {row.item.stockAlert != null && (
                  <div className="mt-2 text-xs text-gray-400">
                    Доод хязгаар:{" "}
                    <span
                      className={
                        row.isLowStock
                          ? "text-red-500 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {row.item.stockAlert}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
            <span>
              {displayFrom}–{displayTo} / {total}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
              >
                Өмнөх
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40"
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

export default ItemsOnWarehouse;
