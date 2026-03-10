import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineClipboardList,
  HiOutlineFilter,
  HiOutlineChevronRight,
  HiOutlinePlus,
} from "react-icons/hi";

// Interface matches your data structure
interface CheckinData {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status: "Draft" | "Completed" | "Pending";
  createdAt: string; // Added for the table
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
    name: "Ibrahim Waters",
    email: "enola47@example.org",
    phone: "(567) 288-6529",
    details: "Odit libero enim aut in sunt.",
    status: "Draft",
    createdAt: "2024-03-10",
    items: [
      {
        id: 1,
        name: "Test Item 01",
        code: "TI01",
        weight: "10kg",
        quantity: "5pc",
      },
    ],
  },
  {
    id: "2",
    name: "Euna Wyman I",
    email: "hhermiston@example.net",
    phone: "+1-484-894-9068",
    details: "Deserunt nisi est quibusdam voluptas qui ab totam.",
    status: "Completed",
    createdAt: "2024-03-09",
    items: [],
  },
  {
    id: "3",
    name: "Mrs. Rosa Miller",
    email: "roslyn.jacobson@example.org",
    phone: "1-931-900-1350",
    details: "Animi architecto laboriosam placeat dignissimos voluptas ad.",
    status: "Pending",
    createdAt: "2024-03-08",
    items: [],
  },
  {
    id: "4",
    name: "Angela Little",
    email: "alda46@example.org",
    phone: "(631) 447-1287",
    details: "Et non molestias repellendus.",
    status: "Completed",
    createdAt: "2024-03-07",
    items: [],
  },
];

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredList = checkinsList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Status Badge Styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Draft":
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-600/20";
      case "Pending":
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineClipboardList className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Үйл ажиллагаа
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Системийн нийт бүртгэл болон үйл ажиллагааны түүхийг хянах.
            </p>
          </div>
          <button
            onClick={() => navigate("/activities/create")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Шинэ бүртгэл
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <HiOutlineSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Нэр эсвэл имэйлээр хайх..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 shadow-sm">
            <HiOutlineFilter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm text-gray-700 outline-none py-2 pr-4 bg-transparent cursor-pointer"
            >
              <option value="All">Бүх төлөв</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Огноо
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Хэрэглэгч
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Тайлбар
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Төлөв
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/activities/${item.id}/edit`)}
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {item.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                        {item.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${getStatusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <HiOutlineChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <span>Харуулах:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
              >
                {[5, 10, 20].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span>Нийт: {totalItems}</span>
            </div>

            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
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

export default Activities;
