import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";

interface AdjustmentData {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  user: string;
  details: string;
}

const AdjustmentsList: AdjustmentData[] = [
  {
    id: "1",
    code: "TCI28",
    date: "2026-02-23",
    status: "Draft",
    contact: "Marianna Upton",
    warehouse: "Агуулах 3",
    user: "Damdinnyam",
    details:
      "Rerum mollitia doloribus necessitatibus rerum cumque blanditiis aut est.",
  },
  {
    id: "2",
    code: "ADJ99",
    date: "2026-03-01",
    status: "Completed",
    contact: "Reese Reichert PhD",
    warehouse: "Агуулах 2",
    user: "Prof. Merle Bergstrom",
    details: "Тооллогын зөрүүгээс шалтгаалж үлдэгдэл зассан.",
  },
];

const AdjustmentReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    reference: "",
    contact: "",
    warehouse: "",
    user: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...inputs });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      contact: "",
      warehouse: "",
      user: "",
      status: "",
    };
    setInputs(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const filteredList = AdjustmentsList.filter((item) => {
    const matchesRef = item.code
      .toLowerCase()
      .includes(appliedFilters.reference.toLowerCase());
    const matchesContact =
      !appliedFilters.contact || item.contact === appliedFilters.contact;
    const matchesWarehouse =
      !appliedFilters.warehouse || item.warehouse === appliedFilters.warehouse;
    const matchesUser =
      !appliedFilters.user || item.user === appliedFilters.user;
    const matchesStatus =
      !appliedFilters.status || item.status === appliedFilters.status;
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
      matchesStatus &&
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

  const statusBadgeClass = (status: string) =>
    status === "Completed"
      ? "bg-green-100 text-green-800"
      : status === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

  // Төлөвийг монголоор харуулах туслах функц
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Draft":
        return "Ноорог";
      case "Completed":
        return "Дууссан";
      case "Pending":
        return "Хүлээгдэж буй";
      default:
        return status;
    }
  };

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
                Засварлалтын тайлан
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Бараа материалын үлдэгдлийн засварлалтыг доороос хянана уу
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#2D3748] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 transition-all uppercase tracking-wider"
          >
            <span className="text-sm font-bold">⇅</span> Шүүлтүүр
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
                  Лавлах код
                </label>
                <input
                  type="text"
                  placeholder="ж.нь: TCI"
                  value={inputs.reference}
                  onChange={(e) =>
                    setInputs({ ...inputs, reference: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Төлөв
                </label>
                <select
                  value={inputs.status}
                  onChange={(e) =>
                    setInputs({ ...inputs, status: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Бүх төлөв</option>
                  <option value="Draft">Ноорог</option>
                  <option value="Completed">Дууссан</option>
                  <option value="Pending">Хүлээгдэж буй</option>
                </select>
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
                  <option value="Marianna Upton">Marianna Upton</option>
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
                  <option value="Warehouse 2">Агуулах 2</option>
                  <option value="Warehouse 3">Агуулах 3</option>
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
                  <option value="Damdinnyam">Damdinnyam</option>
                  <option value="Prof. Merle Bergstrom">
                    Prof. Merle Bergstrom
                  </option>
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
                  Засварлалт
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Холбогдох мэдээлэл
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Тайлбар
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
                      className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadgeClass(item.status)}`}
                    >
                      <AiOutlineFileText className="mr-1" />{" "}
                      {getStatusLabel(item.status)}
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
              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Таны хайсан өгөгдөл олдсонгүй.
                  </td>
                </tr>
              )}
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
          {currentItems.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-500 text-sm">
              Таны хайсан өгөгдөл олдсонгүй.
            </div>
          )}
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
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadgeClass(item.status)}`}
                >
                  <AiOutlineFileText className="mr-1" />{" "}
                  {getStatusLabel(item.status)}
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

export default AdjustmentReport;
