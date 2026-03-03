import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Интерфэйс - Дата бүтэцтэй ижил байх ёстой
interface TransferData {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  user: string;
  to: string;
  from: string;
  details: string;
}

// Dummy Data
const transferList: TransferData[] = [
  {
    id: "1",
    code: "TCI28",
    date: "2026-02-23", // Date format-ийг ISO болгох нь шүүлт хийхэд хялбар
    status: "Draft",
    to: "warehouse1 center",
    from: "warehouse4 jj",
    user: "Damdinnyam",
    details:
      "Rerum mollitia doloribus necessitatibus rerum cumque blanditiis aut est.",
  },
  {
    id: "2",
    code: "TCI29",
    date: "2026-03-01",
    status: "Completed",
    to: "warehouse2 center",
    from: "warehouse1 center",
    user: "Prof. Merle Bergstrom",
    details: "Example detail description.",
  },
];

const TransferReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Оролтын утгууд
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    reference: "",
    toWarehouse: "",
    fromWarehouse: "",
    user: "",
    status: "",
  });

  // Submit дарахад шүүлт хийх утгууд
  const [appliedFilters, setAppliedFilters] = useState({ ...inputs });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ ...inputs });
    setCurrentPage(1);
  };

  const handleReset = () => {
    const cleared = {
      startDate: "",
      endDate: "",
      reference: "",
      toWarehouse: "",
      fromWarehouse: "",
      user: "",
      status: "",
    };
    setInputs(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  // Шүүх логик
  const filteredList = transferList.filter((item) => {
    const matchesRef = item.code
      .toLowerCase()
      .includes(appliedFilters.reference.toLowerCase());
    const matchesTo =
      !appliedFilters.toWarehouse || item.to === appliedFilters.toWarehouse;
    const matchesFrom =
      !appliedFilters.fromWarehouse ||
      item.from === appliedFilters.fromWarehouse;
    const matchesUser =
      !appliedFilters.user || item.user === appliedFilters.user;
    const matchesStatus =
      !appliedFilters.status || item.status === appliedFilters.status;

    // Date шүүлтүүр
    const itemDate = new Date(item.date).getTime();
    const start = appliedFilters.startDate
      ? new Date(appliedFilters.startDate).getTime()
      : -Infinity;
    const end = appliedFilters.endDate
      ? new Date(appliedFilters.endDate).getTime()
      : Infinity;
    const matchesDate = itemDate >= start && itemDate <= end;

    return (
      matchesRef &&
      matchesTo &&
      matchesFrom &&
      matchesUser &&
      matchesStatus &&
      matchesDate
    );
  });

  // Хуудаслалт
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Transfer Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              Please review the transfer records below
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D3748] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 transition-all uppercase"
          >
            ⇅ TOGGLE FORM
          </button>
        </div>

        {/* Filter Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  End Date
                </label>
                <input
                  type="date"
                  value={inputs.endDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Reference (Code)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TCI"
                  value={inputs.reference}
                  onChange={(e) =>
                    setInputs({ ...inputs, reference: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Status
                </label>
                <select
                  value={inputs.status}
                  onChange={(e) =>
                    setInputs({ ...inputs, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  From Warehouse
                </label>
                <select
                  value={inputs.fromWarehouse}
                  onChange={(e) =>
                    setInputs({ ...inputs, fromWarehouse: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  <option value="warehouse4 jj">warehouse4 jj</option>
                  <option value="warehouse1 center">warehouse1 center</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  To Warehouse
                </label>
                <select
                  value={inputs.toWarehouse}
                  onChange={(e) =>
                    setInputs({ ...inputs, toWarehouse: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  <option value="warehouse1 center">warehouse1 center</option>
                  <option value="warehouse2 center">warehouse2 center</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  User
                </label>
                <select
                  value={inputs.user}
                  onChange={(e) =>
                    setInputs({ ...inputs, user: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="">Select User</option>
                  <option value="Damdinnyam">Damdinnyam</option>
                  <option value="Prof. Merle Bergstrom">
                    Prof. Merle Bergstrom
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-300"
              >
                RESET
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#1A202C] text-white text-xs font-bold rounded uppercase hover:bg-black"
              >
                SUBMIT
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Transfer Info
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Route & User
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="font-bold text-blue-600">{item.code}</div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                    <div className="text-xs mt-1">
                      Status:{" "}
                      <span
                        className={`font-bold ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm align-top leading-relaxed">
                    <div>
                      <span className="text-gray-400 w-20 inline-block">
                        From:
                      </span>{" "}
                      {item.from}
                    </div>
                    <div>
                      <span className="text-gray-400 w-20 inline-block">
                        To:
                      </span>{" "}
                      {item.to}
                    </div>
                    <div>
                      <span className="text-gray-400 w-20 inline-block">
                        User:
                      </span>{" "}
                      {item.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 align-top max-w-md">
                    {item.details}
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Өгөгдөл олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t text-sm text-gray-600">
            <span>
              Showing{" "}
              {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
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

export default TransferReport;
