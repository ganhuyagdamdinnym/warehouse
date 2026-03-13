import { useState, useRef, useEffect, type ChangeEvent } from "react";
import {
  HiChevronDown,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiX,
  HiOutlineSearch,
  HiOutlineCalendar,
} from "react-icons/hi";

const CreateCheckOut = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemsList, setSelectedItemsList] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contacts = ["Марианна Аптон", "Жон Доу", "Алис Смит", "Боб Браун"];
  const warehouses = ["Агуулах 1", "Агуулах 2", "Агуулах 3", "Үндсэн агуулах"];
  const items = [
    "Бүтээгдэхүүн 1 - Агуулах А",
    "Бүтээгдэхүүн 2 - Агуулах Б",
    "Бараа 3 - С хэсэг",
    "Сэлбэг хэрэгсэл 4",
  ];

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  const handleSelectItem = (item: string) => {
    const newItem = {
      id: Date.now(),
      name: item,
      weight: 1,
      quantity: 1,
      unit: "Хайрцаг",
    };
    setSelectedItemsList([...selectedItemsList, newItem]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const removeItem = (id: number) => {
    setSelectedItemsList(selectedItemsList.filter((item) => item.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Reusable Blue Input Style
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const tableInputClass =
    "w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="px-4 md:px-0 mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            Шинэ зарлага үүсгэх
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Бараа материалын зарлагын баримт шинээр үүсгэх.
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                {/* Main Fields Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 ml-0.5">
                        Огноо
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                          <HiOutlineCalendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          className={`${baseInputClass} pl-10 accent-blue-600 cursor-pointer`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 ml-0.5">
                        Лавлах дугаар
                      </label>
                      <input
                        placeholder="Дугаар оруулна уу"
                        type="text"
                        className={baseInputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 ml-0.5">
                        Харилцагч
                      </label>
                      <select className={baseInputClass}>
                        <option value="">Харилцагч сонгох</option>
                        {contacts.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 ml-0.5">
                        Агуулах
                      </label>
                      <select className={baseInputClass}>
                        <option value="">Агуулах сонгох</option>
                        {warehouses.map((wh) => (
                          <option key={wh} value={wh}>
                            {wh}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Item Selection Section */}
                <div className="pt-4">
                  <div className="relative mb-6" ref={containerRef}>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block ml-0.5">
                      Бараа нэмэх
                    </label>
                    <div className="relative group">
                      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Бараа хайх болон сонгох..."
                        className={`${baseInputClass} pl-10 py-2.5 bg-gray-50/50 group-focus-within:bg-white`}
                      />
                      <HiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none"
                              onClick={() => handleSelectItem(item)}
                            >
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-400 text-xs text-center">
                            Илэрц олдсонгүй
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Table */}
                  <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left text-gray-600 font-bold">
                          <th className="px-4 py-3.5 w-12 text-center text-gray-400">
                            #
                          </th>
                          <th className="px-4 py-3.5 uppercase tracking-wider text-[11px]">
                            Бараа
                          </th>
                          <th className="px-4 py-3.5 uppercase tracking-wider text-[11px] w-32">
                            Жин (кг)
                          </th>
                          <th className="px-4 py-3.5 uppercase tracking-wider text-[11px] w-32">
                            Тоо хэмжээ
                          </th>
                          <th className="px-4 py-3.5 uppercase tracking-wider text-[11px] w-44">
                            Хэмжих нэгж
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {selectedItemsList.length > 0 ? (
                          selectedItemsList.map((row) => (
                            <tr
                              key={row.id}
                              className="hover:bg-blue-50/20 transition-colors"
                            >
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeItem(row.id)}
                                  className="text-gray-300 hover:text-red-600 transition-colors"
                                >
                                  <HiOutlineTrash className="w-5 h-5" />
                                </button>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800">
                                {row.name}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  defaultValue={row.weight}
                                  className={tableInputClass}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  defaultValue={row.quantity}
                                  className={tableInputClass}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="relative group">
                                  <select
                                    className={`${tableInputClass} appearance-none pr-8 cursor-pointer`}
                                  >
                                    <option>Хайрцаг (Box)</option>
                                    <option>Ширхэг (Piece)</option>
                                    <option>Боодол (Pack)</option>
                                  </select>
                                  <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-600" />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-16 text-center text-gray-400 italic bg-gray-50/30"
                            >
                              Бараа нэмэгдээгүй байна. Дээрх хайлтаар бараагаа
                              сонгоно уу.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Secondary Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block ml-0.5">
                      Хавсралт файлууд
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                      <HiOutlinePaperClip className="text-gray-400 group-hover:text-blue-600 w-8 h-8 mb-2" />
                      <p className="text-xs text-gray-600 font-medium text-center">
                        <span className="text-blue-600 font-bold">
                          Файл хуулах
                        </span>{" "}
                        эсвэл энд чирч оруулна уу
                      </p>
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-100 text-xs font-medium"
                        >
                          <span className="truncate max-w-[140px]">
                            {file.name}
                          </span>
                          <HiX
                            className="cursor-pointer hover:text-blue-900"
                            onClick={() =>
                              setUploadedFiles((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block ml-0.5">
                      Дэлгэрэнгүй тайлбар
                    </label>
                    <textarea
                      className={`${baseInputClass} resize-none`}
                      rows={5}
                      placeholder="Нэмэлт тэмдэглэл..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Энэ бүртгэлийг ноорог (draft) хэлбэрээр хадгалах
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-4">
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-95"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckOut;
