import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch, HiOutlinePlus, HiChevronDown } from "react-icons/hi";
import { CheckInDetails } from "../../components/details/checkInDetails";

// 1. Updated Interface to match the image data
interface CheckinData {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status: "Draft" | "Completed" | "Pending"; // Keeping logic for your filters
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
    items: [],
  },
  {
    id: "3",
    name: "Mrs. Rosa Miller",
    email: "roslyn.jacobson@example.org",
    phone: "1-931-900-1350",
    details: "Animi architecto laboriosam placeat dignissimos voluptas ad.",
    status: "Pending",
    items: [],
  },
  {
    id: "4",
    name: "Angela Little",
    email: "alda46@example.org",
    phone: "(631) 447-1287",
    details: "Et non molestias repellendus.",
    status: "Completed",
    items: [],
  },
  {
    id: "5",
    name: "Prof. Kelsie Fay",
    email: "kellie65@example.org",
    phone: "(828) 652-0864",
    details: "Fuga non amet et veritatis illum vitae necessitatibus error.",
    status: "Draft",
    items: [],
  },
  {
    id: "6",
    name: "Prof. Kelsie Fay",
    email: "kellie65@example.org",
    phone: "(828) 652-0864",
    details: "Fuga non amet et veritatis illum vitae necessitatibus error.",
    status: "Draft",
    items: [],
  },
];

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSelectItem = (item: CheckinData) => {
    navigate(`/contacts/${item.id}/edit`);
  };

  const filteredList = checkinsList.filter((item) => {
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
          <h3 className="text-lg font-bold text-gray-900">Activities</h3>
          <p className="mt-1 text-gray-600">
            Please review the data in the table below
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center print:hidden">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="flex items-center flex-1 bg-white shadow-sm rounded-md border border-gray-300 px-3">
              <HiOutlineSearch className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 border-0 focus:ring-0 outline-none"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Created at
                </th>
                <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Description
                </th>
                {/* <th className="px-4 py-3 text-sm font-bold text-gray-900">
                  Details
                </th> */}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectItem(item)}
                >
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {item.email}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-xs">
                    {item.details}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-400">
                    <span className="text-lg">›</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* --- END TABLE --- */}

        {/* Pagination logic remains the same below... */}
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

export default Activities;
