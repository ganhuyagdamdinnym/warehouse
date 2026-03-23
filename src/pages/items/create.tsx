import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCube,
  HiOutlinePhotograph,
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineLocationMarker,
  HiOutlineBell,
  HiOutlineArchive,
} from "react-icons/hi";
import { createItem } from "../../api/item/item";
import { getCategories } from "../../api/category/category";
import { getUnits } from "../../api/unit/unit";
import type { Category } from "../../models/types/category";
import type { Unit } from "../../models/types/unit";

const CreateItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [stock, setStock] = useState<string>("0");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);

  useEffect(() => {
    Promise.all([getCategories({ limit: 100 }), getUnits({ limit: 100 })])
      .then(([catRes, unitRes]) => {
        setCategoryList(catRes.data);
        setUnitList(unitRes.data);
      })
      .catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
        image: imagePreview || undefined,
        trackStock,
        stockAlert: stockAlert ? Number(stockAlert) : undefined,
        stock: Number(stock) || 0,
      });
      navigate("/items", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 outline-none hover:border-gray-300 placeholder:text-gray-400";
  const labelClass =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible bg-gray-50/50">
      <div className="w-full">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8 flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-gray-900 flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <HiOutlineCube className="w-5 h-5 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Шинэ бараа бүртгэх
              </h3>
            </div>
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
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              {/* Primary Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {/* Left */}
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Барааны нэр</label>
                    <input
                      placeholder="Жишээ: Моторны тос 5W-30"
                      type="text"
                      className={baseInputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Дотоод код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors mt-1.5">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="ITEM-0001"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                        value={internalCode}
                        onChange={(e) => setInternalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Баркодны төрөл (Symbology)
                    </label>
                    <select
                      className={baseInputClass}
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
                    <label className={labelClass}>SKU (Нэгж бүрийн код)</label>
                    <input
                      placeholder="SKU-XXXX-XXXX"
                      type="text"
                      className={baseInputClass}
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-5">
                  {/* Category — from API */}
                  <div>
                    <label className={labelClass}>Ангилал</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors mt-1.5">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10`}
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

                  {/* Unit — from API */}
                  <div>
                    <label className={labelClass}>Хэмжих нэгж</label>
                    <select
                      className={baseInputClass}
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
                    <label className={labelClass}>Тавиурын байршил</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors mt-1.5">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Жишээ: A-12-03"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Барааны зураг</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 flex items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-3 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="h-16 object-contain rounded"
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-0.5">
                          <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                            <HiOutlinePhotograph className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            Зураг сонгох
                          </span>
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
                        onClick={() => setImagePreview(null)}
                        className="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Зураг устгах
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-100" />

              {/* Description */}
              <div>
                <label className={labelClass}>Дэлгэрэнгүй мэдээлэл</label>
                <textarea
                  className={`${baseInputClass} resize-none`}
                  rows={4}
                  placeholder="Барааны шинж чанар, техникийн үзүүлэлт..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Inventory Control */}
              <div className="bg-blue-50/40 p-6 rounded-xl border border-blue-100/80 space-y-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                  Бараа материалын хяналт
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>Анхны үлдэгдэл</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors mt-1.5">
                        <HiOutlineArchive className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="0"
                        type="number"
                        min="0"
                        className={`${baseInputClass} pl-10 border-blue-200 focus:border-blue-500`}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Доод хязгаар (Stock Alert)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors mt-1.5">
                        <HiOutlineBell className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Мэдэгдэх тоо"
                        type="number"
                        min="0"
                        className={`${baseInputClass} pl-10 border-blue-200 focus:border-blue-500`}
                        value={stockAlert}
                        onChange={(e) => setStockAlert(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
                      <input
                        type="checkbox"
                        checked={trackStock}
                        onChange={(e) => setTrackStock(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Тоо ширхэгээр хянах
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
