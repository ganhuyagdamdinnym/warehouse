import { useState } from "react";
import {
  HiOutlineScale,
  HiOutlineHashtag,
  HiOutlineVariable,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";

const EditUnit = () => {
  const [parentCategory, setParentCategory] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = [
    { id: "1", name: "метр" },
    { id: "2", name: "ширхэг" },
    { id: "3", name: "килограмм" },
  ];

  const handleDelete = () => {
    console.log("Устгасан");
    setShowConfirm(false);
  };

  // Styles
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Нэгжийг устгах уу?"
          description="Та энэ хэмжих нэгжийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineScale className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Нэгж засах</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Хэмжих нэгж болон хөрвүүлэх дүрмийг тохируулах.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineVariable className="w-4 h-4" />
                      </div>
                      <input
                        defaultValue="имбмр"
                        type="text"
                        placeholder="Нэгжийн нэр"
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
                        defaultValue="U-001"
                        type="text"
                        placeholder="Жишээ: KG, PCS"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Үндсэн нэгж</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineSwitchHorizontal className="w-4 h-4" />
                      </div>
                      <select
                        value={parentCategory}
                        onChange={(e) => {
                          setParentCategory(e.target.value);
                        }}
                        className={`${baseInputClass} pl-10 bg-white appearance-none cursor-pointer`}
                      >
                        <option value="">Нэгж сонгоно уу</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
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

export default EditUnit;
