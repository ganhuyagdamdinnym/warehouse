import { useState, useRef, useEffect } from "react";
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

const CheckinEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const contacts = ["Marianna Upton", "John Doe", "Alice Smith", "Bob Brown"];
  const warehouses = ["Агуулах 1", "Агуулах 2", "Агуулах 3", "Үндсэн агуулах"];
  const items = [
    "Бүтээгдэхүүн 1 - Агуулах А",
    "Бүтээгдэхүүн 2 - Агуулах Б",
    "Бараа 3 - Хадгалах C",
    "Сэлбэг хэрэгсэл 4",
    "Цахим төхөөрөмж 5",
  ];
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleDelete = () => {
    console.log("Устгасан");
    setShowConfirm(false);
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none";
  const labelClass = "text-sm font-semibold text-gray-700";

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
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <a href="#" className="text-blue-600 hover:underline">
                Орлого
              </a>
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
              {/* Top Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side */}
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
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-6">
                  <div className="relative group">
                    <label className={labelClass}>Харилцагч</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineUserGroup className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                      >
                        <option value="">Харилцагч сонгох</option>
                        {contacts.map((contact) => (
                          <option key={contact} value={contact}>
                            {contact}
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

              {/* Item Search & Table Section */}
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
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-none"
                              onClick={() => {
                                setSelectedValue(item);
                                setSearchTerm(item);
                                setIsOpen(false);
                              }}
                            >
                              <span>{item}</span>
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase font-bold text-gray-400">
                                Сонгох
                              </span>
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
                          <th className="px-6 py-4 text-center">Нэгж</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-gray-400 italic"
                          >
                            Жагсаалт хоосон байна. Дээрх хайлтаар бараа нэмнэ
                            үү.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Attachments & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Column: File Upload */}
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

                {/* Right Column: Textarea */}
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
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50/50 rounded-lg w-fit pr-6 border border-yellow-100">
                <input
                  type="checkbox"
                  id="draft"
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

            {/* Footer Actions */}
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
                  className="text-gray-500 hover:text-gray-700 font-bold text-sm"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-wider shadow-lg shadow-blue-200"
                >
                  Шинэчлэх
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
