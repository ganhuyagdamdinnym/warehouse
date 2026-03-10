import { useState, useRef, useEffect } from "react";
import { 
  HiChevronDown, 
  HiOutlineCalendar, 
  HiOutlineTag, 
  HiOutlineAdjustments, 
  HiOutlineSearch,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineTrash
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";
import { HiOutlineHomeModern } from "react-icons/hi2";
const AdjustmentEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const warehouses = ["Агуулах 1", "Агуулах 2", "Агуулах 3", "Үндсэн агуулах"];
  const adjustmentTypes = ["Гэмтэл", "Дутагдал", "Илүүдэл", "Бусад"];
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
          title="Өөрчлөлтийг устгах уу?"
          description="Та энэ тохируулгын бүртгэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div>
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <h3 className="text-lg font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <a href="#" className="text-blue-600 hover:underline">Өөрчлөлт / Тохируулга</a>
              <span className="text-gray-400 font-light">/</span>
              <span className="text-gray-500 font-medium text-sm">Засах</span>
            </div>
          </h3>
          <p className="mt-1 text-sm text-gray-500">Тохируулгын мэдээллийг шинэчлэх</p>
        </div>

        <div className="mt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl space-y-8 shadow-sm">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className={labelClass}>Огноо</label>
                    <div className="relative mt-1">
                      <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input type="date" className={`${baseInputClass} pl-10`} />
                    </div>
                  </div>
                  <div className="group">
                    <label className={labelClass}>Лавлах дугаар</label>
                    <div className="relative mt-1">
                      <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input type="text" placeholder="ADJ-102" className={`${baseInputClass} pl-10`} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Төрөл</label>
                    <div className="relative mt-1">
                      <HiOutlineAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select className={`${baseInputClass} pl-10 appearance-none`}>
                        <option value="">Сонгох...</option>
                        {adjustmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Агуулах</label>
                    <div className="relative mt-1">
                      <HiOutlineHomeModern className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select className={`${baseInputClass} pl-10 appearance-none`}>
                        <option value="">Сонгох...</option>
                        {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Search */}
              <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-200/60 shadow-inner">
                <div className="relative" ref={containerRef}>
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={isOpen ? searchTerm : selectedValue || searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                      onFocus={() => setIsOpen(true)}
                      placeholder="Бараа нэмэх..."
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-10 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-sm"
                    />
                  </div>
                  {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {filteredItems.map((item, idx) => (
                        <div key={idx} className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-none" onClick={() => { setSelectedValue(item); setSearchTerm(item); setIsOpen(false); }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                      <tr className="text-left text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                        <th className="px-6 py-4">Бараа</th>
                        <th className="px-6 py-4 text-center">Жин</th>
                        <th className="px-6 py-4 text-center">Тоо ширхэг</th>
                        <th className="px-6 py-4 text-center">Нэгж</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">Тохируулах бараа сонгогдоогүй байна.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes and Attachments - Tentsuulsen ondortoi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col">
                  <label className={labelClass}>Тэмдэглэл / Дэлгэрэнгүй</label>
                  <div className="relative mt-1 flex-1 flex flex-col group">
                    <HiOutlineDocumentText className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 w-4 h-4" />
                    <textarea
                      className={`${baseInputClass} pl-10 resize-none flex-1 min-h-[140px]`}
                      placeholder="Өөрчлөлт хийсэн шалтгаан, дэлгэрэнгүй тайлбар..."
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className={labelClass}>Хавсралт файлууд</label>
                  <div className="mt-1 flex-1">
                    <div className="h-full group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:bg-blue-50/30 hover:border-blue-400 flex flex-col items-center justify-center text-center">
                      <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                        <HiOutlineCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <p className="mt-2 text-sm text-gray-600 font-medium">Баримтын зураг эсвэл файл оруулах</p>
                      <p className="text-[11px] text-gray-400 mt-1">Drag and drop or click</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl w-fit pr-8 border border-indigo-100/50">
                <input type="checkbox" id="draft" className="h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="draft" className="text-sm text-indigo-900 font-semibold cursor-pointer">Ноорог төлөвтэй хадгалах</label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-5 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Устгах
              </button>
              
              <button
                type="submit"
                className="px-12 py-3 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-blue-600 active:scale-95 transition-all uppercase tracking-[2px] shadow-lg shadow-gray-200"
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

export default AdjustmentEdit;