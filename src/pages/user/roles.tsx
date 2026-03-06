import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi";

// 1. Өгөгдлийн бүтэц (Interface)
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// 2. Жишээ өгөгдөл (Mock Data)
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

const Roles: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (id: string) => {
    navigate(`/roles/${id}/edit`);
  };

  // Шүүлтүүрийн логик
  const filteredList = usersList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" ? true : item.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Хуудаслалт (Pagination)
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const displayFrom = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const displayTo = Math.min(indexOfLastItem, totalItems);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Толгой хэсэг */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Эрхүүд (Roles)</h3>
            <p className="mt-1 text-gray-500 text-sm">
              Доорх хүснэгтээс мэдээллийг хянаж, удирдана уу.
            </p>
          </div>
          <button
            onClick={() => navigate("/roles/create")}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wider shadow hover:bg-slate-700 transition-all"
          >
            <span className="text-xl leading-none">+</span> Шинэ хэрэглэгч
            үүсгэх
          </button>
        </div>

        {/* Хайлт болон Шүүлтүүр */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
              >
                Шүүлтүүр{" "}
                <HiChevronDown
                  className={`ml-2 w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20 p-1">
                  {["All", "Super Admin", "Admin", "User"].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${roleFilter === role ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                    >
                      {role === "All" ? "Бүгд" : role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none text-sm text-gray-700"
                placeholder="Хайх (Нэр, и-мэйл...)"
              />
              {searchTerm && (
                <span
                  className="text-red-400 text-xs font-bold cursor-pointer hover:text-red-600 uppercase"
                  onClick={() => setSearchTerm("")}
                >
                  Арилгах
                </span>
              )}
            </div>
          </div>

          <button className="p-2.5 bg-slate-800 text-white rounded-md hover:bg-slate-700 shadow transition-colors">
            <TfiMenuAlt className="w-5 h-5" />
          </button>
        </div>

        {/* Хүснэгт */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Нэр
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Эрх
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                      onClick={() => handleSelectItem(user.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full ${
                            user.role === "Super Admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "Admin"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-2xl text-gray-300 group-hover:text-blue-600 transition-colors">
                          &rsaquo;
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Мэдээлэл олдсонгүй.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Хуудаслалт хэсэг */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Харуулах:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-1.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-2 font-medium">
              {totalItems} бичлэгээс {displayFrom}-{displayTo} харуулж байна
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Өмнөх
            </button>
            {/* Хуудасны дугаарууд */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 border rounded-md font-medium transition-all ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Дараах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
