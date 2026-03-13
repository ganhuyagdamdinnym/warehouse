import React, { useState, useRef } from "react";
import {
  HiOutlineOfficeBuilding,
  HiOutlineHashtag,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineSave,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";

const Warehouse = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    console.log("Устгасан");
    setShowConfirm(false);
  };

  // Consistent Styles
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Агуулахыг устгах уу?"
          description="Та энэ агуулахын бүх мэдээллийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600/60 font-medium">
                Агуулахууд /{" "}
              </span>
              Агуулах засах
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Агуулахын байршил, холбоо барих мэдээлэл болон логог шинэчлэх.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {/* Top Section: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Агуулахын код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="WH-004"
                        type="text"
                        className={`${baseInputClass} pl-10 font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Агуулахын нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineOfficeBuilding className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="Төв Агуулах"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload Area */}
                <div className="bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-300">
                  <label className={`${labelClass} mb-3 block`}>
                    Байгууллагын лого
                  </label>
                  <div className="flex items-start gap-5">
                    <div className="relative h-24 w-24 flex-shrink-0 border-2 border-white shadow-md rounded-lg bg-gray-200 overflow-hidden group">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <HiOutlinePhotograph className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                      >
                        Лого солих
                      </button>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={() => setLogoPreview(null)}
                          className="text-[11px] text-red-500 font-bold uppercase tracking-tighter hover:underline text-left px-1"
                        >
                          Зургийг устгах
                        </button>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">
                        PNG, JPG формат. Дээд хэмжээ 2МВ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Утасны дугаар</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlinePhone className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="+976 9911-XXXX"
                        type="text"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-semibold text-gray-700">
                        Идэвхтэй төлөв
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Имэйл хаяг</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineMail className="w-4 h-4" />
                    </div>
                    <input
                      defaultValue="warehouse@company.mn"
                      type="email"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-4">
                <label className={labelClass}>Хаяг байршил</label>
                <div className="relative group mt-1.5">
                  <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                  </div>
                  <textarea
                    className={`${baseInputClass} pl-10 resize-none`}
                    rows={3}
                    defaultValue="Улаанбаатар хот, Баянзүрх дүүрэг, 14-р хороо, Намъянжугийн гудамж"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Агуулах устгах
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Буцах
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-10 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <HiOutlineSave className="w-4 h-4" />
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Warehouse;
