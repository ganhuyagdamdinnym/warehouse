import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiChevronDown,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";

interface CheckinData {
  id: string;
  name: string;
  code: string;
  symbology: string;
  status: "Ноорог" | "Дууссан" | "Хүлээгдэж буй";
  trackWeight: boolean;
  trackQuantity: boolean;
  alertOn: string;
  category: string;
  unit: string;
  stock: string;
  variants?: { label: string; values: string }[];
}

const checkinsList: CheckinData[] = [
  {
    id: "1",
    name: "Туршилтын бараа 50",
    code: "TI50",
    symbology: "CODE128",
    status: "Ноорог",
    trackWeight: false,
    trackQuantity: true,
    alertOn: "15.00",
    category: "Ангилал 8",
    unit: "Ширхэг",
    stock: "-18.00",
  },
  {
    id: "2",
    name: "Туршилтын бараа 49",
    code: "TI49",
    symbology: "CODE128",
    status: "Дууссан",
    trackWeight: false,
    trackQuantity: true,
    alertOn: "15.00",
    category: "Ангилал 12",
    unit: "Ширхэг",
    stock: "7.00",
    variants: [
      { label: "Өнгө", values: "Улаан, Ногоон" },
      { label: "Хэмжээ", values: "S, M, L" },
    ],
  },
];

const Items: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredList = checkinsList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const displayFrom = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const displayTo = Math.min(indexOfLastItem, totalItems);

  const ActionButtons = ({ stopProp = false }: { stopProp?: boolean }) => (
    <div
      className="inline-flex rounded-lg border border-gray-200 overflow-hidden shadow-sm"
      onClick={stopProp ? (e) => e.stopPropagation() : undefined}
    >
      <button
        className="p-2 bg-white text-blue-600 hover:bg-blue-50 border-r border-gray-200"
        title="Түүх"
      >
        <HiOutlineClipboardList className="w-4 h-4" />
      </button>
      <button
        className="p-2 bg-white text-indigo-600 hover:bg-indigo-50 border-r border-gray-200"
        title="Харах"
      >
        <AiOutlineFileText className="w-4 h-4" />
      </button>
      <button
        className="p-2 bg-white text-yellow-600 hover:bg-yellow-50 border-r border-gray-200"
        title="Засах"
      >
        <HiOutlinePencilAlt className="w-4 h-4" />
      </button>
      <button
        className="p-2 bg-white text-red-600 hover:bg-red-50"
        title="Устгах"
      >
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">Бараа материал</h3>
          <p className="text-gray-600">Доорх хүснэгт дэх өгөгдлийг хянана уу</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium text-sm"
            >
              Шүүлтүүр <HiChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="flex items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3">
              <HiOutlineSearch className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none text-base"
                placeholder="Хайх..."
              />
            </div>
          </div>
          <button
            onClick={() => navigate("/checkins/create")}
            className="inline-flex items-center px-4 py-3 bg-gray-800 rounded-md font-semibold text-xs text-white uppercase hover:bg-gray-700 transition"
          >
            <HiOutlinePlus className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">Шинэ бараа нэмэх</span>
          </button>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white border border-gray-200 shadow-sm rounded-md overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm text-black">Нэр</th>
                <th className="px-6 py-4 text-sm text-black">Сонголтууд</th>
                <th className="px-6 py-4 text-sm text-black">Хувилбарууд</th>
                <th className="px-6 py-4 text-sm text-black">Холбоос</th>
                <th className="px-6 py-4 text-sm text-black">Үлдэгдэл</th>
                <th className="px-6 py-4 text-right pr-10 text-black">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Код:{" "}
                      <span className="font-semibold text-gray-800">
                        {item.code}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Тэмдэглэгээ: {item.symbology}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      Жин хянах{" "}
                      {item.trackWeight ? (
                        <HiCheck className="text-green-500" />
                      ) : (
                        <HiX className="text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      Тоо хянах{" "}
                      {item.trackQuantity ? (
                        <HiCheck className="text-green-500" />
                      ) : (
                        <HiX className="text-red-500" />
                      )}
                    </div>
                    <div className="text-gray-500">
                      Доод хязгаар:{" "}
                      <span className="text-gray-900 font-medium">
                        {item.alertOn}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.variants ? (
                      item.variants.map((v, i) => (
                        <div key={i} className="text-gray-600">
                          <span className="font-semibold text-gray-800">
                            {v.label}:
                          </span>{" "}
                          {v.values}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-gray-900 font-semibold">
                      {item.category}
                    </div>
                    <div className="text-gray-500">
                      Нэгж: <span className="text-gray-800">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Тоо хэмжээ:</span>
                      <span className="font-bold text-gray-900 text-lg">
                        {item.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons />
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Код:{" "}
                    <span className="font-semibold text-gray-700">
                      {item.code}
                    </span>
                    <span className="ml-2 text-gray-400">
                      · {item.symbology}
                    </span>
                  </div>
                </div>
                <ActionButtons stopProp />
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-3">
                <div className="flex items-center gap-1 text-gray-600">
                  Жин хянах{" "}
                  {item.trackWeight ? (
                    <HiCheck className="text-green-500" />
                  ) : (
                    <HiX className="text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  Тоо хянах{" "}
                  {item.trackQuantity ? (
                    <HiCheck className="text-green-500" />
                  ) : (
                    <HiX className="text-red-500" />
                  )}
                </div>
                <div className="text-gray-500">
                  Хязгаар:{" "}
                  <span className="text-gray-900 font-medium">
                    {item.alertOn}
                  </span>
                </div>
              </div>

              {/* Relations */}
              <div className="text-sm text-gray-600 space-y-0.5 mb-3">
                <div>
                  <span className="text-gray-400 text-xs">Ангилал: </span>
                  {item.category}
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Нэгж: </span>
                  {item.unit}
                </div>
                {item.variants &&
                  item.variants.map((v, i) => (
                    <div key={i}>
                      <span className="text-gray-400 text-xs">{v.label}: </span>
                      {v.values}
                    </div>
                  ))}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Тоо хэмжээ</span>
                <span
                  className={`font-bold text-lg ${parseFloat(item.stock) < 0 ? "text-red-500" : "text-gray-900"}`}
                >
                  {item.stock}
                </span>
              </div>
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
                <option value={50}>50</option>
              </select>
              <span className="ml-2">
                Нийт {totalItems} бичилтээс {displayFrom}-аас {displayTo} хүртэл
                харуулж байна
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
                  className={`px-3 py-2 border rounded-md transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}
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

export default Items;
