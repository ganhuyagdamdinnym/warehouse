import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineAdjustments,
  HiOutlineSearch,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiX,
} from "react-icons/hi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { Confirmation } from "../../components/confirmation";
import {
  getAdjustment,
  updateAdjustment,
  deleteAdjustment,
} from "../../api/adjustment/adjustment";
import { getContacts } from "../../api/contact/contact_api";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { getItems } from "../../api/item/item";

interface SelectedItem {
  id: number;
  name: string;
  weight: string;
  quantity: string;
  unit: string;
}

const AdjustmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [details, setDetails] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [selectedItemsList, setSelectedItemsList] = useState<SelectedItem[]>(
    [],
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Dropdown data
  const [contactList, setContactList] = useState<
    { id: string; name: string }[]
  >([]);
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
  >([]);
  const [itemOptions, setItemOptions] = useState<
    { id: string; name: string; internalCode?: string }[]
  >([]);

  // Item search
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = itemOptions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.internalCode ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Load all data in parallel
  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [adjustmentRes, contactRes, warehouseRes, itemRes] =
          await Promise.all([
            getAdjustment(id),
            getContacts({ limit: 100 }),
            getWarehouses({ limit: 100 }),
            getItems({ limit: 100 }),
          ]);

        // Populate form
        setDate(adjustmentRes.date?.slice(0, 10) ?? "");
        setCode(adjustmentRes.code ?? "");
        setContact(adjustmentRes.contact ?? "");
        setWarehouse(adjustmentRes.warehouse ?? "");
        setDetails(adjustmentRes.details ?? "");
        setIsDraft(adjustmentRes.status === "Draft");
        setSelectedItemsList(
          (adjustmentRes.items ?? []).map((item: any, i: number) => ({
            id: item.id ?? Date.now() + i,
            name: item.name,
            weight: String(item.weight ?? "1"),
            quantity: String(item.quantity ?? "1"),
            unit: item.unit ?? "Ширхэг",
          })),
        );

        setContactList(contactRes.data as { id: string; name: string }[]);
        setWarehouseList(warehouseRes.data as { id: string; name: string }[]);
        setItemOptions(
          itemRes.data as { id: string; name: string; internalCode?: string }[],
        );
      } catch (err: any) {
        setError(err.message ?? "Өгөгдөл татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Click outside closes dropdown
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

  const handleSelectItem = (item: {
    id: string;
    name: string;
    internalCode?: string;
  }) => {
    setSelectedItemsList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: item.name,
        weight: "1",
        quantity: "1",
        unit: "Ширхэг",
      },
    ]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const removeItem = (id: number) => {
    setSelectedItemsList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof Omit<SelectedItem, "id" | "name">,
    value: string,
  ) => {
    setSelectedItemsList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!date || !warehouse) {
      setError("Огноо болон агуулах заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await updateAdjustment(id!, {
        code: code.trim(),
        date,
        status: isDraft ? "Draft" : "Completed",
        contact,
        warehouse,
        details: details.trim(),
        items: selectedItemsList.map(({ name, weight, quantity, unit }) => ({
          name,
          weight: Number(weight),
          quantity: Number(quantity),
          unit,
        })),
      });
      navigate("/adjustment", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdjustment(id!);
      navigate("/adjustment", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Устгахад алдаа гарлаа.");
    } finally {
      setShowConfirm(false);
    }
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none";
  const labelClass = "text-sm font-semibold text-gray-700";

  if (loading) {
    return (
      <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Уншиж байна...
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Өөрчлөлтийг устгах уу?"
          description="Та энэ тохируулгын бүртгэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div>
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <a
                href="#"
                onClick={() => navigate("/adjustment")}
                className="text-blue-600 hover:underline"
              >
                Өөрчлөлт / Тохируулга
              </a>
              <span className="text-gray-400 font-light">/</span>
              <span className="text-gray-500 font-medium text-sm">Засах</span>
            </div>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Тохируулгын мэдээллийг шинэчлэх
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl space-y-8 shadow-sm">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Огноо</label>
                    <div className="relative mt-1">
                      <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Лавлах дугаар</label>
                    <div className="relative mt-1">
                      <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="ADJ-102"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Харилцагч</label>
                    <div className="relative mt-1">
                      <HiOutlineAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={`${baseInputClass} pl-10 appearance-none`}
                      >
                        <option value="">Сонгох...</option>
                        {contactList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Агуулах</label>
                    <div className="relative mt-1">
                      <HiOutlineHomeModern className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                        className={`${baseInputClass} pl-10 appearance-none`}
                      >
                        <option value="">Сонгох...</option>
                        {warehouseList.map((w) => (
                          <option key={w.id} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Search */}
              <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-200/60 shadow-inner">
                <div className="relative" ref={containerRef}>
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      placeholder="Бараа нэмэх..."
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-10 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm"
                    />
                  </div>
                  {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <div
                            key={item.id}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-none"
                            onClick={() => handleSelectItem(item)}
                          >
                            <span className="font-medium">{item.name}</span>
                            {item.internalCode && (
                              <span className="ml-2 text-xs text-gray-400 font-mono">
                                {item.internalCode}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-gray-400 text-xs text-center">
                          Илэрц олдсонгүй
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                      <tr className="text-left text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                        <th className="px-4 py-4 w-10"></th>
                        <th className="px-6 py-4">Бараа</th>
                        <th className="px-6 py-4 text-center w-28">Жин</th>
                        <th className="px-6 py-4 text-center w-28">Тоо</th>
                        <th className="px-6 py-4 text-center w-36">Нэгж</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedItemsList.length > 0 ? (
                        selectedItemsList.map((row) => (
                          <tr
                            key={row.id}
                            className="group hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(row.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="px-6 py-3 font-medium text-gray-800">
                              {row.name}
                            </td>
                            <td className="px-6 py-3">
                              <input
                                type="text"
                                value={row.weight}
                                onChange={(e) =>
                                  updateItem(row.id, "weight", e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-700 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                              />
                            </td>
                            <td className="px-6 py-3">
                              <input
                                type="text"
                                value={row.quantity}
                                onChange={(e) =>
                                  updateItem(row.id, "quantity", e.target.value)
                                }
                                placeholder="0"
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-700 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                              />
                            </td>
                            <td className="px-6 py-3">
                              <div className="relative">
                                <select
                                  value={row.unit}
                                  onChange={(e) =>
                                    updateItem(row.id, "unit", e.target.value)
                                  }
                                  className="w-full pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm appearance-none cursor-pointer focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                >
                                  <option>Ширхэг</option>
                                  <option>Хайрцаг</option>
                                  <option>Боодол</option>
                                </select>
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                                  <HiChevronDown className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-gray-400 italic"
                          >
                            Тохируулах бараа сонгогдоогүй байна.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes and Attachments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col">
                  <label className={labelClass}>Тэмдэглэл / Дэлгэрэнгүй</label>
                  <div className="relative mt-1 flex-1 flex flex-col group">
                    <HiOutlineDocumentText className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 w-4 h-4" />
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className={`${baseInputClass} pl-10 resize-none flex-1 min-h-[140px]`}
                      placeholder="Өөрчлөлт хийсэн шалтгаан, дэлгэрэнгүй тайлбар..."
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={labelClass}>Хавсралт файлууд</label>
                  <div className="mt-1 flex-1">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-full group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:bg-blue-50/30 hover:border-blue-400 flex flex-col items-center justify-center text-center"
                    >
                      <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                        <HiOutlineCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 font-medium">
                        Баримтын зураг эсвэл файл оруулах
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Drag and drop or click
                      </p>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg border border-blue-100 text-xs font-medium"
                          >
                            <span className="truncate max-w-[120px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              className="hover:text-blue-900 transition-colors"
                              onClick={() =>
                                setUploadedFiles((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                            >
                              <HiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Draft Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl w-fit pr-8 border border-indigo-100/50">
                <input
                  type="checkbox"
                  id="draft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="draft"
                  className="text-sm text-indigo-900 font-semibold cursor-pointer"
                >
                  Ноорог төлөвтэй хадгалах
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Устгах
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-12 py-3 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all uppercase tracking-[2px] shadow-lg shadow-gray-200"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Хадгалж байна...
                  </span>
                ) : (
                  "Хадгалах"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentEdit;
