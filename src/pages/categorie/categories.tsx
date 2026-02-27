import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch, HiOutlinePlus, HiChevronDown } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi"; // For the menu icon in the image

// 1. Updated Interface for Categories
interface CategoryData {
  id: string;
  name: string;
  code: string;
  childOf: string;
  status: "Draft" | "Completed" | "Pending";
}

// Dummy data filled to match the image sequence
const categoriesList: CategoryData[] = [
  {
    id: "20",
    name: "Category 20",
    code: "C20",
    childOf: "Main Inventory",
    status: "Completed",
  },
  {
    id: "19",
    name: "Category 19",
    code: "C19",
    childOf: "Main Inventory",
    status: "Completed",
  },
  {
    id: "18",
    name: "Category 18",
    code: "C18",
    childOf: "Sub Store",
    status: "Completed",
  },
  {
    id: "17",
    name: "Category 17",
    code: "C17",
    childOf: "Sub Store",
    status: "Completed",
  },
  {
    id: "16",
    name: "Category 16",
    code: "C16",
    childOf: "Electronics",
    status: "Completed",
  },
  {
    id: "15",
    name: "Category 15",
    code: "C15",
    childOf: "Electronics",
    status: "Completed",
  },
  {
    id: "14",
    name: "Category 14",
    code: "C14",
    childOf: "General",
    status: "Completed",
  },
];

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (item: CategoryData) => {
    navigate(`/categories/${item.id}/edit`);
  };

  const filteredList = categoriesList.filter((item) => {
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
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Categories</h3>
          <p className="mt-1 text-gray-600">
            Please review the data in the table below
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-medium"
              >
                Filter <HiChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Draft");
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    Draft Only
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none"
                placeholder="Search"
              />
              <span
                className="text-gray-400 text-sm cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                Reset
              </span>
            </div>
          </div>

          <button className="p-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition">
            <TfiMenuAlt className="w-4 h-4" />
          </button>
        </div>

        {/* --- TABLE STYLED LIKE THE CATEGORIES IMAGE --- */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-bold text-gray-900 w-1/3">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900 w-1/4">
                  Code
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-900">
                  Child of
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
                  <td className="px-6 py-5 text-sm text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-800">
                    {item.code}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-800">
                    {item.childOf}
                  </td>
                  <td className="px-6 py-5 text-right text-gray-400">
                    <span className="text-lg">›</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">Show</span>
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
                Showing {displayFrom} to {displayTo} of {totalItems} entries
              </span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
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
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
