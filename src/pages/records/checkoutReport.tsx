// pages/reports/CheckoutReport.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { getCheckouts } from "../../api/checkout/checkout_api";
import { getContacts } from "../../api/contact/contact";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import type { Checkout } from "../../models/types/checkout";

const CheckoutReport: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    reference: "",
    contact: "",
    warehouse: "",
    status: "",
  });

  const [list, setList] = useState<Checkout[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [contactList, setContactList] = useState<
    { id: string; name: string }[]
  >([]);
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    Promise.all([getContacts({ limit: 100 }), getWarehouses({ limit: 100 })])
      .then(([c, w]) => {
        setContactList(c.data as { id: string; name: string }[]);
        setWarehouseList(w.data as { id: string; name: string }[]);
      })
      .catch(console.error);
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getCheckouts({
        search: inputs.reference,
        status: inputs.status || "All",
        page,
        limit: itemsPerPage,
      });
      let filtered = res.data;
      if (inputs.contact)
        filtered = filtered.filter((c) =>
          c.contact?.toLowerCase().includes(inputs.contact.toLowerCase()),
        );
      if (inputs.warehouse)
        filtered = filtered.filter((c) =>
          c.warehouse?.toLowerCase().includes(inputs.warehouse.toLowerCase()),
        );
      if (inputs.startDate)
        filtered = filtered.filter(
          (c) => new Date(c.date) >= new Date(inputs.startDate),
        );
      if (inputs.endDate)
        filtered = filtered.filter(
          (c) => new Date(c.date) <= new Date(inputs.endDate),
        );
      setList(filtered);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1);
  };
  const handleReset = () => {
    const cleared = {
      startDate: "",
      endDate: "",
      reference: "",
      contact: "",
      warehouse: "",
      status: "",
    };
    setInputs(cleared);
    setCurrentPage(1);
    setTimeout(() => fetchData(1), 0);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const displayFrom = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, total);

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white";
  const statusBadge = (s: string) =>
    s === "Completed"
      ? "bg-green-100 text-green-800"
      : s === "Pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";
  const statusLabel = (s: string) =>
    s === "Completed"
      ? "Дууссан"
      : s === "Pending"
        ? "Хүлээгдэж буй"
        : "Ноорог";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
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
                Зарлагын тайлан
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

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                  {contactList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
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
                  {warehouseList.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
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
                  <option value="">Бүгд</option>
                  <option value="Draft">Ноорог</option>
                  <option value="Pending">Хүлээгдэж буй</option>
                  <option value="Completed">Дууссан</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-300"
              >
                ЦЭВЭРЛЭХ
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-[#1A202C] text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-black"
              >
                ШҮҮХ
              </button>
            </div>
          </form>
        )}

        <div className="hidden md:block bg-white rounded-sm shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase">
                  Зарлага
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
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-blue-600">{item.code}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                      <div
                        className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge(item.status)}`}
                      >
                        <AiOutlineFileText className="mr-1" />
                        {statusLabel(item.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm align-top leading-relaxed">
                      <div>
                        <span className="text-gray-400 w-24 inline-block">
                          Харилцагч:
                        </span>
                        {item.contact ?? "—"}
                      </div>
                      <div>
                        <span className="text-gray-400 w-24 inline-block">
                          Агуулах:
                        </span>
                        {item.warehouse ?? "—"}
                      </div>
                      <div>
                        <span className="text-gray-400 w-24 inline-block">
                          Хэрэглэгч:
                        </span>
                        {item.user ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 align-top max-w-md">
                      {item.details ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t text-sm text-gray-600">
            <span>
              {displayFrom}–{displayTo} / нийт {total} бичлэг
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 border rounded transition-colors ${currentPage === i + 1 ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
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

        <div className="flex flex-col gap-3 md:hidden">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Уншиж байна...
            </div>
          ) : list.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Өгөгдөл олдсонгүй
            </div>
          ) : (
            list.map((item) => (
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
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge(item.status)}`}
                  >
                    <AiOutlineFileText className="mr-1" />
                    {statusLabel(item.status)}
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-3">
                  <div className="flex gap-1">
                    <span className="text-gray-400 text-xs w-20 shrink-0">
                      Харилцагч
                    </span>
                    <span>{item.contact ?? "—"}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-gray-400 text-xs w-20 shrink-0">
                      Агуулах
                    </span>
                    <span>{item.warehouse ?? "—"}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-gray-400 text-xs w-20 shrink-0">
                      Хэрэглэгч
                    </span>
                    <span>{item.user ?? "—"}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic line-clamp-2">
                  {item.details ?? "—"}
                </p>
              </div>
            ))
          )}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
            <span>
              {displayFrom}–{displayTo} / {total}
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

export default CheckoutReport;
