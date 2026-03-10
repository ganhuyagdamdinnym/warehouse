import { useState, useRef, useEffect } from "react";
import { 
  HiChevronDown, 
  HiOutlineCalendar, 
  HiOutlineTag, 
  HiOutlineSearch,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";
import {HiOutlineHomeModern,HiOutlineArrowRight} from "react-icons/hi2";
const TransferEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const baseInputClass = "mt-1 block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none";
  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Шилжүүлгийг устгах уу?"
          description="Та энэ шилжүүлгийн бүртгэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй бөгөөд үлдэгдэлд нөлөөлж болзошгүй."
        />
      )}

      <div>
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <a href="#" className="text-blue-600 hover:underline">Шилжүүлэг</a>
                  <span className="text-gray-400 font-light">/</span>
                  <span className="text-gray-500 font-medium">Засах</span>
                </div>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Агуулах хоорондын шилжүүлгийн мэдээллийг шинэчилнэ үү
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl space-y-8 shadow-sm">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-6 border-b border-gray-50">
                <div className="relative group">
                  <label className={labelClass}>Огноо</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineCalendar className="w-4 h-4" />
                    </div>
                    <input type="date" className={`${baseInputClass} pl-10`} />
                  </div>
                </div>

                <div className="relative group">
                  <label className={labelClass}>Лавлах дугаар</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineTag className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="TR-2024-001" 
                      className={`${baseInputClass} pl-10`} 
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Logic: From -> To */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 w-full group">
                  <label className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 block">Хаанаас (Гарах агуулах)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <HiOutlineHomeModern className="w-4 h-4" />
                    </div>
                    <select className={`${baseInputClass} pl-10 border-blue-200 bg-white appearance-none cursor-pointer`}>
                      <option value="">Сонгох...</option>
                      {warehouses.map((wh) => (
                        <option key={wh} value={wh}>{wh}</option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                  </div>
                </div>

                <div className="hidden lg:flex bg-white p-3 rounded-full shadow-md text-blue-600 border border-blue-100">
                  <HiOutlineArrowRight className="w-6 h-6" />
                </div>

                <div className="flex-1 w-full group">
                  <label className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 block">Хаашаа (Орох агуулах)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <HiOutlineHomeModern className="w-4 h-4" />
                    </div>
                    <select className={`${baseInputClass} pl-10 border-blue-200 bg-white appearance-none cursor-pointer`}>
                      <option value="">Сонгох...</option>
                      {warehouses.map((wh) => (
                        <option key={wh} value={wh}>{wh}</option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2">
                <label className={labelClass}>Шилжүүлэх бараа материалын жагсаалт</label>
                <div className="mt-3 bg-gray-50/80 p-5 rounded-xl border border-gray-200/60 shadow-inner">
                  <div className="relative" ref={containerRef}>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <HiOutlineSearch className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={isOpen ? searchTerm : selectedValue || searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Бараа хайх эсвэл баркод уншуулах..."
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-10 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm"
                      />
                      <HiChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95">
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
                              <span className="text-[10px] bg-blue-100 px-2 py-1 rounded text-blue-600 font-bold uppercase">Нэмэх</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-400 text-sm">Хайлттай тохирох бараа олдсонгүй</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr className="text-left text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                          <th className="px-6 py-4 w-12 text-center">#</th>
                          <th className="px-6 py-4">Бараа</th>
                          <th className="px-6 py-4 text-center">Жин</th>
                          <th className="px-6 py-4 text-center w-40">Тоо ширхэг</th>
                          <th className="px-6 py-4 text-center">Нэгж</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-50 last:border-none">
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                            Жагсаалт хоосон байна. Бараа нэмнэ үү.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Notes and Attachments */}
             
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
  
  {/* Тайлбар хэсэг */}
  <div className="flex flex-col">
    <label className={labelClass}>Тэмдэглэл / Дэлгэрэнгүй</label>
    <div className="relative mt-1 flex-1 flex flex-col group">
      <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <HiOutlineDocumentText className="w-4 h-4" />
      </div>
      {/* flex-1 ашиглан үлдсэн бүх зайг дүүргэнэ */}
      <textarea
        className={`${baseInputClass} pl-10 resize-none flex-1 min-h-[120px]`}
        placeholder="Шилжүүлгийн тухай нэмэлт тайлбар..."
      />
    </div>
  </div>

  {/* Файл хуулах хэсэг */}
  <div className="flex flex-col">
    <label className={labelClass}>Хавсралт файлууд</label>
    <div className="mt-1 flex-1">
      <div className="h-full group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:bg-blue-50/30 hover:border-blue-400 flex flex-col items-center justify-center text-center">
        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
          <HiOutlineCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
        </div>
        <p className="mt-2 text-sm text-gray-600 font-medium">Баримтын зураг эсвэл PDF оруулах</p>
        <p className="text-[11px] text-gray-400 mt-1">.png, .jpg, .pdf, .docx, .xlsx</p>
      </div>
    </div>
  </div>

</div>

              {/* Status */}
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl w-fit pr-8 border border-indigo-100/50">
                <input
                  type="checkbox"
                  id="draft"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all"
                />
                <label htmlFor="draft" className="text-sm text-indigo-900 font-semibold cursor-pointer select-none">
                  Энэ бичилт ноорог төлөвтэй байна
                </label>
              </div>
            </div>

            {/* Sticky Footer Action */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl shadow-inner">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүртгэлийг устгах
              </button>
              
              <button
                type="submit"
                className="flex items-center gap-2 px-12 py-3 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-blue-600 active:scale-95 transition-all uppercase tracking-[2px] shadow-lg shadow-gray-200"
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

export default TransferEdit;