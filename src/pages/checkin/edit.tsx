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
import { HiOutlineHomeModern } from "react-icons/hi2";
import { Confirmation } from "../../components/confirmation";
import { getCheckin, updateCheckin, deleteCheckin } from "../../api";
import { getContacts } from "../../api/contact/contact";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { getItems } from "../../api/item/item";

interface LineRow {
  id: number;
  itemId: number; // ← undefined байхгүй
  name: string;
  code: string;
  weight: string;
  quantity: string;
}

const CheckinEdit = () => {
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

  const filteredItems = itemOptions.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.internalCode ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Checkin өгөгдөл татах
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getCheckin(id);
        if (cancelled) return;
        setDate(data.date ? data.date.split("T")[0] : "");
        setCode(data.code || "");
        setContact(data.contact || "");
        setWarehouse(data.warehouse || "");
        setDetails(data.details || "");
        setIsDraft(data.status === "Draft");
        setLineItems(
          (data.items || []).map((it: any, i: number) => ({
            id: it.id ?? i + 1,
            itemId: Number(it.itemId) || 0, // ← undefined боломжгүй
            name: it.name ?? "",
            code: it.code ?? "",
            weight: it.weight ?? "1",
            quantity: it.quantity ?? "1",
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

  // Contacts, warehouses, items татах
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

  // Click outside хаах
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
      itemId: Number(item.id), // ← заавал Number
      name: item.name,
      code: item.internalCode || item.name.slice(0, 20) || "ITEM",
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

    const itemsForApi = lineItems.map((row) => ({
      itemId: row.itemId, // ← нэмэгдсэн
      name: row.name,
      code: row.code,
      weight: row.weight,
      quantity: row.quantity,
    }));

    try {
      setSaving(true);
      await updateCheckin(id, {
        code: code.trim(),
        date,
        status: isDraft ? "Draft" : "Pending",
        contact,
        warehouse,
        user: contact,
        details: details.trim(),
        items: itemsForApi,
      });
      navigate("/checkin", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шинэчлэхэд алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCheckin(id);
      setShowConfirm(false);
      navigate("/checkin", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа.");
    }
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none";
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
          title="Орлогыг устгах уу?"
          description="Та энэ орлогыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div>
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/checkin")}
                className="text-blue-600 hover:underline"
              >
                Орлого
              </button>
              <span className="text-gray-400 font-light">/</span>
              <span className="text-gray-500">Засах</span>
            </div>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Доорх формын дагуу мэдээллийг өөрчлөн бүртгэлийг шинэчилнэ үү
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-md space-y-8">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative group">
                    <label className={labelClass}>Огноо</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
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
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Дугаар оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <label className={labelClass}>Харилцагч</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineUserGroup className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      >
                        <option value="">Харилцагч сонгох</option>
                        {contactList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className={labelClass}>Агуулах</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineHomeModern className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                      >
                        <option value="">Агуулах сонгох</option>
                        {warehouseList.map((wh) => (
                          <option key={wh.id} value={wh.name}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="pt-6 border-t border-gray-100">
                <label className={labelClass}>Бараа материалын жагсаалт</label>
                <div className="mt-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200/60">
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
                        placeholder="Барааны нэр эсвэл баркод уншуулна уу..."
                        className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-11 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                      />
                      <HiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    {isOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-none"
                              onClick={() => addItem(item)}
                            >
                              <span>{item.name}</span>
                              {item.internalCode && (
                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase font-bold text-gray-400">
                                  {item.internalCode}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">
                            Илэрц олдсонгүй
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                          <th className="px-6 py-4 w-10 text-center">#</th>
                          <th className="px-6 py-4">Барааны мэдээлэл</th>
                          <th className="px-6 py-4 text-center">Тоо ширхэг</th>
                          <th className="px-6 py-4 text-center w-24"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-12 text-center text-gray-400 italic"
                            >
                              Жагсаалт хоосон байна. Дээрх хайлтаар бараа нэмнэ
                              үү.
                            </td>
                          </tr>
                        ) : (
                          lineItems.map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-gray-100"
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
                                <button
                                  type="button"
                                  onClick={() => removeLineItem(row.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
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

              {/* Attachments & Details */}
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

              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50/50 rounded-lg w-fit pr-6 border border-yellow-100">
                <input
                  type="checkbox"
                  id="draft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="draft"
                  className="text-sm text-yellow-800 font-bold cursor-pointer"
                >
                  Энэ бичилт ноорог төлөвтэй байна
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-md">
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
                  onClick={() => navigate("/checkin")}
                  className="text-gray-500 hover:text-gray-700 font-bold text-sm"
                >
                  Цуцлах
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition-all uppercase tracking-wider shadow-lg shadow-blue-200"
                >
                  {saving ? "Хадгалагдаж байна..." : "Шинэчлэх"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckinEdit;
