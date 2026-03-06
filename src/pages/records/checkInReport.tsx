import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";

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
  {
    id: "2",
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
];

const CheckinReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

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

  const [appliedFilters, setAppliedFilters] = useState({ ...inputs });
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

  const filteredList = checkinsList.filter((item) => {
    const matchesRef = item.code
      .toLowerCase()
      .includes(appliedFilters.reference.toLowerCase());
    const matchesContact = item.contact
      .toLowerCase()
      .includes(appliedFilters.contact.toLowerCase());
    const matchesWarehouse =
      !appliedFilters.warehouse || item.warehouse === appliedFilters.warehouse;
    const matchesUser =
      !appliedFilters.user || item.user === appliedFilters.user;
    const matchesCategory =
      !appliedFilters.category || item.category === appliedFilters.category;
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

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Орлогын тайлан
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Тайланг доороос хянана уу
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#2D3748] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 transition-all uppercase tracking-wider"
          >
            <span className="text-sm font-bold">⇅</span> Шүүлтүүр харах
          </button>
        </div>

        {/* Filter Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Эхлэх огноо
                </label>
                <input
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, startDate: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Дуусах огноо
                </label>
                <input
                  type="date"
                  value={inputs.endDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, endDate: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Үүссэн огноо (Эхлэх)
                </label>
                <input
                  type="datetime-local"
                  value={inputs.startCreatedAt}
                  onChange={(e) =>
                    setInputs({ ...inputs, startCreatedAt: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Үүссэн огноо (Дуусах)
                </label>
                <input
                  type="datetime-local"
                  value={inputs.endCreatedAt}
                  onChange={(e) =>
                    setInputs({ ...inputs, endCreatedAt: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Лавлах код
                </label>
                <input
                  type="text"
                  placeholder="Reference"
                  value={inputs.reference}
                  onChange={(e) =>
                    setInputs({ ...inputs, reference: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Харилцагч
                </label>
                <select
                  value={inputs.contact}
                  onChange={(e) =>
                    setInputs({ ...inputs, contact: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Харилцагч сонгох</option>
                  <option value="Reese Reichert PhD">Reese Reichert PhD</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Агуулах
                </label>
                <select
                  value={inputs.warehouse}
                  onChange={(e) =>
                    setInputs({ ...inputs, warehouse: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Агуулах сонгох</option>
                  <option value="Warehouse 2">Warehouse 2</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Хэрэглэгч
                </label>
                <select
                  value={inputs.user}
                  onChange={(e) =>
                    setInputs({ ...inputs, user: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Хэрэглэгч сонгох</option>
                  <option value="Prof. Merle Bergstrom">
                    Prof. Merle Bergstrom
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Ангилал
                </label>
                <select
                  value={inputs.category}
                  onChange={(e) =>
                    setInputs({ ...inputs, category: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Ангилал сонгох</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-300 text-center"
              >
                ЦЭВЭРЛЭХ
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#1A202C] text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-black text-center"
              >
                ШҮҮХ
              </button>
            </div>
          </form>
        )}

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white rounded-sm shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Орлого
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Холбоо хамаарал
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Дэлгэрэнгүй
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
                    <div
                      className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === "Completed" ? "bg-green-100 text-green-800" : item.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      <AiOutlineFileText className="mr-1" />{" "}
                      {item.status === "Draft"
                        ? "Ноорог"
                        : item.status === "Completed"
                          ? "Дууссан"
                          : "Хүлээгдэж буй"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm align-top leading-relaxed">
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
                        Харилцагч:
                      </span>{" "}
                      {item.contact}
                    </div>
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
                        Агуулах:
                      </span>{" "}
                      {item.warehouse}
                    </div>
                    <div>
                      <span className="text-gray-400 w-24 inline-block">
                        Хэрэглэгч:
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

          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t text-sm text-gray-600">
            <span>
              {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-ээс{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} хүртэл, нийт{" "}
              {totalItems} бичлэг
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Өмнөх
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Дараах
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-blue-600 text-base">
                    {item.code}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.date}
                  </div>
                </div>
                <div
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === "Completed" ? "bg-green-100 text-green-800" : item.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                >
                  <AiOutlineFileText className="mr-1" />{" "}
                  {item.status === "Draft"
                    ? "Ноорог"
                    : item.status === "Completed"
                      ? "Дууссан"
                      : "Хүлээгдэж буй"}
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <div className="flex gap-1">
                  <span className="text-gray-400 text-xs w-16 shrink-0">
                    Харилцагч
                  </span>
                  <span>{item.contact}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-400 text-xs w-16 shrink-0">
                    Агуулах
                  </span>
                  <span>{item.warehouse}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-400 text-xs w-16 shrink-0">
                    Хэрэглэгч
                  </span>
                  <span>{item.user}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic line-clamp-2">
                {item.details}
              </p>
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
            <span>
              {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded disabled:opacity-50 bg-white hover:bg-gray-50"
              >
                Өмнөх
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border rounded disabled:opacity-50 bg-white hover:bg-gray-50"
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

export default CheckinReport;
