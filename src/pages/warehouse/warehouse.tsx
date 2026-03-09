import React, { useState, useRef } from "react";
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

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Агуулахыг устгах уу?"
          description="Та энэ агуулахыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div>
        <div className="px-4 md:px-0">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                Агуулахууд
              </span>
              <span className="text-gray-400 font-medium mx-2">/</span>
              Test
            </div>
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            Доорх маягтын мэдээллийг өөрчилж бичлэгийг шинэчилнэ үү
          </p>
        </div>

        <div className="mt-6">
          <form
            className="bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-5 md:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Код
                  </label>
                  <input
                    type="text"
                    defaultValue="WH4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Нэр
                  </label>
                  <input
                    type="text"
                    defaultValue="Агуулах 4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Утас
                  </label>
                  <input
                    type="text"
                    defaultValue="+976 99114455"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    И-мэйл
                  </label>
                  <input
                    type="email"
                    defaultValue="warehouse@example.mn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Лого
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-1">
                        Зураггүй
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
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
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Солих
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => setLogoPreview(null)}
                        className="text-xs text-red-600 hover:underline text-left"
                      >
                        Зургийг устгах
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Хаяг
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  rows={3}
                  defaultValue="Улаанбаатар хот, Баянзүрх дүүрэг, 14-р хороо"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="active"
                  className="ml-2 text-sm text-gray-700 font-medium cursor-pointer"
                >
                  Идэвхтэй төлөв
                </label>
              </div>
            </div>

            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
              >
                Агуулах устгах
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 shadow-sm transition-colors uppercase tracking-wider"
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

export default Warehouse;
