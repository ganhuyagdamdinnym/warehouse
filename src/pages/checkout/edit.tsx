import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
} from "react-icons/hi";
import { HiOutlineHomeModern, HiOutlineArrowUpTray } from "react-icons/hi2";
import { Confirmation } from "../../components/confirmation";
import {
  getCheckout,
  updateCheckout,
  deleteCheckout,
} from "../../api/checkout/checkout_api";
import type { CheckoutItem } from "../../models/types/checkout";

interface LineRow {
  id: number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
}

const contacts = ["Marianna Upton", "John Doe", "Alice Smith", "Bob Brown"];
const warehouses = ["Агуулах 1", "Агуулах 2", "Агуулах 3", "Үндсэн агуулах"];
const itemOptions = [
  "Бүтээгдэхүүн 1 - Агуулах А",
  "Бүтээгдэхүүн 2 - Агуулах Б",
  "Бараа 3 - Хадгалах C",
  "Сэлбэг хэрэгсэл 4",
  "Цахим төхөөрөмж 5",
];

const CheckoutEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [details, setDetails] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [lineItems, setLineItems] = useState<LineRow[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = itemOptions.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getCheckout(id);
        if (cancelled) return;
        setDate(data.date || "");
        setCode(data.code || "");
        setContact(data.contact || "");
        setWarehouse(data.warehouse || "");
        setDetails(data.details || "");
        setIsDraft(data.status === "Draft");
        setLineItems(
          (data.items || []).map((it: CheckoutItem, i: number) => ({
            id: i + 1,
            name: it.name,
            code: it.code,
            weight: it.weight,
            quantity: it.quantity,
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

  const addItem = (itemName: string) => {
    const newRow: LineRow = {
      id: Date.now(),
      name: itemName,
      code: itemName.slice(0, 20) || "ITEM",
      weight: "1",
      quantity: "1",
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

  const handleSubmit = async () => {
    if (!id) return;
    setError(null);
    if (!date || !code.trim() || !contact || !warehouse) {
      setError("Огноо, лавлах дугаар, харилцагч, агуулах заавал бөглөнө.");
      return;
    }
    const itemsForApi: CheckoutItem[] = lineItems.map((row) => ({
      name: row.name,
      code: row.code,
      weight: row.weight,
      quantity: row.quantity,
    }));
    try {
      setSaving(true);
      await updateCheckout(id, {
        code: code.trim(),
        date,
        status: isDraft ? "Draft" : "Pending",
        contact,
        warehouse,
        user: contact,
        details: details.trim(),
        items: itemsForApi,
      });
      navigate("/checkout", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шинэчлэхэд алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCheckout(id);
      setShowConfirm(false);
      navigate("/checkout", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа.");
    }
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

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Зарлагыг устгах уу?"
          description="Та энэ зарлагыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div>
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="text-blue-600 hover:underline"
              >
                Зарлага
              </button>
              <span className="text-gray-400 font-light">/</span>
              <span className="text-gray-500">Засах</span>
            </div>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх формын дагуу мэдээллийг өөрчлөн зарлагын бүртгэлийг шинэчилнэ
            үү
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl space-y-8 shadow-sm">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              {/* Primary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
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
                        placeholder="Жишээ: INV-2024-001"
                        className={`${baseInputClass} pl-10`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <label className={labelClass}>
                      Харилцагч (Хүлээн авагч)
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineUserGroup className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      >
                        <option value="">Харилцагч сонгох</option>
                        {contacts.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className={labelClass}>Агуулах</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHomeModern className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                      >
                        <option value="">Агуулах сонгох</option>
                        {warehouses.map((wh) => (
                          <option key={wh} value={wh}>
                            {wh}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-6 border-t border-gray-100">
                <label className={labelClass}>Бараа материалын жагсаалт</label>
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
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-10 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                      />
                      <HiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-none transition-colors"
                              onClick={() => addItem(item)}
                            >
                              <span>{item}</span>
                              <span className="text-[10px] bg-blue-100 px-2 py-1 rounded text-blue-600 font-bold uppercase">
                                Нэмэх
                              </span>
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
                          <th className="px-6 py-4 text-center">Жин</th>
                          <th className="px-6 py-4 text-center">Тоо ширхэг</th>
                          <th className="px-6 py-4 text-center">Нэгж</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-14 text-center">
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <HiOutlineArrowUpTray className="w-6 h-6 opacity-20" />
                                <span className="italic">
                                  Зарлага болгох бараагаа дээрх талбараар хайж
                                  нэмнэ үү
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          lineItems.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-gray-100 last:border-none"
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
                                  value={row.weight}
                                  onChange={(e) =>
                                    updateLineItem(
                                      row.id,
                                      "weight",
                                      e.target.value,
                                    )
                                  }
                                  className="w-20 px-2 py-1.5 border border-gray-200 rounded text-sm text-center"
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
                                <button
                                  type="button"
                                  onClick={() => removeLineItem(row.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Устгах"
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

              {/* Attachments & Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col">
                  <label className={labelClass}>Хавсралт файлууд</label>
                  <div className="mt-2 group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-8 transition-all hover:bg-blue-50/30 hover:border-blue-300 flex flex-col items-center justify-center text-center h-full">
                    <HiOutlineCloudUpload className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    <p className="mt-2 text-sm text-gray-600 font-medium italic">
                      Файл чирч оруулна уу
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      .png, .jpg, .pdf, .docx, .xlsx
                    </p>
                  </div>
                </div>

                <div className="relative group flex flex-col">
                  <label className={labelClass}>Дэлгэрэнгүй тайлбар</label>
                  <div className="relative mt-1 flex-grow">
                    <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlineDocumentText className="w-4 h-4" />
                    </div>
                    <textarea
                      className={`${baseInputClass} pl-10 resize-none h-full`}
                      rows={4}
                      placeholder="Энд дэлгэрэнгүй мэдээллийг оруулна уу..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Draft Status */}
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl w-fit pr-8 border border-indigo-100/50 shadow-sm">
                <input
                  type="checkbox"
                  id="draft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-all"
                />
                <label
                  htmlFor="draft"
                  className="text-sm text-indigo-900 font-semibold cursor-pointer select-none"
                >
                  Энэ бичилтийг ноорог (Draft) төлөвөөр хадгалах
                </label>
              </div>
            </div>

            {/* Sticky Footer Action */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl shadow-inner">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүртгэлийг устгах
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="text-gray-500 hover:text-gray-700 font-bold text-sm"
                >
                  Цуцлах
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-12 py-3 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 disabled:opacity-60 active:scale-95 transition-all uppercase tracking-[2px] shadow-lg shadow-gray-200"
                >
                  {saving ? "Хадгалагдаж байна..." : "Хадгалах"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutEdit;
