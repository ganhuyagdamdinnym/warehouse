import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  HiChevronDown,
  HiOutlineTrash,
  HiOutlinePaperClip,
  HiX,
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
    "Цахилгаан хэрэгсэл 5",
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
      unit: "Хайрцаг", // Default unit in Mongolian
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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div>
        <div className="px-4 md:px-0 md:col-span-1">
          <h3 className="text-lg font-bold text-gray-900">
            Шинэ зарлага үүсгэх
          </h3>
          <p className="mt-1 text-gray-600">
            Шинэ бүртгэл нэмэхийн тулд доорх маягтыг бөглөнө үү.
          </p>
        </div>

        <div className="mt-6">
          <form>
            <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
              <div className="grid gap-6">
                <div className="flex flex-col gap-6">
                  {/* Дээд хэсгийн талбарууд */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Огноо</span>
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Лавлах дугаар</span>
                        </label>
                        <input
                          placeholder="Дугаар оруулна уу"
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Харилцагч</span>
                        </label>
                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm">
                          <option value="">Харилцагч сонгох</option>
                          {contacts.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Агуулах</span>
                        </label>
                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm">
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

                  {/* Бараа хайх болон Хүснэгтийн хэсэг */}
                  <div className="p-4 md:px-6 bg-gray-50 -mx-4 md:-mx-6">
                    <div
                      className="col-span-6 sm:col-span-4 relative mb-2"
                      ref={containerRef}
                    >
                      <div className="relative flex items-center">
                        <label className="inline-block cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 border border-transparent p-1 text-gray-400">
                          <HiChevronDown
                            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                          }}
                          onFocus={() => setIsOpen(true)}
                          placeholder="Бараа хайх болон сонгох..."
                          className="pr-8 mt-1 border rounded-md shadow-xs py-2 pl-4 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none block w-full transition-all"
                        />
                      </div>

                      {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-50 last:border-none"
                                onClick={() => handleSelectItem(item)}
                              >
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-400 text-sm">
                              Илэрц олдсонгүй
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white mt-4 rounded-md shadow-sm overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left font-bold border-b">
                            <th className="px-2 lg:pl-6 py-4 w-10">
                              <HiOutlineTrash className="text-gray-400" />
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-sm uppercase text-gray-600">
                              Бараа
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56 text-sm uppercase text-gray-600">
                              Жин
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56 text-sm uppercase text-gray-600">
                              Тоо хэмжээ
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56 text-sm uppercase text-gray-600">
                              Нэгж
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItemsList.length > 0 ? (
                            selectedItemsList.map((row) => (
                              <tr
                                key={row.id}
                                className="border-t hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-2 lg:pl-6 py-4">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(row.id)}
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <HiOutlineTrash className="w-5 h-5" />
                                  </button>
                                </td>
                                <td className="px-2 lg:px-6 py-4 text-gray-700 font-medium">
                                  {row.name}
                                </td>
                                <td className="px-2 lg:px-6 py-4">
                                  <input
                                    type="text"
                                    defaultValue={row.weight}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                  />
                                </td>
                                <td className="px-2 lg:px-6 py-4">
                                  <input
                                    type="number"
                                    defaultValue={row.quantity}
                                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                  />
                                </td>
                                <td className="px-2 lg:px-6 py-4">
                                  <select className="w-full border border-gray-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 outline-none">
                                    <option>Хайрцаг</option>
                                    <option>Боодол</option>
                                    <option>Ширхэг</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="border-t px-2 lg:px-6 py-4 text-gray-500"
                              >
                                Хайх эсвэл баркод уншуулан бараа нэмнэ үү
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Хавсралт файлын хэсэг */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Хавсралт файлууд
                    </label>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".png,.jpg,.pdf,.docx,.xlsx,.zip"
                    />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-gray-300 mt-1 flex flex-col justify-center items-center px-6 py-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      <div className="space-y-1 text-center">
                        <p className="text-gray-600">
                          <span className="text-blue-600 font-semibold">
                            Энд дарж хуулна уу
                          </span>{" "}
                          эсвэл файлаа чирч оруулна уу
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF, DOCX, XLSX болон ZIP
                        </p>
                      </div>
                    </div>

                    {/* Хуулсан файлуудыг харуулах */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-md text-sm text-blue-700"
                          >
                            <HiOutlinePaperClip />
                            <span className="truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-blue-400 hover:text-blue-600"
                            >
                              <HiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Дэлгэрэнгүй болон Ноорог */}
                  <div className="col-span-6 sm:col-span-4">
                    <label className="font-medium text-gray-700">
                      <span>Дэлгэрэнгүй тайлбар</span>
                    </label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      rows={3}
                      placeholder="Тайлбараа энд бичнэ үү..."
                    ></textarea>
                  </div>
                  <div className="flex mb-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="draft"
                        className="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200/50"
                      />
                      <span className="ml-2 text-gray-600">
                        Энэ бүртгэлийг ноорог төлөвтэй хадгалах
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Хөл хэсэг (Footer) */}
            <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
              <button
                type="button"
                className="relative flex items-center justify-center px-6 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 transition-all duration-150"
              >
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckOut;
