import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlineKey,
} from "react-icons/hi";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPhoto = (): void => fileInputRef.current?.click();

  const handleRemovePhoto = (): void => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent): void => e.preventDefault();

  // Consistent Styles
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";
  const sectionTitleClass =
    "text-xl font-bold text-gray-900 flex items-center gap-2";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section 1: Profile Information */}
        <section>
          <div className="mb-6 px-4 md:px-0">
            <h3 className={sectionTitleClass}>
              <HiOutlineUserCircle className="w-6 h-6 text-blue-600" />
              Хэрэглэгчийн мэдээлэл
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Та өөрийн бүртгэлийн мэдээлэл болон профайл зургаа шинэчилнэ үү.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-inner bg-gray-100 overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-100">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiOutlineUserCircle className="w-20 h-20 text-gray-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectPhoto}
                    className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <HiOutlineCamera className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectPhoto}
                      className="px-4 py-2 bg-white border border-gray-300 rounded text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                    >
                      Зураг солих
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-all"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Зөвшөөрөгдөх формат: JPG, PNG. Дээд хэмжээ: 5MB
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClass}>Таны нэр</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineUserCircle className="w-4 h-4" />
                    </div>
                    <input
                      defaultValue="Sanchir Ganbold"
                      type="text"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Имэйл хаяг</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineMail className="w-4 h-4" />
                    </div>
                    <input
                      defaultValue="sanchir@infitech.mn"
                      type="email"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95 uppercase tracking-widest"
              >
                <HiOutlineSave className="w-4 h-4" />
                Мэдээлэл хадгалах
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Password Update */}
        <section>
          <div className="mb-6 px-4 md:px-0">
            <h3 className={sectionTitleClass}>
              <HiOutlineLockClosed className="w-6 h-6 text-blue-600" />
              Нууц үг шинэчлэх
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Аюулгүй байдлаа хангахын тулд тогтмол нууц үгээ сольж байхыг
              зөвлөж байна.
            </p>
          </div>

          <form className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6 max-w-2xl">
              <div>
                <label className={labelClass}>Одоогийн нууц үг</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineKey className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`${baseInputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Шинэ нууц үг</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineLockClosed className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Баталгаажуулах</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineLockClosed className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95 uppercase tracking-widest"
              >
                Нууц үг шинэчлэх
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
