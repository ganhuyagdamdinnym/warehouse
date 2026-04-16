import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineSearch,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
} from "react-icons/hi";
import { HiOutlineHomeModern, HiOutlineArrowRight } from "react-icons/hi2";
import { Confirmation } from "../../components/confirmation";
import {
  getTransfer,
  updateTransfer,
  deleteTransfer,
} from "../../api/transfer/transfer";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { getItems } from "../../api/item/item";

interface LineRow {
  id: number;
  itemId: number;
  name: string;
  code: string;
  quantity: string;
  unit: string;
}

type TransferStatus = "Draft" | "Pending" | "Completed";

const TransferEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");
  const [fromWarehouseId, setFromWarehouseId] = useState<number | "">("");
  const [toWarehouseId, setToWarehouseId] = useState<number | "">("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<TransferStatus>("Draft");
  const [lineItems, setLineItems] = useState<LineRow[]>([]);

  // Real data
  const [warehouseList, setWarehouseList] = useState<
    { id: number; name: string }[]
  >([]);
  const [itemOptions, setItemOptions] = useState<
    { id: string; name: string; internalCode?: string }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = itemOptions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.internalCode ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Fetch transfer data
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getTransfer(id);
        if (cancelled) return;
        setDate(data.date ? data.date.split("T")[0] : "");
        setCode(data.code || "");
        setFromWarehouseId(
          data.fromWarehouseId ? Number(data.fromWarehouseId) : "",
        );
        setToWarehouseId(data.toWarehouseId ? Number(data.toWarehouseId) : "");
        setDetails(data.details || "");
        setStatus((data.status as TransferStatus) || "Draft");
        setLineItems(
          (data.items || []).map((it: any, i: number) => ({
            id: i + 1,
            name: it.name || "",
            itemId: Number(it.itemId),
            code: it.code || "",
            weight: it.weight || "1",
            quantity: it.quantity || "1",
            unit: it.unit || "Ширхэг",
          })),
        );
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Өгөгдөл ачаалахад алдаа.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch warehouses and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehouseRes, itemRes] = await Promise.all([
          getWarehouses({ limit: 100 }),
          getItems({ limit: 100 }),
        ]);
        setWarehouseList(
          warehouseRes.data.map((w: any) => ({ ...w, id: Number(w.id) })),
        );
        setItemOptions(
          itemRes.data as { id: string; name: string; internalCode?: string }[],
        );
      } catch (err) {
        console.error("Өгөгдөл татахад алдаа:", err);
      }
    };
    fetchData();
  }, []);

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addItem = (item: {
    id: string;
    name: string;
    internalCode?: string;
  }) => {
    const newRow: LineRow = {
      id: Date.now(),
      name: item.name,
      itemId: Number(item.id),
      code: item.internalCode || item.name.slice(0, 20) || "ITEM",
      quantity: "1",
      unit: "Ширхэг",
    };
    setLineItems((prev) => [...prev, newRow]);
    setSearchTerm("");
    setSelectedValue("");
    setIsOpen(false);
  };

  const removeLineItem = (rowId: number) => {
    setLineItems((prev) => prev.filter((r) => r.id !== rowId));
  };

  const updateLineItem = (
    rowId: number,
    field: keyof LineRow,
    value: string,
  ) => {
    setLineItems((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    if (!date || !fromWarehouseId || !toWarehouseId) {
      setError("Огноо, гарах болон орох агуулах заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await updateTransfer(id, {
        code: code.trim() || `TRF${Date.now()}`,
        date,
        status,
        fromWarehouseId: Number(fromWarehouseId),
        toWarehouseId: Number(toWarehouseId),
        details: details.trim() || undefined,
        items: lineItems.map((row) => ({
          name: row.name,
          itemId: row.itemId,
          code: row.code,
          quantity: row.quantity,
          unit: row.unit,
        })),
      });
      navigate("/transfer", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шинэчлэхэд алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTransfer(id);
      setShowConfirm(false);
      navigate("/transfer", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа.");
    }
  };

  // ── Status checkbox config ──────────────────────────────────────────
  const statusAction: Record<
    "Draft" | "Pending",
    {
      label: string;
      description: string;
      nextStatus: TransferStatus;
      checked: boolean;
      colorClass: string;
      bgClass: string;
      borderClass: string;
    }
  > = {
    Draft: {
      label: "Баталгаажуулах",
      description: "Шилжүүлгийг баталгаажуулж Pending болгоно",
      nextStatus: "Pending",
      checked: false,
      colorClass: "text-indigo-900",
      bgClass: "bg-indigo-50/50",
      borderClass: "border-indigo-100/50",
    },
    Pending: {
      label: "Шилжүүлгийг дуусгах",
      description: "Шилжүүлгийг гүйцэтгэсэн гэж тэмдэглэнэ",
      nextStatus: "Completed",
      checked: false,
      colorClass: "text-emerald-900",
      bgClass: "bg-emerald-50/50",
      borderClass: "border-emerald-100/50",
    },
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none";
  const labelClass = "text-sm font-semibold text-gray-700";

  if (loading) {
    return (
      <div className="md:flex-1 md:px-4 py-8 md:p-8 flex items-center justify-center">
        <p className="text-gray-500">Уншиж байна...</p>
      </div>
    );
  }

  const action = status !== "Completed" ? statusAction[status] : null;

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Шилжүүлгийг устгах уу?"
          description="Та энэ шилжүүлгийн бүртгэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй бөгөөд үлдэгдэлд нөлөөлж болзошгүй."
        />
      )}

      <div>
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/transfer")}
                    className="text-blue-600 hover:underline"
                  >
                    Шилжүүлэг
                  </button>
                  <span className="text-gray-400 font-light">/</span>
                  <span className="text-gray-500 font-medium">Засах</span>
                </div>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Агуулах хоорондын шилжүүлгийн мэдээллийг шинэчилнэ үү
              </p>
            </div>

            {/* Current status badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                status === "Draft"
                  ? "bg-gray-100 text-gray-600 border-gray-200"
                  : status === "Pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "Draft"
                    ? "bg-gray-400"
                    : status === "Pending"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                }`}
              />
              {status === "Draft"
                ? "Ноорог"
                : status === "Pending"
                  ? "Хүлээгдэж байна"
                  : "Дууссан"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl space-y-8 shadow-sm">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-6 border-b border-gray-50">
                <div className="relative group">
                  <label className={labelClass}>Огноо</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineCalendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      className={`${baseInputClass} pl-10`}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className={labelClass}>Лавлах дугаар</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineTag className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="TR-2024-001"
                      className={`${baseInputClass} pl-10`}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Logic: From -> To */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 w-full group">
                  <label className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 block">
                    Хаанаас (Гарах агуулах)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <HiOutlineHomeModern className="w-4 h-4" />
                    </div>
                    <select
                      className={`${baseInputClass} pl-10 border-blue-200 bg-white appearance-none cursor-pointer`}
                      value={fromWarehouseId}
                      onChange={(e) =>
                        setFromWarehouseId(Number(e.target.value))
                      }
                    >
                      <option value="">Сонгох...</option>
                      {warehouseList.map((wh) => (
                        <option key={wh.id} value={wh.name}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                  </div>
                </div>

                <div className="hidden lg:flex bg-white p-3 rounded-full shadow-md text-blue-600 border border-blue-100">
                  <HiOutlineArrowRight className="w-6 h-6" />
                </div>

                <div className="flex-1 w-full group">
                  <label className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 block">
                    Хаашаа (Орох агуулах)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <HiOutlineHomeModern className="w-4 h-4" />
                    </div>
                    <select
                      className={`${baseInputClass} pl-10 border-blue-200 bg-white appearance-none cursor-pointer`}
                      value={toWarehouseId}
                      onChange={(e) => setToWarehouseId(Number(e.target.value))}
                    >
                      <option value="">Сонгох...</option>
                      {warehouseList.map((wh) => (
                        <option key={wh.id} value={wh.name}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2">
                <label className={labelClass}>
                  Шилжүүлэх бараа материалын жагсаалт
                </label>
                <div className="mt-3 bg-gray-50/80 p-5 rounded-xl border border-gray-200/60 shadow-inner">
                  <div className="relative" ref={containerRef}>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <HiOutlineSearch className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={
                          isOpen ? searchTerm : selectedValue || searchTerm
                        }
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Бараа хайх эсвэл баркод уншуулах..."
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-10 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm"
                      />
                      <HiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-none"
                              onClick={() => addItem(item)}
                            >
                              <span>{item.name}</span>
                              {item.internalCode && (
                                <span className="text-[10px] bg-blue-100 px-2 py-1 rounded text-blue-600 font-bold uppercase">
                                  {item.internalCode}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            Хайлттай тохирох бараа олдсонгүй
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr className="text-left text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                          <th className="px-6 py-4 w-12 text-center">#</th>
                          <th className="px-6 py-4">Бараа</th>
                          <th className="px-6 py-4 text-center w-40">
                            Тоо ширхэг
                          </th>
                          <th className="px-6 py-4 text-center">Нэгж</th>
                          <th className="px-6 py-4 w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-12 text-center text-gray-400 italic"
                            >
                              Жагсаалт хоосон байна. Бараа нэмнэ үү.
                            </td>
                          </tr>
                        ) : (
                          lineItems.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-gray-50 last:border-none"
                            >
                              <td className="px-6 py-3 text-center text-gray-400">
                                {row.id}
                              </td>
                              <td className="px-6 py-3">
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={(e) =>
                                    updateLineItem(
                                      row.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                                />
                              </td>

                              <td className="px-6 py-3 text-center">
                                <input
                                  type="text"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    updateLineItem(
                                      row.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                />
                              </td>
                              <td className="px-6 py-3 text-center">
                                <input
                                  type="text"
                                  value={row.unit}
                                  onChange={(e) =>
                                    updateLineItem(
                                      row.id,
                                      "unit",
                                      e.target.value,
                                    )
                                  }
                                  className="w-24 px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
                                />
                              </td>
                              <td className="px-6 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeLineItem(row.id)}
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Notes and Attachments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col">
                  <label className={labelClass}>Тэмдэглэл / Дэлгэрэнгүй</label>
                  <div className="relative mt-1 flex-1 flex flex-col group">
                    <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineDocumentText className="w-4 h-4" />
                    </div>
                    <textarea
                      className={`${baseInputClass} pl-10 resize-none flex-1 min-h-[120px]`}
                      placeholder="Шилжүүлгийн тухай нэмэлт тайлбар..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={labelClass}>Хавсралт файлууд</label>
                  <div className="mt-1 flex-1">
                    <div className="h-full group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:bg-blue-50/30 hover:border-blue-400 flex flex-col items-center justify-center text-center">
                      <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                        <HiOutlineCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 font-medium">
                        Баримтын зураг эсвэл PDF оруулах
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        .png, .jpg, .pdf, .docx, .xlsx
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Status Action Checkbox ── */}
              {action && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl w-fit pr-8 border ${action.bgClass} ${action.borderClass}`}
                >
                  <input
                    type="checkbox"
                    id="statusAction"
                    checked={false}
                    onChange={(e) => {
                      if (e.target.checked) setStatus(action.nextStatus);
                    }}
                    className={`h-5 w-5 focus:ring-2 border-gray-300 rounded cursor-pointer transition-all ${
                      status === "Draft"
                        ? "text-indigo-600 focus:ring-indigo-500"
                        : "text-emerald-600 focus:ring-emerald-500"
                    }`}
                  />
                  <div>
                    <label
                      htmlFor="statusAction"
                      className={`text-sm font-semibold cursor-pointer select-none ${action.colorClass}`}
                    >
                      {action.label}
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Completed state — read only notice */}
              {status === "Completed" && (
                <div className="flex items-center gap-3 p-4 rounded-xl w-fit pr-8 border bg-emerald-50 border-emerald-200">
                  <svg
                    className="w-5 h-5 text-emerald-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Шилжүүлэг дууссан
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Энэ шилжүүлэг гүйцэтгэгдсэн тэмдэглэгдсэн байна
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer Action */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl shadow-inner">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүртгэлийг устгах
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/transfer")}
                  className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-12 py-3 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-blue-600 disabled:opacity-60 active:scale-95 transition-all uppercase tracking-[2px] shadow-lg shadow-gray-200"
                >
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferEdit;
