import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlinePhotograph,
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineLocationMarker,
  HiOutlineBell,
  HiOutlineTrash,
  HiOutlineCamera,
} from "react-icons/hi";
import { createItem } from "../../api/item/item";
import { getCategories } from "../../api/category/category";
import { getUnits } from "../../api/unit/unit";
import { getWarehouses } from "../../api/warehouse/warehouse_api";
import { useAuth } from "../../hooks/auth";
import type { Category } from "../../models/types/category";
import type { Unit } from "../../models/types/unit";

export interface WarehouseAllocation {
  warehouseId: string | number;
  warehouseName?: string;
}

const resizeImage = (file: File, maxSize = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const CreateItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isSuperAdmin, warehouse: userWarehouse } = useAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [barcodeType, setBarcodeType] = useState("CODE128");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [trackStock, setTrackStock] = useState(false);
  const [stockAlert, setStockAlert] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<WarehouseAllocation[]>([]);
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
  >([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);

  useEffect(() => {
    Promise.all([
      getCategories({ limit: 100 }),
      getUnits({ limit: 100 }),
      getWarehouses({ limit: 100 }),
    ])
      .then(([catRes, unitRes, whRes]) => {
        setCategoryList(catRes.data);
        setUnitList(unitRes.data);
        const allWarehouses = whRes.data as { id: string; name: string }[];
        setWarehouseList(allWarehouses);
        // SuperAdmin биш бол өөрийн агуулахыг автоматаар тохируулна
        if (!isSuperAdmin) {
          const myWh = allWarehouses.find((wh) => wh.name === userWarehouse);
          if (myWh)
            setAllocations([
              { warehouseId: myWh.id, warehouseName: myWh.name },
            ]);
        }
      })
      .catch(() => setError("Мэдээлэл татахад алдаа гарлаа."));
  }, [isSuperAdmin, userWarehouse]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Зөвхөн зураг файл сонгоно уу");
    if (file.size > 5 * 1024 * 1024)
      return setError("Зургийн хэмжээ 5MB-аас хэтрэхгүй байх ёстой");
    try {
      const resized = await resizeImage(file, 400);
      setImagePreview(resized);
      setImageBase64(resized);
      setError(null);
    } catch {
      setError("Зураг боловсруулахад алдаа гарлаа");
    }
  };

  const addAllocation = () => {
    const usedIds = allocations.map((a) => String(a.warehouseId));
    const available = warehouseList.find((wh) => !usedIds.includes(wh.id));
    if (!available) return;
    setAllocations((prev) => [
      ...prev,
      { warehouseId: available.id, warehouseName: available.name },
    ]);
  };

  const updateAllocation = (index: number, warehouseId: string) => {
    const wh = warehouseList.find((w) => w.id === warehouseId);
    setAllocations((prev) =>
      prev.map((a, i) =>
        i === index
          ? { warehouseId, warehouseName: wh?.name ?? warehouseId }
          : a,
      ),
    );
  };

  const removeAllocation = (index: number) =>
    setAllocations((prev) => prev.filter((_, i) => i !== index));

  const availableWarehouses = (currentId: string | number) =>
    warehouseList.filter(
      (wh) =>
        wh.id === String(currentId) ||
        !allocations.some((a) => String(a.warehouseId) === wh.id),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Барааны нэр заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await createItem({
        name: name.trim(),
        internalCode: internalCode.trim() || undefined,
        barcodeType,
        sku: sku.trim() || undefined,
        category: category || undefined,
        unit: unit || undefined,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        image: imageBase64 || undefined,
        trackStock,
        stockAlert: stockAlert ? Number(stockAlert) : undefined,
        stock: 0,
        warehouseAllocations: allocations
          .filter((a) => a.warehouseId)
          .map((a) => ({
            warehouseId: isNaN(Number(a.warehouseId))
              ? a.warehouseId
              : Number(a.warehouseId),
            quantity: 0,
          })),
      });
      navigate("/items", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 outline-none hover:border-gray-300 placeholder:text-gray-400";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/50">
      <div className="w-full">
        <div className="px-4 md:px-0 mb-8 flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-gray-900 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Шинэ бараа бүртгэх
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Системд шинэ бараа материал, бүтээгдэхүүн нэмэх.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {error && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Барааны нэр
                    </label>
                    <input
                      placeholder="Жишээ: Моторны тос 5W-30"
                      type="text"
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Дотоод код
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 mt-1.5">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="ITEM-0001"
                        type="text"
                        className={`${inputClass} pl-10`}
                        value={internalCode}
                        onChange={(e) => setInternalCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Баркодны төрөл
                    </label>
                    <select
                      className={inputClass}
                      value={barcodeType}
                      onChange={(e) => setBarcodeType(e.target.value)}
                    >
                      <option value="CODE128">CODE128</option>
                      <option value="EAN13">EAN13</option>
                      <option value="UPC">UPC</option>
                      <option value="QR">QR Code</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      SKU
                    </label>
                    <input
                      placeholder="SKU-XXXX-XXXX"
                      type="text"
                      className={inputClass}
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ангилал
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 mt-1.5">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <select
                        className={`${inputClass} pl-10`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Ангилал сонгох</option>
                        {categoryList.map((c) => (
                          <option key={c.id} value={String(c.name)}>
                            {c.parent ? `${c.parent.name} / ${c.name}` : c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Хэмжих нэгж
                    </label>
                    <select
                      className={inputClass}
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="">Нэгж сонгох</option>
                      {unitList.map((u) => (
                        <option key={u.id} value={String(u.id)}>
                          {u.name} ({u.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Тавиурын байршил
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 mt-1.5">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Жишээ: A-12-03"
                        type="text"
                        className={`${inputClass} pl-10`}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Барааны зураг
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 relative border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group"
                      style={{ minHeight: "100px" }}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="preview"
                            className="w-full max-h-48 object-contain p-2"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow">
                              <HiOutlineCamera className="w-5 h-5 text-gray-700" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                          <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2.5 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                            <HiOutlinePhotograph className="text-gray-400 group-hover:text-blue-500 w-4 h-4 transition-colors" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Дарж зураг сонгоно уу
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            JPG, PNG — дээд тал 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageBase64(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Зураг устгах
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-100" />

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Дэлгэрэнгүй мэдээлэл
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Барааны шинж чанар, техникийн үзүүлэлт..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="border-t border-dashed border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Доод хязгаар (Stock Alert)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 mt-1.5">
                        <HiOutlineBell className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Мэдэгдэх тоо"
                        type="number"
                        min="0"
                        className={`${inputClass} pl-10`}
                        value={stockAlert}
                        onChange={(e) => setStockAlert(e.target.value)}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
                    <input
                      type="checkbox"
                      checked={trackStock}
                      onChange={(e) => setTrackStock(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      Тоо ширхэгээр хянах
                    </span>
                  </label>
                </div>

                {/* ── Агуулах байршил ── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Байрших агуулахууд
                      </label>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {isSuperAdmin
                          ? "Анхны үлдэгдэл тооцохгүй — зөвхөн байршил"
                          : `Таны агуулах: ${userWarehouse}`}
                      </p>
                    </div>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={addAllocation}
                        disabled={allocations.length >= warehouseList.length}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        + Нэмэх
                      </button>
                    )}
                  </div>

                  {allocations.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-xs text-gray-400 bg-gray-50/20">
                      {isSuperAdmin
                        ? "Бараа байрших агуулахуудыг сонгоно уу"
                        : "Агуулах олдсонгүй"}
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                      {allocations.map((alloc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors group"
                        >
                          {isSuperAdmin ? (
                            <select
                              value={alloc.warehouseId}
                              onChange={(e) =>
                                updateAllocation(i, e.target.value)
                              }
                              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:border-blue-500 outline-none transition-all"
                            >
                              {availableWarehouses(alloc.warehouseId).map(
                                (wh) => (
                                  <option key={wh.id} value={wh.id}>
                                    {wh.name}
                                  </option>
                                ),
                              )}
                            </select>
                          ) : (
                            <span className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                              {alloc.warehouseName}
                            </span>
                          )}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => removeAllocation(i)}
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            >
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                * Барааны нэр заавал бөглөнө
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/items")}
                  className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
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
                    "Бүртгэл хадгалах"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
