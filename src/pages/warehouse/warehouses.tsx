import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi";
import { IoCheckmark } from "react-icons/io5";

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
  status: "Draft" | "Completed" | "Pending";
}

const warehousesList: WarehouseData[] = [
  {
    id: "4",
    name: "Агуулах 4",
    code: "WH4",
    phone: "+976 99114455",
    email: "robel.maverick@example.com",
    address: "Улаанбаатар, Баянзүрх дүүрэг, 14-р хороо",
    active: true,
    status: "Completed",
  },
  {
    id: "3",
    name: "Агуулах 3",
    code: "WH3",
    phone: "+976 88112233",
    email: "enos72@example.net",
    address: "Улаанбаатар, Хан-Уул дүүрэг, Үйлдвэр комбинат",
    active: true,
    status: "Completed",
  },
  {
    id: "2",
    name: "Агуулах 2",
    code: "WH2",
    phone: "+976 95152535",
    email: "arne83@example.com",
    address: "Дархан хот, 2-р баг, Үйлдвэрийн бүс",
    active: true,
    status: "Completed",
  },
  {
    id: "1",
    name: "Агуулах 1",
    code: "WH1",
    phone: "+976 91910011",
    email: "rath.waino@example.org",
    address: "Эрдэнэт хот, Баян-Өндөр сум",
    active: true,
    status: "Completed",
  },
];

const Warehouses: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (item: WarehouseData) => {
    navigate(`/warehouses/${item.id}/edit`);
  };

  const filteredList = warehousesList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Агуулахын бүртгэл</h3>
          <p className="mt-1 text-gray-600">
            Доорх хүснэгтээс агуулахуудын мэдээллийг хянана уу
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-medium"
              >
                Шүүлтүүр <HiChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                  {[
                    { value: "All", label: "Бүгд" },
                    { value: "Draft", label: "Зөвхөн ноорог" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setStatusFilter(f.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${statusFilter === f.value ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none"
                placeholder="Хайх (Нэр, и-мэйл)"
              />
              {searchTerm && (
                <span
                  className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  Цэвэрлэх
                </span>
              )}
            </div>
          </div>

          <button className="p-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition">
            <TfiMenuAlt className="w-4 h-4" />
          </button>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Нэр / Код
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Холбоо барих
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Хаяг
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Төлөв
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectItem(item)}
                >
                  <td className="px-6 py-5 text-sm text-gray-800 font-medium">
                    {item.name}{" "}
                    <span className="text-gray-400 ml-1">({item.code})</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-800">
                    <div className="flex flex-col">
                      <span>{item.phone}</span>
                      <span className="text-gray-500 text-xs">
                        {item.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 max-w-xs">
                    {item.address}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {item.active && (
                      <div className="flex items-center text-gray-800 font-medium">
                        <IoCheckmark className="text-green-500 mr-1 w-4 h-4" />
                        <span>Идэвхтэй</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right text-gray-400">
                    <span className="text-lg">›</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900 text-base">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Код:{" "}
                    <span className="font-medium text-gray-700">
                      {item.code}
                    </span>
                  </div>
                </div>
                <span className="text-xl text-gray-300">›</span>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-2 border-l-2 border-gray-100 pl-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs w-14 shrink-0">
                    Утас
                  </span>
                  <span>{item.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs w-14 shrink-0">
                    И-мэйл
                  </span>
                  <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-gray-400 text-xs w-14 shrink-0 mt-0.5">
                    Хаяг
                  </span>
                  <span className="text-gray-600 text-xs leading-relaxed">
                    {item.address}
                  </span>
                </div>
              </div>

              {item.active && (
                <div className="flex items-center text-sm text-green-600 font-medium mt-1">
                  <IoCheckmark className="mr-1 w-4 h-4" />
                  <span>Идэвхтэй</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">Харуулах</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border-gray-300 rounded-md text-sm p-1 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="ml-2">
                Нийт {totalItems} бичлэгээс {displayFrom}-{displayTo} харуулж
                байна
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 border rounded-md transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
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

export default Warehouses;
