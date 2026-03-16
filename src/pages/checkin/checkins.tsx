import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineChatAlt2,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiChevronDown,
} from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { CheckInDetails } from "../../components/details/checkInDetails";
import { getCheckins, deleteCheckin } from "../../api";
import type { Checkin } from "../../models/types/checkin";

const statusConfig = {
  Draft: {
    label: "Ноорог",
    class: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  Completed: {
    label: "Дууссан",
    class: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  Pending: {
    label: "Хүлээгдэж буй",
    class: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
};

const Checkins: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // API state
  const [checkinsList, setCheckinsList] = useState<Checkin[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const data = await getCheckins({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage,
      });
      setCheckinsList(data.data);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Өгөгдөл татахад алдаа гарлаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [searchTerm, statusFilter, currentPage, itemsPerPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    try {
      await deleteCheckin(id);
      fetchCheckins();
    } catch (err) {
      console.error("Устгахад алдаа гарлаа:", err);
    }
  };

  const handleSelectItem = (item: Checkin) => {
    setSelectedItem(item);
    setIsOpenDetails(true);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayFrom =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Орлого
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх хүснэгт дэх мэдээллийг шалгана уу
          </p>
        </div>

        {isOpenDetails && selectedItem && (
          <CheckInDetails
            onClose={() => setIsOpenDetails(false)}
            items={selectedItem.items}
          />
        )}

        <div className="mb-5 flex gap-3 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
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
                    Төлөв
                  </p>
                  {["All", "Draft", "Non-Draft"].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setStatusFilter(f);
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        statusFilter === f
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {f === "All"
                        ? "Бүх орлого"
                        : f === "Draft"
                          ? "Ноорог"
                          : "Ноорог биш"}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 text-sm border-0 focus:ring-0 outline-none text-gray-700 placeholder-gray-400"
                placeholder="Хайх..."
              />
              {(searchTerm || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                  }}
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
            <span className="hidden lg:block">Шинэ орлого нэмэх</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left border-b border-gray-200/60">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Орлого
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Холбоотой мэдээлэл
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Тайлбар
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-6">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : checkinsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              ) : (
                checkinsList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                    onClick={() => handleSelectItem(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-600 text-sm">
                        {item.code}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.date}
                      </div>
                      <span
                        className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[item.status].class}`}
                      >
                        <AiOutlineFileText className="w-3 h-3" />
                        {statusConfig[item.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {[
                          { label: "Харилцагч", value: item.contact },
                          { label: "Агуулах", value: item.warehouse },
                          { label: "Хэрэглэгч", value: item.user },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-gray-400 text-xs w-20 shrink-0">
                              {label}
                            </span>
                            <span className="text-gray-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.details}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/checkin/${item.id}/edit`)}
                          className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                          title="Засах"
                        >
                          <HiOutlinePencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-white text-indigo-500 hover:bg-indigo-50 border-r border-gray-200/60 transition-colors"
                          title="Чат"
                        >
                          <HiOutlineChatAlt2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-white text-amber-500 hover:bg-amber-50 border-r border-gray-200/60 transition-colors"
                          title="Түүх"
                        >
                          <HiOutlineClipboardList className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
            <div className="text-center text-sm text-gray-400 py-8">
              Уншиж байна...
            </div>
          ) : (
            checkinsList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="bg-white border border-gray-200/60 rounded-xl p-4 cursor-pointer hover:border-gray-300/60 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-blue-600 text-sm">
                      {item.code}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.date}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[item.status].class}`}
                  >
                    {statusConfig[item.status].label}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 text-xs w-20">
                      Харилцагч
                    </span>
                    <span className="text-gray-700">{item.contact}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 text-xs w-20">Агуулах</span>
                    <span className="text-gray-700">{item.warehouse}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400 line-clamp-1">
                  {item.details}
                </p>
                <div
                  className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/checkin/${item.id}/edit`)}
                    className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                    title="Засах"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 bg-white text-indigo-500 hover:bg-indigo-50 border-r border-gray-200/60 transition-colors"
                    title="Чат"
                  >
                    <HiOutlineChatAlt2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 bg-white text-amber-500 hover:bg-amber-50 border-r border-gray-200/60 transition-colors"
                    title="Түүх"
                  >
                    <HiOutlineClipboardList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white text-red-500 hover:bg-red-50 transition-colors"
                    title="Устгах"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
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
                {displayFrom}–{displayTo} / {totalItems}
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

export default Checkins;
