import React, { useState } from "react";
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

interface CheckinData {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  user: string;
  details: string;
  items: Item[];
}

type Item = {
  id: string | number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
};

const checkinsList: CheckinData[] = [
  {
    id: "1",
    code: "TCI28",
    date: "Feb 23, 2026",
    status: "Draft",
    contact: "Marianna Upton",
    warehouse: "Warehouse 3",
    user: "Damdinnyam",
    details: "Барааны орлогын туршилтын тайлбар.",
    items: [
      {
        id: 1,
        name: "Test Item 01",
        code: "TI01",
        weight: "10kg",
        quantity: "5pc",
      },
      {
        id: 2,
        name: "Test Item 02",
        code: "TI02",
        weight: "2kg",
        quantity: "10pc",
      },
    ],
  },
  {
    id: "2",
    code: "TCI29",
    date: "Feb 24, 2026",
    status: "Completed",
    contact: "John Doe",
    warehouse: "Main Warehouse",
    user: "Kevin",
    details: "Агуулахад бараа орсон тухай мэдээлэл.",
    items: [
      {
        id: 3,
        name: "Bulk Cargo",
        code: "BC01",
        weight: "500kg",
        quantity: "1pc",
      },
    ],
  },
];

const Checkins: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleSelectItem = (item: CheckinData) => {
    setSelectedItem(item);
    setIsOpenDetails(true);
  };

  const filteredList = checkinsList.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0">
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Орлого</h3>
          <p className="mt-1 text-gray-600">
            Доорх хүснэгт дэх мэдээллийг шалгана уу
          </p>
        </div>

        {isOpenDetails && selectedItem && (
          <CheckInDetails
            onClose={() => setIsOpenDetails(false)}
            items={selectedItem.items}
          />
        )}

        <div className="mb-6 flex gap-4 justify-between items-center print:hidden">
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
                  <p className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase">
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
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        statusFilter === f
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {f === "All"
                        ? "Бүх орлого"
                        : f === "Draft"
                          ? "Ноорог"
                          : "Ноорог биш (Дууссан/Хүлээгдэж буй)"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex max-w-100 items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3">
              <HiOutlineSearch className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none"
                placeholder="Хайх..."
              />
              {(searchTerm || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                  }}
                  className="text-sm text-gray-400 hover:text-blue-600"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("create")}
            className="inline-flex items-center px-4 py-3 max-h-10 bg-gray-800 rounded-md font-semibold text-xs text-white uppercase hover:bg-gray-700 transition"
          >
            <HiOutlinePlus className="w-4 h-4 mr-2" />
            <p className="hidden lg:block">Шинэ орлого нэмэх</p>
          </button>
        </div>

        <div className="hidden md:block bg-white rounded-md shadow-sm overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4">Орлого</th>
                <th className="px-6 py-4">Холбоотой мэдээлэл</th>
                <th className="px-6 py-4">Тайлбар</th>
                <th className="px-6 py-4 text-right pr-10">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => handleSelectItem(item)}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-600">{item.code}</div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <div
                      className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <AiOutlineFileText className="mr-1" /> {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Харилцагч:</span>{" "}
                      {item.contact}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Агуулах:</span>{" "}
                      {item.warehouse}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Хэрэглэгч:</span>{" "}
                      {item.user}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs whitespace-normal line-clamp-2 text-sm text-gray-600 italic">
                      {item.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex rounded-md shadow-sm border border-gray-200 overflow-hidden">
                      <button className="p-2 bg-white text-blue-600 hover:bg-blue-50 border-r border-gray-200">
                        <HiOutlinePencilAlt className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white text-indigo-600 hover:bg-indigo-50 border-r border-gray-200">
                        <HiOutlineChatAlt2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white text-yellow-600 hover:bg-yellow-50 border-r border-gray-200">
                        <HiOutlineClipboardList className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white text-red-600 hover:bg-red-50">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                className="border border-gray-300 rounded-md text-sm p-1 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="ml-2">
                {displayFrom} - {displayTo} / {totalItems}
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
                  className={`px-3 py-2 border rounded-md transition-colors ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
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

export default Checkins;
