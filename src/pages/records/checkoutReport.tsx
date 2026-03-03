import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CheckinData {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  user: string;
  category: string;
  details: string;
  items: any[];
}

const checkinsList: CheckinData[] = [
  {
    id: "1",
    code: "TCI28",
    date: "2026-03-03",
    status: "Draft",
    contact: "Reese Reichert PhD",
    warehouse: "Warehouse 2",
    user: "Prof. Merle Bergstrom",
    category: "Electronics",
    details: "Qui harum neque vero nam necessitatibus laudantium...",
    items: [],
  },
  // Илүү дата нэмж тестлэх боломжтой
];

const CheckoutReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // 1. Бүх оролтын утгууд
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    startCreatedAt: "",
    endCreatedAt: "",
    reference: "",
    contact: "",
    warehouse: "",
    user: "",
    category: "",
  });

  // 2. Зөвхөн Submit дарахад шүүлт хийх утгууд
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
      startCreatedAt: "",
      endCreatedAt: "",
      reference: "",
      contact: "",
      warehouse: "",
      user: "",
      category: "",
    };
    setInputs(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  // 3. Шүүх логик
  const filteredList = checkinsList.filter((item) => {
    // Reference & Contact шүүлтүүр
    const matchesRef = item.code
      .toLowerCase()
      .includes(appliedFilters.reference.toLowerCase());
    const matchesContact = item.contact
      .toLowerCase()
      .includes(appliedFilters.contact.toLowerCase());

    // Warehouse, User, Category шүүлтүүр (Хэрэв сонгосон бол)
    const matchesWarehouse =
      !appliedFilters.warehouse || item.warehouse === appliedFilters.warehouse;
    const matchesUser =
      !appliedFilters.user || item.user === appliedFilters.user;
    const matchesCategory =
      !appliedFilters.category || item.category === appliedFilters.category;

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
      matchesContact &&
      matchesWarehouse &&
      matchesUser &&
      matchesCategory &&
      matchesDate
    );
  });

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
            <h1 className="text-xl font-bold text-gray-800">Checkout Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              Please review the report below
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D3748] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 transition-all uppercase"
          >
            <span className="text-sm font-bold">⇅</span> TOGGLE FORM
          </button>
        </div>

        {/* Filter Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Dates */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Start Created At
                </label>
                <input
                  type="datetime-local"
                  value={inputs.startCreatedAt}
                  onChange={(e) =>
                    setInputs({ ...inputs, startCreatedAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  End Created At
                </label>
                <input
                  type="datetime-local"
                  value={inputs.endCreatedAt}
                  onChange={(e) =>
                    setInputs({ ...inputs, endCreatedAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              {/* Selects & Inputs */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Reference
                </label>
                <input
                  type="text"
                  placeholder="Reference"
                  value={inputs.reference}
                  onChange={(e) =>
                    setInputs({ ...inputs, reference: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Contact
                </label>
                <select
                  value={inputs.contact}
                  onChange={(e) =>
                    setInputs({ ...inputs, contact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">Contact</option>
                  <option value="Reese Reichert PhD">Reese Reichert PhD</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Warehouse
                </label>
                <select
                  value={inputs.warehouse}
                  onChange={(e) =>
                    setInputs({ ...inputs, warehouse: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">Warehouse</option>
                  <option value="Warehouse 2">Warehouse 2</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">User</option>
                  <option value="Prof. Merle Bergstrom">
                    Prof. Merle Bergstrom
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Category
                </label>
                <select
                  value={inputs.category}
                  onChange={(e) =>
                    setInputs({ ...inputs, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">Category</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-300"
              >
                RESET
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#1A202C] text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-black"
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
                  Checkin
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Relations
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
                      Draft: <span className="text-green-600 font-bold">✓</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm align-top leading-relaxed">
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
                        Contact:
                      </span>{" "}
                      {item.contact}
                    </div>
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
                        Warehouse:
                      </span>{" "}
                      {item.warehouse}
                    </div>
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
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
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
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

export default CheckoutReport;
