import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineFolderOpen,
  HiChevronDown,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { createCategory, getCategories } from "../../api/category/category";
import type { Category } from "../../models/types/category";

const CreateCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories({ limit: 100 })
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Ангиллын нэр оруулна уу.");
      return;
    }

    try {
      setSaving(true);
      await createCategory({
        name: name.trim(),
        code: code.trim() || undefined,
        parentId: parentId || null,
      });
      navigate("/categories", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HiOutlinePlusCircle className="w-7 h-7 text-blue-600" />
            </div>
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
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl shadow-sm">
              {/* Error Banner */}
              {error && (
                <div className="mb-6 flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-y-6">
                {/* Name and Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 relative">
                    <label className={labelClass}>Ангиллын нэр</label>
                    <div className="relative group mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ангиллын нэр оруулна уу"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Код</label>
                    <div className="relative group mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="CAT01"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Category */}
                <div className="relative">
                  <label className={labelClass}>Харьяалагдах ангилал</label>
                  <div className="relative group mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlineFolderOpen className="w-4 h-4" />
                    </div>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className={`${baseInputClass} pl-10 appearance-none cursor-pointer bg-white`}
                    >
                      <option value="">Үндсэн (Эцэг ангилал байхгүй)</option>
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

            {/* Footer */}
            <div className="flex items-center justify-end px-4 py-4 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/category")}
                  className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4 py-2"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-10 py-2.5 bg-blue-600 border border-transparent rounded-md font-bold text-sm text-white uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-md shadow-blue-100"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Хадгалж байна...
                    </>
                  ) : (
                    "Хадгалах"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
