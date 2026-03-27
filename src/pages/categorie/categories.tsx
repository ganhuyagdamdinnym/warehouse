import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiChevronDown,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { getCategories, deleteCategory } from "../../api/category/category";
import type { Category } from "../../models/types/category";
import { Confirmation } from "../../components/confirmation";

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayFrom = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, total);

  const openDeleteConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setShowConfirm(true);
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      });
      setData(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message ?? "Өгөгдөл татахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategory(deleteId);
      setShowConfirm(false); // Close modal
      setDeleteId(null); // Clear ID
      fetchData(); // Refresh list
    } catch (err: any) {
      alert(err.message ?? "Устгахад алдаа гарлаа.");
    }
  };

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      {showConfirm && (
        <Confirmation
          onClose={() => {
            setShowConfirm(false);
            setDeleteId(null);
          }}
          onConfirm={handleConfirmDelete} // No more type error!
          title="Ангилалыг устгах уу?"
          description="Та энэ ангилалг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Ангилал
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх хүснэгтээс мэдээллийг хянана уу
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
              !
            </span>
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-5 flex gap-3 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            {/* Filter — категори нь status-гүй тул зөвхөн placeholder */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Шүүлтүүр
                <HiChevronDown
                  className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white border border-gray-300 rounded-xl z-10 p-1.5">
                  <p className="text-xs font-semibold text-gray-400 px-2 py-1.5 uppercase tracking-wider">
                    Төрөл
                  </p>
                  {[
                    { value: "all", label: "Бүгд" },
                    { value: "parent", label: "Үндсэн ангилал" },
                    { value: "child", label: "Дэд ангилал" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-3 gap-2 hover:border-gray-300 transition-colors">
              <HiOutlineSearch className="text-gray-400 w-4 h-4 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 text-sm border-0 focus:ring-0 outline-none text-gray-700 placeholder-gray-400"
                placeholder="Нэр, код хайх..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-gray-400 hover:text-gray-600 shrink-0 transition-colors"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span className="hidden lg:block">Шинэ ангилал</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left border-b border-gray-200/60">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                  Нэр
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                  Код
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Харьяалагдах ангилал
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-6">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Уншиж байна...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/categories/${item.id}/edit`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {item.code ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {item.parent?.name ?? (
                          <span className="text-gray-400 italic">Үндсэн</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            navigate(`/categories/${item.id}/edit`)
                          }
                          className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                          title="Засах"
                        >
                          <HiOutlinePencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => openDeleteConfirm(e, item.id)}
                          className="p-2 bg-white text-red-500 hover:bg-red-50 transition-colors"
                          title="Устгах"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 md:hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Уншиж байна...
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Өгөгдөл олдсонгүй
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/categories/${item.id}/edit`)}
                className="bg-white border border-gray-200/60 rounded-xl p-4 cursor-pointer hover:border-gray-300/60 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  <div
                    className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/categories/${item.id}/edit`)}
                      className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                    >
                      <HiOutlinePencilAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => openDeleteConfirm(e, item.id)}
                      className="p-2 bg-white text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 text-xs w-20 shrink-0">
                      Код
                    </span>
                    <span className="text-gray-700 font-medium">
                      {item.code ?? "—"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 text-xs w-20 shrink-0">
                      Харьяалал
                    </span>
                    <span className="text-gray-700">
                      {item.parent?.name ?? (
                        <span className="italic text-gray-400">Үндсэн</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
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

export default Categories;
