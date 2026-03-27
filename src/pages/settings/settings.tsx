import { useState, useRef } from "react";
import {
  HiOutlineCog,
  HiOutlinePhotograph,
  HiOutlineOfficeBuilding,
  HiOutlineCheckCircle,
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";

const Settings = () => {
  const [siteName, setSiteName] = useState("Агуулахын систем");
  const [siteNameInput, setSiteNameInput] = useState("Агуулахын систем");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savedLogo, setSavedLogo] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [logoSaved, setLogoSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoSave = () => {
    setSavedLogo(logoPreview);
    setLogoSaved(true);
    setTimeout(() => setLogoSaved(false), 2500);
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setSavedLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNameSave = () => {
    setSiteName(siteNameInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4 md:px-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineCog className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Тохиргоо</h3>
            </div>
            <p className="text-sm text-gray-500">
              Системийн ерөнхий тохиргоог энд өөрчлөх боломжтой.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <HiOutlinePhotograph className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800 text-sm">Лого</h4>
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : savedLogo ? (
                    <img
                      src={savedLogo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <HiOutlineOfficeBuilding className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-2 text-center">
                  Урьдчилан харах
                </p>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  PNG, JPG, SVG формат. Хамгийн ихдээ{" "}
                  <span className="font-semibold">2MB</span>. Зураг квадрат
                  хэлбэртэй байвал зохимжтой.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <HiOutlineUpload className="w-4 h-4" />
                    Зураг сонгох
                  </button>

                  {logoPreview && (
                    <button
                      onClick={handleLogoSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                    >
                      {logoSaved ? (
                        <>
                          <HiOutlineCheckCircle className="w-4 h-4" />
                          Хадгалагдлаа
                        </>
                      ) : (
                        "Хадгалах"
                      )}
                    </button>
                  )}

                  {(logoPreview || savedLogo) && (
                    <button
                      onClick={handleLogoRemove}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 text-sm font-semibold rounded-md hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Устгах
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Site Name Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <HiOutlinePencil className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800 text-sm">
              Системийн нэр
            </h4>
          </div>

          <div className="p-5">
            <p className="text-sm text-gray-600 mb-4">
              Вэб хуудасны гарчиг болон навигацид харагдах нэрийг тохируулна уу.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Системийн нэр
                </label>
                <input
                  type="text"
                  value={siteNameInput}
                  onChange={(e) => setSiteNameInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Системийн нэрийг оруулна уу"
                />
              </div>
              <div className="sm:self-end">
                <button
                  onClick={handleNameSave}
                  disabled={!siteNameInput.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saved ? (
                    <>
                      <HiOutlineCheckCircle className="w-4 h-4" />
                      Хадгалагдлаа
                    </>
                  ) : (
                    "Хадгалах"
                  )}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Урьдчилан харах
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center overflow-hidden shrink-0">
                  {savedLogo ? (
                    <img
                      src={savedLogo}
                      alt="logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-bold text-gray-800 text-sm">
                  {siteNameInput || siteName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 italic">
            Тохиргооны өөрчлөлтүүд хадгалсны дараа системд тусгагдана.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
