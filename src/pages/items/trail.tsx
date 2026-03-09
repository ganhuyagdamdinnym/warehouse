import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrailData {
  id: string;
  createdAt: string;
  description: string;
  warehouse: string;
  quantity: string;
}

const trailList: TrailData[] = [
  {
    id: "1",
    createdAt: "2026 оны 1-р сарын 31, 12:00 ЦА",
    description: "Гаралтын бараа хувилбар шинэчлэх (22)",
    warehouse: "Агуулах 1",
    quantity: "-10.00 ш",
  },
  {
    id: "2",
    createdAt: "2026 оны 1-р сарын 31, 12:00 ЦА",
    description: "Гаралтын бараа шинэчлэх (22)",
    warehouse: "Агуулах 1",
    quantity: "-6.00 ш",
  },
  {
    id: "3",
    createdAt: "2026 оны 2-р сарын 12, 12:00 ЦА",
    description: "Орлогын бараа хувилбар шинэчлэх (50)",
    warehouse: "Агуулах 1",
    quantity: "4.00 ш",
  },
  {
    id: "4",
    createdAt: "2026 оны 2-р сарын 12, 12:00 ЦА",
    description: "Орлогын бараа шинэчлэх (50)",
    warehouse: "Агуулах 1",
    quantity: "4.00 ш",
  },
  {
    id: "5",
    createdAt: "2026 оны 3-р сарын 1, 09:00 ЦӨ",
    description: "Орлогын бараа шинэчлэх (55)",
    warehouse: "Агуулах 2",
    quantity: "8.00 ш",
  },
  {
    id: "6",
    createdAt: "2026 оны 3-р сарын 2, 11:30 ЦӨ",
    description: "Гаралтын бараа шинэчлэх (60)",
    warehouse: "Агуулах 2",
    quantity: "-3.00 ш",
  },
  {
    id: "7",
    createdAt: "2026 оны 3-р сарын 3, 14:00 ЦӨ",
    description: "Орлогын бараа хувилбар шинэчлэх (61)",
    warehouse: "Агуулах 3",
    quantity: "12.00 ш",
  },
  {
    id: "8",
    createdAt: "2026 оны 3-р сарын 4, 08:45 ЦА",
    description: "Гаралтын бараа хувилбар шинэчлэх (70)",
    warehouse: "Агуулах 1",
    quantity: "-5.00 ш",
  },
  {
    id: "9",
    createdAt: "2026 оны 3-р сарын 5, 15:15 ЦӨ",
    description: "Орлогын бараа шинэчлэх (75)",
    warehouse: "Агуулах 2",
    quantity: "20.00 ш",
  },
  {
    id: "10",
    createdAt: "2026 оны 3-р сарын 6, 10:00 ЦӨ",
    description: "Гаралтын бараа шинэчлэх (80)",
    warehouse: "Агуулах 3",
    quantity: "-2.00 ш",
  },
  {
    id: "11",
    createdAt: "2026 оны 3-р сарын 7, 13:00 ЦӨ",
    description: "Орлогын бараа хувилбар шинэчлэх (81)",
    warehouse: "Агуулах 1",
    quantity: "7.00 ш",
  },
  {
    id: "12",
    createdAt: "2026 оны 3-р сарын 8, 16:30 ЦӨ",
    description: "Гаралтын бараа шинэчлэх (90)",
    warehouse: "Агуулах 2",
    quantity: "-9.00 ш",
  },
];

const ItemTrail: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = trailList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trailList.slice(indexOfFirstItem, indexOfLastItem);
  const displayFrom = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const displayTo = Math.min(indexOfLastItem, totalItems);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
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
              onClick={() => navigate("/items/trail")}
            >
              Түүх
            </span>
            {" / 50-р тест бараа"}
          </h3>
          <p className="mt-1 text-gray-600">
            Доорх хүснэгтийн мэдээллийг хянана уу
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Үүсгэсэн огноо
                </th>
                <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Агуулах
                </th>
                <th className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  Тоо хэмжээ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-800">
                      {item.createdAt}
                    </div>
                    <div className="text-sm text-blue-500 mt-0.5">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.warehouse}
                  </td>
                  <td
                    className={`px-4 py-4 text-sm text-right font-medium ${
                      item.quantity.startsWith("-")
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
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
                Нийт {totalItems} өгөгдлөөс {displayFrom} – {displayTo} харуулж
                байна
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 border rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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

export default ItemTrail;
