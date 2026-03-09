import { useState } from "react";
import {
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineFolderOpen,
  HiChevronDown,
  HiOutlinePlusCircle,
} from "react-icons/hi";

const CreateCategory = () => {
  const [parentCategory, setParentCategory] = useState("");

  const categories = [
    { id: "1", name: "Үндсэн агуулах" },
    { id: "2", name: "Туслах салбар" },
    { id: "3", name: "Электрон бараа" },
    { id: "4", name: "Ерөнхий" },
  ];

  // Styles
  const baseInputClass =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible bg-gray-50/30">
      <div>
        {/* Header */}
        <div className="px-4 md:px-0 md:col-span-1 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <HiOutlinePlusCircle className="w-7 h-7 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Шинэ ангилал үүсгэх
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Доорх формын дагуу мэдээллийг бөглөж бүртгэлийг үүсгэнэ үү
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-md">
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-6">
                  {/* Нэр */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Ангиллын нэр</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ангиллын нэр оруулна уу"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Код */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Код</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Жишээ: CAT01"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Эцэг ангилал */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Харьяалагдах ангилал</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineFolderOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                        className={`${baseInputClass} pl-10 appearance-none cursor-pointer bg-white`}
                      >
                        <option value="">Эцэг ангиллыг сонгоно уу</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-focus-within:text-blue-600">
                        <HiChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Хадгалах хэсэг */}
            <div className="flex items-center justify-end px-4 py-4 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-md">
              <div className="w-full flex items-center justify-between max-w-4xl">
                <div></div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center px-10 py-2.5 bg-blue-600 border border-transparent rounded-md font-bold text-sm text-white uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Хадгалах
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

export default CreateCategory;
