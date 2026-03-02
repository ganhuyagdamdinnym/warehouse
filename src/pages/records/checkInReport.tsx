import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePlus } from "react-icons/hi";
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
  items: Item[]; // Added this
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
    details: "Rerum mollitia doloribus necessitatibus rerum cumque.",
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
    details:
      "Labore totam et aut et. Eos molestias qui cumque rerum veniam. Labore totam et aut et. Eos molestias qui cumque rerum veniam.",
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

const CheckinReport: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); // "All", "Draft", "Non-Draft"

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleSelectItem = (item: CheckinData) => {
    setSelectedItem(item);
    setIsOpenDetails(true); // Now correctly opens the modal
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

  // Pagination бодох
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
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6 w-full flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Checkins</h3>
            <p className="mt-1 text-gray-600">
              Please review the data in the table below
            </p>
          </div>
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
            <button
              onClick={() => navigate("create")}
              className="inline-flex items-center px-4 py-3 bg-gray-800 rounded-md font-semibold text-xs text-white uppercase hover:bg-gray-700 transition"
            >
              <HiOutlinePlus className="w-4 h-4 mr-2" />
              TOGGLE FORM
            </button>
          </div>
        </div>

        {isOpenDetails && selectedItem && (
          <CheckInDetails
            onClose={() => setIsOpenDetails(false)}
            items={selectedItem.items}
          />
        )}

        {/* Table Section */}
        <div className="bg-white -mx-4 md:mx-0 md:rounded-md shadow-sm overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4">Checkin</th>
                <th className="px-6 py-4">Relations</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* 3. MAP ашиглан жагсаалтыг үүсгэх */}
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
                      <span className="text-gray-400 w-20">Contact:</span>{" "}
                      {item.contact}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">Warehouse:</span>{" "}
                      {item.warehouse}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 w-20">User:</span>{" "}
                      {item.user}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs whitespace-normal line-clamp-5 text-sm text-gray-600 italic">
                      {item.details}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            {/* Динамик мэдээлэл: Өгөгдлөөс хамаарч тоо нь өөрчлөгдөнө */}
            <div className="flex items-center">
              <span className="mr-2">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Хэмжээ өөрчлөгдөхөд 1-р хуудас руу буцна
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

            {/* Хуудас солих товчлуурууд */}
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {/* Хуудасны тоогоор товчлуур үүсгэх */}
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

export default CheckinReport;
