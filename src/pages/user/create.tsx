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
    details:
      "Qui harum neque vero nam necessitatibus laudantium. Modi soluta inventore id sapiente voluptatem totam.",
  },
  {
    id: "2",
    code: "TCI27",
    date: "2026-03-01",
    status: "Completed",
    contact: "John Doe",
    warehouse: "Main WH",
    user: "Kevin",
    category: "Food",
    details: "Labore totam et aut et. Eos molestias qui cumque rerum veniam.",
  },
];

const CheckinReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);

  // 1. Input States (Бичих үед өөрчлөгдөнө)
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    reference: "",
    contact: "",
    warehouse: "",
    user: "",
    category: "",
  });

  // 2. Applied Filter States (Submit дарахад хадгалагдана)
  const [filters, setFilters] = useState({ ...inputs });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...inputs });
    setCurrentPage(1);
  };

  const handleReset = () => {
    const empty = {
      startDate: "",
      endDate: "",
      reference: "",
      contact: "",
      warehouse: "",
      user: "",
      category: "",
    };
    setInputs(empty);
    setFilters(empty);
    setCurrentPage(1);
  };

  // 3. Filtering Logic
  const filteredList = checkinsList.filter((item) => {
    const matchesRef = item.code
      .toLowerCase()
      .includes(filters.reference.toLowerCase());
    const matchesContact = item.contact
      .toLowerCase()
      .includes(filters.contact.toLowerCase());
    const matchesWH =
      !filters.warehouse || item.warehouse === filters.warehouse;
    const matchesUser = !filters.user || item.user === filters.user;
    const matchesCat = !filters.category || item.category === filters.category;

    // Date range logic
    const itemDate = new Date(item.date).getTime();
    const start = filters.startDate
      ? new Date(filters.startDate).getTime()
      : -Infinity;
    const end = filters.endDate
      ? new Date(filters.endDate).getTime()
      : Infinity;

    return (
      matchesRef &&
      matchesContact &&
      matchesWH &&
      matchesUser &&
      matchesCat &&
      itemDate >= start &&
      itemDate <= end
    );
  });

  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Input Class (Дахин ашиглах зорилгоор)
  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Checkin Report</h1>
            <p className="text-sm text-gray-500">
              Please review the data in the table below
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D3748] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 transition-all uppercase tracking-wider"
          >
            <span>⇅</span> Toggle Form
          </button>
        </div>

        {/* Filter Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Start Date
                </label>
                <input
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, startDate: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  End Date
                </label>
                <input
                  type="date"
                  value={inputs.endDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, endDate: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Reference
                </label>
                <input
                  type="text"
                  placeholder="Reference"
                  value={inputs.reference}
                  onChange={(e) =>
                    setInputs({ ...inputs, reference: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Contact
                </label>
                <input
                  type="text"
                  placeholder="Contact"
                  value={inputs.contact}
                  onChange={(e) =>
                    setInputs({ ...inputs, contact: e.target.value })
                  }
                  className={inputStyle}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Warehouse
                </label>
                <select
                  value={inputs.warehouse}
                  onChange={(e) =>
                    setInputs({ ...inputs, warehouse: e.target.value })
                  }
                  className={inputStyle}
                >
                  <option value="">All Warehouses</option>
                  <option value="Warehouse 2">Warehouse 2</option>
                  <option value="Main WH">Main WH</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  User
                </label>
                <select
                  value={inputs.user}
                  onChange={(e) =>
                    setInputs({ ...inputs, user: e.target.value })
                  }
                  className={inputStyle}
                >
                  <option value="">All Users</option>
                  <option value="Prof. Merle Bergstrom">
                    Prof. Merle Bergstrom
                  </option>
                  <option value="Kevin">Kevin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Category
                </label>
                <select
                  value={inputs.category}
                  onChange={(e) =>
                    setInputs({ ...inputs, category: e.target.value })
                  }
                  className={inputStyle}
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2 bg-gray-100 rounded-md text-sm font-bold text-gray-600 hover:bg-gray-200 uppercase transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-2 bg-[#1A202C] text-white text-xs font-bold rounded-md uppercase tracking-widest hover:bg-black transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Checkin
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Relations
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-blue-600">{item.code}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                      <div className="text-[10px] mt-1 text-green-600 font-bold uppercase flex items-center gap-1">
                        <span className="text-sm">✓</span> Draft
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm align-top">
                      <div className="flex">
                        <span className="text-gray-400 w-24 shrink-0">
                          Contact:
                        </span>{" "}
                        <span className="text-gray-700">{item.contact}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24 shrink-0">
                          Warehouse:
                        </span>{" "}
                        <span className="text-gray-700">{item.warehouse}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24 shrink-0">
                          User:
                        </span>{" "}
                        <span className="text-gray-700">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 align-top">
                      <p className="line-clamp-3 italic leading-relaxed">
                        {item.details}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              Showing{" "}
              {filteredList.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * itemsPerPage, filteredList.length)} of{" "}
              {filteredList.length} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={
                  currentPage >= Math.ceil(filteredList.length / itemsPerPage)
                }
                className="px-4 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
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
