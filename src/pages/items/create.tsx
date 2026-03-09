import React, { useRef } from "react";
import {
  HiOutlineCube,
  HiOutlinePhotograph,
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineLocationMarker,
  HiOutlineBell,
} from "react-icons/hi";

const CreateItem = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Styles
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineCube className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Шинэ бараа бүртгэх
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Системд шинэ бараа материал, бүтээгдэхүүн нэмэх.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Барааны нэр</label>
                    <input
                      placeholder="Жишээ: Моторны тос 5W-30"
                      type="text"
                      className={baseInputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Дотоод код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="ITEM-0001"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Баркодны төрөл (Symbology)
                    </label>
                    <select className={baseInputClass}>
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
                    />
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Ангилал</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <select className={`${baseInputClass} pl-10`}>
                        <option value="">Ангилал сонгох</option>
                        <option value="parts">Сэлбэг хэрэгсэл</option>
                        <option value="fluids">Шингэн зүйлс</option>
                        <option value="electronics">Цахим төхөөрөмж</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Хэмжих нэгж</label>
                    <select className={baseInputClass}>
                      <option value="pcs">Ширхэг (pcs)</option>
                      <option value="kg">Киллограмм (kg)</option>
                      <option value="liter">Литр (l)</option>
                      <option value="meter">Метр (m)</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Тавиурын байршил</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Жишээ: A-12-03"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Барааны зураг</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 flex items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-md p-2 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 py-0.5">
                        <HiOutlinePhotograph className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="text-xs text-gray-500 font-medium">
                          Зураг сонгох
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-100">
                <label className={labelClass}>Дэлгэрэнгүй мэдээлэл</label>
                <textarea
                  className={`${baseInputClass} resize-none`}
                  rows={4}
                  placeholder="Барааны шинж чанар, техникийн үзүүлэлт..."
                ></textarea>
              </div>

              {/* Inventory Control Options */}
              <div className="bg-blue-50/50 p-6 rounded-lg space-y-4 border border-blue-100">
                <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider">
                  Бараа материалын хяналт
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                        Жингээр хянах
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                        Тоо ширхэгээр хянах
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Доод хязгаар (Stock Alert)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                        <HiOutlineBell className="w-4 h-4" />
                      </div>
                      <input
                        placeholder="Үлдэгдэл багасах үед мэдэгдэх тоо"
                        type="number"
                        className={`${baseInputClass} pl-10 border-blue-200`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-4">
              <button
                type="button"
                className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-sm shadow-none transition-all active:scale-95"
              >
                Бүртгэл хадгалах
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
