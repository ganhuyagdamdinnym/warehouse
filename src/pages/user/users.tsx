import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const usersList: UserData[] = [
  {
    id: "1",
    name: "Ibrahim Waters",
    email: "enola47@example.org",
    phone: "(567) 288-6529",
    role: "Super Admin",
  },
  {
    id: "2",
    name: "Euna Wyman I",
    email: "hhermiston@example.net",
    phone: "+1-484-894-9068",
    role: "Admin",
  },
  {
    id: "3",
    name: "Mrs. Rosa Miller",
    email: "roslyn.jacobson@example.org",
    phone: "1-931-900-1350",
    role: "User",
  },
  {
    id: "4",
    name: "Andreanne Hoeger",
    email: "admin@tecdiary.com",
    phone: "+1-234-567-890",
    role: "Super Admin",
  },
];

const roleBadgeClass = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "bg-purple-100 text-purple-800";
    case "Admin":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (item: UserData) => {
    navigate(`/users/${item.id}/edit`);
  };

  const filteredList = usersList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" ? true : item.role === roleFilter;
    return matchesSearch && matchesRole;
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
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Users</h3>
            <p className="mt-1 text-gray-600 text-sm">
              Please review the data in the table below
            </p>
          </div>
          <button className="bg-[#1e293b] text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 uppercase tracking-wider shadow-sm hover:bg-slate-700 transition">
            <span className="text-lg">+</span>
            <span className="hidden lg:inline">Create New User</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-medium text-sm"
              >
                Filter <HiChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                  {["All", "Super Admin", "Admin", "User"].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${roleFilter === role ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                    >
                      {role}
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
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none text-sm"
                placeholder="Search"
              />
              {searchTerm && (
                <span
                  className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  Reset
                </span>
              )}
            </div>
          </div>

          <button className="p-2.5 bg-[#1e293b] text-white rounded-md hover:bg-slate-700 transition">
            <TfiMenuAlt className="w-4 h-4" />
          </button>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 font-bold text-gray-900">Name</th>
                <th className="px-6 py-4 font-bold text-gray-900">Email</th>
                <th className="px-6 py-4 font-bold text-gray-900">Role</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => handleSelectItem(user)}
                >
                  <td className="px-6 py-5 text-sm text-gray-800 font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-800">
                    {user.role}
                  </td>
                  <td className="px-6 py-5 text-right text-gray-400">
                    <span className="text-xl group-hover:text-gray-600 transition-colors">
                      ›
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {currentItems.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectItem(user)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900 text-base">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {user.email}
                  </div>
                </div>
                <span className="text-xl text-gray-300">›</span>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <span className="text-gray-400 text-xs">Phone: </span>
                {user.phone}
              </div>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleBadgeClass(user.role)}`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border-gray-300 rounded-md text-sm p-1 outline-none focus:ring-1 focus:ring-blue-500"
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 text-xs font-medium"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 border rounded-md text-xs font-medium transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 text-xs font-medium"
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

export default Users;
