import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

interface UnitData {
  id: string;
  name: string;
  code: string;
  baseUnit: string;
  formula: string;
  status: "Draft" | "Completed" | "Pending";
}

const unitsList: UnitData[] = [
  {
    id: "1",
    name: "Доозон",
    code: "dz",
    baseUnit: "Ширхэг (pc)",
    formula: "Ширхэг (pc) * 12 = Доозон (dz)",
    status: "Completed",
  },
  {
    id: "2",
    name: "Сантиметр",
    code: "cm",
    baseUnit: "Метр (m)",
    formula: "Метр (m) * 100 = Сантиметр (cm)",
    status: "Completed",
  },
  {
    id: "3",
    name: "Килограмм",
    code: "kg",
    baseUnit: "",
    formula: "",
    status: "Completed",
  },
  {
    id: "4",
    name: "Ширхэг",
    code: "pc",
    baseUnit: "",
    formula: "",
    status: "Completed",
  },
  {
    id: "5",
    name: "Метр",
    code: "m",
    baseUnit: "",
    formula: "",
    status: "Completed",
  },
];

const Units: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (item: UnitData) => {
    navigate(`/units/${item.id}/edit`);
  };

  const filteredList = unitsList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Draft"
          ? item.status === "Draft"
          : item.status !== "Draft";
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const displayFrom = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const displayTo = Math.min(indexOfLastItem, totalItems);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Хэмжих нэгж
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх хүснэгтээс мэдээллийг хянана уу
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex gap-3 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200/60 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Шүүлтүүр
                <HiChevronDown
                  className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl z-10 p-1.5">
                  <p className="text-xs font-semibold text-gray-400 px-2 py-1.5 uppercase tracking-wider">
                    Төлөв
                  </p>
                  {[
                    { value: "All", label: "Бүгд" },
                    { value: "Draft", label: "Ноорог" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setStatusFilter(f.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        statusFilter === f.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 bg-white border border-gray-200/60 rounded-lg px-3 gap-2 hover:border-gray-300 transition-colors">
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
            <span className="hidden lg:block">Шинэ нэгж</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-gray-200/60 rounded-xl overflow-hidden">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left border-b border-gray-200/60">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Нэр
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Код
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Үндсэн нэгж
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-6">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                  onClick={() => handleSelectItem(item)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{item.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {item.baseUnit || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/units/${item.id}/edit`)}
                        className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                        title="Засах"
                      >
                        <HiOutlinePencilAlt className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-white text-red-500 hover:bg-red-50 transition-colors"
                        title="Устгах"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 md:hidden">
          {currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="bg-white border border-gray-200/60 rounded-xl p-4 cursor-pointer hover:border-gray-300/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Код:{" "}
                    <span className="font-medium text-gray-600">
                      {item.code}
                    </span>
                  </div>
                </div>
              </div>
              {item.baseUnit && (
                <div className="flex gap-2 text-sm mt-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0">
                    Үндсэн нэгж
                  </span>
                  <span className="text-gray-700">{item.baseUnit}</span>
                </div>
              )}
            </div>
          ))}
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

export default Units;
