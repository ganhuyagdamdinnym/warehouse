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
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { ItemDetails } from "../../components/details/itemDetails";

export interface ItemDetailData {
  id: string;
  name: string;
  code: string;
  symbology?: string;
  sku?: string;
  rack?: string;
  status?: "Ноорог" | "Дууссан" | "Хүлээгдэж буй";
  trackSerials: boolean;
  trackWeight: boolean;
  trackQuantity: boolean;
  alertOn?: string;
  category: string;
  unit: string;
  stock?: string;
  details?: string;
  variants?: { label: string; values: string }[];
  warehouseStocks?: {
    id: string;
    name: string;
    code: string;
    totalQuantity: string;
    variantStocks: { label: string; quantity: string }[];
  }[];
}

const itemsList: ItemDetailData[] = [
  {
    id: "1",
    name: "Туршилтын бараа 50",
    code: "TI50",
    symbology: "CODE128",
    sku: "",
    rack: "",
    status: "Ноорог",
    category: "Ангилал 4",
    unit: "Ширхэг",
    stock: "-18.00",
    trackSerials: false,
    trackWeight: true,
    trackQuantity: true,
    alertOn: "15.00",
    variants: [
      { label: "Өнгө", values: "Улаан, Ногоон" },
      { label: "Хэмжээ", values: "S, M, L" },
    ],
    details: "Sit qui facere exercitationem quam nulla qui.",
    warehouseStocks: [
      {
        id: "wh1",
        name: "Агуулах 1",
        code: "WH1",
        totalQuantity: "-6.00 ш (-6.00 кг)",
        variantStocks: [
          { label: "Хэмжээ: S, Өнгө: Улаан", quantity: "0.00 ш (0.00 кг)" },
          { label: "Хэмжээ: M, Өнгө: Улаан", quantity: "-10.00 ш (-10.00 кг)" },
          { label: "Хэмжээ: L, Өнгө: Улаан", quantity: "0.00 ш (0.00 кг)" },
          { label: "Хэмжээ: S, Өнгө: Ногоон", quantity: "0.00 ш (0.00 кг)" },
          { label: "Хэмжээ: M, Өнгө: Ногоон", quantity: "0.00 ш (0.00 кг)" },
          { label: "Хэмжээ: L, Өнгө: Ногоон", quantity: "4.00 ш (4.00 кг)" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Туршилтын бараа 49",
    code: "TI49",
    symbology: "CODE128",
    sku: "SKU49",
    rack: "A2",
    status: "Дууссан",
    category: "Ангилал 12",
    unit: "Ширхэг",
    stock: "7.00",
    trackSerials: false,
    trackWeight: false,
    trackQuantity: true,
    alertOn: "15.00",
    variants: [
      { label: "Өнгө", values: "Улаан, Ногоон" },
      { label: "Хэмжээ", values: "S, M, L" },
    ],
    details: "Энэ бол туршилтын бараа 49-ийн дэлгэрэнгүй тайлбар.",
    warehouseStocks: [
      {
        id: "wh1",
        name: "Агуулах 1",
        code: "WH1",
        totalQuantity: "7.00 ш (7.00 кг)",
        variantStocks: [
          { label: "Хэмжээ: S, Өнгө: Улаан", quantity: "2.00 ш (2.00 кг)" },
          { label: "Хэмжээ: M, Өнгө: Улаан", quantity: "3.00 ш (3.00 кг)" },
          { label: "Хэмжээ: L, Өнгө: Улаан", quantity: "2.00 ш (2.00 кг)" },
        ],
      },
    ],
  },
];

const statusConfig = {
  Ноорог: { class: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  Дууссан: { class: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  "Хүлээгдэж буй": { class: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
};

const Items: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemDetailData | null>(null);

  const handleSelectItem = (item: ItemDetailData) => {
    setSelectedItem(item);
    setIsOpenDetails(true);
  };

  const filteredList = itemsList.filter(
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

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Бараа материал
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх хүснэгт дэх өгөгдлийг хянана уу
          </p>
        </div>

        {isOpenDetails && selectedItem && (
          <ItemDetails
            onClose={() => setIsOpenDetails(false)}
            item={selectedItem}
          />
        )}

        {/* Toolbar */}
        <div className="mb-5 flex gap-3 justify-between items-center">
          <div className="flex items-center gap-2 w-full max-w-2xl">
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
                    Шүүлтүүр
                  </p>
                  {["Бүгд", "Ноорог", "Дууссан"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
            onClick={() => navigate("/items/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span className="hidden lg:block">Шинэ бараа нэмэх</span>
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
                  Сонголтууд
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Холбоос
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Үлдэгдэл
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
                  onClick={() => handleSelectItem(item)}
                  className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Код:{" "}
                      <span className="font-medium text-gray-600">
                        {item.code}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Тэмдэглэгээ: {item.symbology}
                    </div>
                    {item.status && (
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[item.status]?.class}`}
                      >
                        <AiOutlineFileText className="w-3 h-3" />
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-xs text-gray-400 w-20 shrink-0">
                          Жин хянах
                        </span>
                        {item.trackWeight ? (
                          <HiCheck className="text-emerald-500 w-4 h-4" />
                        ) : (
                          <HiX className="text-red-400 w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-xs text-gray-400 w-20 shrink-0">
                          Тоо хянах
                        </span>
                        {item.trackQuantity ? (
                          <HiCheck className="text-emerald-500 w-4 h-4" />
                        ) : (
                          <HiX className="text-red-400 w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-gray-400 w-20 shrink-0">
                          Доод хязгаар
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.alertOn}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-gray-400 w-14 shrink-0">
                          Ангилал
                        </span>
                        <span className="text-gray-700 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-gray-400 w-14 shrink-0">
                          Нэгж
                        </span>
                        <span className="text-gray-700">{item.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-lg font-bold ${parseFloat(item.stock ?? "0") < 0 ? "text-red-500" : "text-gray-900"}`}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/item/${item.id}/edit`)}
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
                        onClick={() => navigate(`/item/${item.id}/trail`)}
                        className="p-2 bg-white text-amber-500 hover:bg-amber-50 border-r border-gray-200/60 transition-colors"
                        title="Түүх"
                      >
                        <HiOutlineClipboardList className="w-4 h-4" />
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
                    colSpan={5}
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
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Код:{" "}
                    <span className="font-medium text-gray-600">
                      {item.code}
                    </span>
                    <span className="ml-2">· {item.symbology}</span>
                  </div>
                </div>
                {item.status && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[item.status]?.class}`}
                  >
                    {item.status}
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-20">Жин хянах</span>
                  {item.trackWeight ? (
                    <HiCheck className="text-emerald-500 w-4 h-4" />
                  ) : (
                    <HiX className="text-red-400 w-4 h-4" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-20">Тоо хянах</span>
                  {item.trackQuantity ? (
                    <HiCheck className="text-emerald-500 w-4 h-4" />
                  ) : (
                    <HiX className="text-red-400 w-4 h-4" />
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-20">Ангилал</span>
                  <span className="text-gray-700">{item.category}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-20">Нэгж</span>
                  <span className="text-gray-700">{item.unit}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Үлдэгдэл</span>
                <span
                  className={`font-bold text-base ${parseFloat(item.stock ?? "0") < 0 ? "text-red-500" : "text-gray-900"}`}
                >
                  {item.stock}
                </span>
              </div>
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
                <option value={50}>50</option>
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

export default Items;
