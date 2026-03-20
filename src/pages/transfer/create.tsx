import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { createTransfer } from "../../api/transfer/transfer";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { getItems } from "../../api/item/item";

interface SelectedItem {
  id: number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
  unit: string;
}

const CreateTransfer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemsList, setSelectedItemsList] = useState<SelectedItem[]>(
    [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [code, setCode] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [details, setDetails] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  // Real data from API
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
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

  // Fetch warehouses and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehouseRes, itemRes] = await Promise.all([
          getWarehouses({ limit: 100 }),
          getItems({ limit: 100 }),
        ]);
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

  const handleSelectItem = (item: {
    id: string;
    name: string;
    internalCode?: string;
  }) => {
    const newItem: SelectedItem = {
      id: Date.now(),
      name: item.name,
      code: item.internalCode || item.name.slice(0, 20) || "ITEM",
      weight: "1",
      quantity: "1",
      unit: "Ширхэг",
    };
    setSelectedItemsList((prev) => [...prev, newItem]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const removeItem = (id: number) => {
    setSelectedItemsList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: "weight" | "quantity" | "unit",
    value: string,
  ) => {
    setSelectedItemsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date || !fromWarehouse || !toWarehouse) {
      setError("Огноо, гарах болон орох агуулах заавал бөглөнө.");
      return;
    }
    if (fromWarehouse === toWarehouse) {
      setError("Гарах болон орох агуулах ижил байж болохгүй.");
      return;
    }

    try {
      setSaving(true);
      await createTransfer({
        code: code.trim() || `TRF${Date.now()}`,
        date,
        status: isDraft ? "Draft" : "Pending",
        fromWarehouse,
        toWarehouse,
        user: "Admin",
        details: details.trim() || undefined,
        items: selectedItemsList.map((item) => ({
          name: item.name,
          code: item.code,
          weight: item.weight,
          quantity: item.quantity,
          unit: item.unit,
        })),
      });
      navigate("/transfer", { replace: true });
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
              Шинэ шилжүүлэг үүсгэх
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Агуулах хооронд бараа материалын хөдөлгөөн бүртгэх.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              {/* Transfer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
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
                      Лавлах дугаар
                    </label>
                    <input
                      placeholder="Шилжүүлгийн дугаар"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={baseInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                      Гарах агуулах (From)
                    </label>
                    <select
                      className={baseInputClass}
                      value={fromWarehouse}
                      onChange={(e) => setFromWarehouse(e.target.value)}
                    >
                      <option value="">Сонгох...</option>
                      {warehouseList.map((wh) => (
                        <option key={wh.id} value={wh.name}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                      Орох агуулах (To)
                    </label>
                    <select
                      className={baseInputClass}
                      value={toWarehouse}
                      onChange={(e) => setToWarehouse(e.target.value)}
                    >
                      <option value="">Сонгох...</option>
                      {warehouseList.map((wh) => (
                        <option key={wh.id} value={wh.name}>
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
                      placeholder="Барааны нэр эсвэл код..."
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
                            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none transition-colors flex items-center justify-between"
                            onClick={() => handleSelectItem(item)}
                          >
                            <span>{item.name}</span>
                            {item.internalCode && (
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase">
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
                          Бараа материалын нэр
                        </th>
                        <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-32 text-center">
                          Жин
                        </th>
                        <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-32 text-center">
                          Тоо хэмжээ
                        </th>
                        <th className="px-4 py-3 uppercase tracking-widest text-[10px] w-40 text-center">
                          Нэгж
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
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={row.weight}
                                onChange={(e) =>
                                  updateItem(row.id, "weight", e.target.value)
                                }
                                className={tableInputClass}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={row.quantity}
                                onChange={(e) =>
                                  updateItem(row.id, "quantity", e.target.value)
                                }
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
                                  <option>Ширхэг</option>
                                  <option>Кг</option>
                                  <option>Метр</option>
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
                            Шилжүүлэх бараа сонгогдоогүй байна.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-100" />

              {/* File + Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Хавсралт файл
                  </label>
                  <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2.5 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                      <HiOutlinePaperClip className="text-gray-400 group-hover:text-blue-500 w-4 h-4 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Баримт бичиг хуулах (PDF, Image)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Шилжүүлгийн тайлбар
                  </label>
                  <textarea
                    className={`${baseInputClass} resize-none`}
                    rows={5}
                    placeholder="Шилжүүлэг хийх шалтгаан, нэмэлт тэмдэглэл..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">
                    Энэ бичилтийг ноорог төлөвт хадгалах
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                * Огноо, гарах болон орох агуулах заавал бөглөнө
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/transfer")}
                  className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-7 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
                >
                  <HiOutlineSwitchHorizontal className="w-4 h-4" />
                  {saving ? "Хадгалж байна..." : "Шилжүүлэг баталгаажуулах"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransfer;
