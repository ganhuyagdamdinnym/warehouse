import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiX,
  HiOutlineSearch,
  HiOutlineCalendar,
} from "react-icons/hi";
import { createCheckout } from "../../api/checkout/checkout_api";
import { getContacts } from "../../api/contact/contact_api";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { getItems } from "../../api/item/item";

interface SelectedItem {
  id: number;
  name: string;
  weight: string;
  quantity: string;
  productId: number;
  unit: string;
}

const CreateCheckOut = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemsList, setSelectedItemsList] = useState<SelectedItem[]>(
    [],
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [warehouseId, setWarehouseId] = useState<number | null>(null); // ← ID
  const [warehouseName, setWarehouseName] = useState(""); // ← Нэр
  const [warehouseSelectValue, setWarehouseSelectValue] = useState(""); // ← Select-ийн value
  const [details, setDetails] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const [contactList, setContactList] = useState<
    { id: string; name: string }[]
  >([]);
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
  >([]);
  const [itemOptions, setItemOptions] = useState<
    { id: string; name: string; internalCode?: string }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, warehouseRes, itemRes] = await Promise.all([
          getContacts({ limit: 100 }),
          getWarehouses({ limit: 100 }),
          getItems({ limit: 100 }),
        ]);
        setContactList(contactRes.data as { id: string; name: string }[]);
        setWarehouseList(warehouseRes.data as { id: string; name: string }[]);
        setItemOptions(
          itemRes.data as { id: string; name: string; internalCode?: string }[],
        );
      } catch (err) {
        console.error("Өгөгдөл татахад алдаа:", err);
      }
    };
    fetchData();
  }, []);

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

  const filteredItems = itemOptions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.internalCode ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

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
        productId: 1,
        weight: "1",
        quantity: "1",
        unit: "Хайрцаг",
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
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setWarehouseSelectValue(selectedId); // Select-ийн харагдах утга
    const found = warehouseList.find((wh) => String(wh.id) === selectedId);
    setWarehouseId(found ? Number(found.id) : null); // ID хадгалах
    setWarehouseName(found ? found.name : ""); // Нэр хадгалах
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date || !contact || !warehouseId) {
      setError("Огноо, харилцагч, агуулахыг заавал бөглөнө үү.");
      return;
    }
    if (selectedItemsList.length === 0) {
      setError("Дор хаяж нэг бараа нэмнэ үү.");
      return;
    }

    try {
      setSaving(true);
      await createCheckout({
        code: reference.trim() || `TCO${Date.now()}`,
        date,
        status: isDraft ? "Draft" : "Completed",
        contact,
        warehouse: warehouseName, // ← Нэр
        warehouseId: warehouseId, // ← ID
        user: "Admin",
        details: details.trim(),
        items: selectedItemsList.map((item) => ({
          name: item.name,
          productId: 1,
          code: item.name.slice(0, 5).toUpperCase(),
          weight: item.weight,
          quantity: item.quantity,
        })),
      });
      navigate("/checkout", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 outline-none hover:border-gray-300 placeholder:text-gray-400";
  const tableInputClass =
    "w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible bg-gray-50/50">
      <div className="w-full">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8 flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-gray-900 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Шинэ зарлага үүсгэх
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Бараа материалын зарлагын баримт шинээр үүсгэх.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold">
                      !
                    </span>
                    {error}
                  </div>
                )}

                {/* Main Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Огноо
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors mt-1.5">
                          <HiOutlineCalendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={`${baseInputClass} pl-10 accent-blue-600 cursor-pointer`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Лавлах дугаар (Reference)
                      </label>
                      <input
                        placeholder="Дугаар оруулна уу"
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className={baseInputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Харилцагч
                      </label>
                      <select
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={baseInputClass}
                      >
                        <option value="">Харилцагч сонгох</option>
                        {contactList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Агуулах
                      </label>
                      {/* ↓ value нь warehouseSelectValue (id string) */}
                      <select
                        value={warehouseSelectValue}
                        onChange={handleWarehouseChange}
                        className={baseInputClass}
                      >
                        <option value="">Агуулах сонгох</option>
                        {warehouseList.map((wh) => (
                          <option key={wh.id} value={String(wh.id)}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-100" />

                {/* Item Search */}
                <div>
                  <div className="relative mb-4" ref={containerRef}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Бараа нэмэх
                    </label>
                    <div className="relative group">
                      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Бараа хайх болон сонгох..."
                        className={`${baseInputClass} pl-9 py-2.5`}
                      />
                      <HiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl shadow-gray-100/80 max-h-60 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none transition-colors"
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

                  {/* Table */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/80 border-b border-gray-200">
                        <tr className="text-left text-gray-500 font-semibold">
                          <th className="px-4 py-3 w-12 text-center"></th>
                          <th className="px-4 py-3 uppercase tracking-widest text-[10px]">
                            Бараа
                          </th>
                          <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-32">
                            Жин (кг)
                          </th>
                          <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-32">
                            Тоо хэмжээ
                          </th>
                          <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-44">
                            Хэмжих нэгж
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {selectedItemsList.length > 0 ? (
                          selectedItemsList.map((row) => (
                            <tr
                              key={row.id}
                              className="hover:bg-gray-50/60 transition-colors group"
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
                              <td className="px-4 py-3 font-medium text-gray-800">
                                {row.name}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.weight}
                                  onChange={(e) =>
                                    updateItem(row.id, "weight", e.target.value)
                                  }
                                  placeholder="0.00"
                                  className={tableInputClass}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      row.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="0"
                                  className={tableInputClass}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="relative">
                                  <select
                                    value={row.unit}
                                    onChange={(e) =>
                                      updateItem(row.id, "unit", e.target.value)
                                    }
                                    className={`${tableInputClass} appearance-none pr-8 cursor-pointer`}
                                  >
                                    <option>Хайрцаг (Box)</option>
                                    <option>Ширхэг (Piece)</option>
                                    <option>Боодол (Pack)</option>
                                  </select>
                                  <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-14 text-center text-gray-300 text-sm bg-gray-50/20"
                            >
                              Хайлт хийх эсвэл баркод уншуулж бараа нэмнэ үү
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-100" />

                {/* File + Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Хавсралт файлууд
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2.5 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                        <HiOutlinePaperClip className="text-gray-400 group-hover:text-blue-500 w-4 h-4 transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Дарж хуулна уу эсвэл файлаа чирнэ үү
                      </p>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg border border-blue-100 text-xs font-medium"
                        >
                          <span className="truncate max-w-[140px]">
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
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Дэлгэрэнгүй тайлбар
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className={`${baseInputClass} resize-none`}
                      rows={5}
                      placeholder="Нэмэлт тэмдэглэл..."
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
                    <input
                      type="checkbox"
                      checked={isDraft}
                      onChange={(e) => setIsDraft(e.target.checked)}
                      className="peer w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      Энэ бүртгэлийг ноорог (draft) хэлбэрээр хадгалах
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  * Огноо, харилцагч, агуулах заавал бөглөнө
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-7 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckOut;
