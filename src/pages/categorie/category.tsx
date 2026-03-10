import React, { useState } from "react";
import {
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineFolderOpen,
  HiOutlineTrash,
  HiOutlineSave,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";

const Category = () => {
  const [parentCategory, setParentCategory] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = [
    { id: "1", name: "Үндсэн агуулах" },
    { id: "2", name: "Туслах салбар" },
    { id: "3", name: "Электрон бараа" },
    { id: "4", name: "Ерөнхий" },
  ];

  const handleDelete = () => {
    console.log("Устгасан");
    setShowConfirm(false);
  };

  // Styles (Matching previous layouts)
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Ангиллыг устгах уу?"
          description="Та энэ ангиллыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineTag className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Ангилал засах</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Бараа материалын ангилал, төрлийн мэдээллийг шинэчлэх.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Form Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Ангиллын нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="Ангиллын нэр"
                        type="text"
                        placeholder="Жишээ: Сэлбэг хэрэгсэл"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="CAT-001"
                        type="text"
                        placeholder="CAT-000"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Hierarchy */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Харьяалагдах ангилал</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineFolderOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                        className={`${baseInputClass} pl-10 bg-white appearance-none cursor-pointer`}
                      >
                        <option value="">Эцэг ангиллыг сонгоно уу</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-400 italic">
                      * Хэрэв үндсэн ангилал бол хоосон үлдээнэ үү.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүртгэлийг устгах
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

export default Category;