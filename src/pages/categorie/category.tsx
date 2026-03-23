import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineFolderOpen,
  HiOutlineTrash,
  HiOutlineSave,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";
import {
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../api/category/category";
import type { Category } from "../../models/types/category";

const CategoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [categoryRes, listRes] = await Promise.all([
          getCategory(id),
          getCategories({ limit: 100 }),
        ]);
        setName(categoryRes.name ?? "");
        setCode(categoryRes.code ?? "");
        setParentId(categoryRes.parentId ?? "");
        // Exclude current category from parent options
        setCategories(listRes.data.filter((c) => c.id !== id));
      } catch (err: any) {
        setError(err.message ?? "Өгөгдөл татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Ангиллын нэр оруулна уу.");
      return;
    }
    try {
      setSaving(true);
      await updateCategory(id!, {
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

  const handleDelete = async () => {
    try {
      await deleteCategory(id!);
      navigate("/categories", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Устгахад алдаа гарлаа.");
    } finally {
      setShowConfirm(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  if (loading) {
    return (
      <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
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
          Уншиж байна...
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Ангиллыг устгах уу?"
          description="Та энэ ангиллыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineTag className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Ангилал засах</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Бараа материалын ангилал, төрлийн мэдээллийг шинэчлэх.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Ангиллын нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Жишээ: Сэлбэг хэрэгсэл"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="CAT-000"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Hierarchy */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Харьяалагдах ангилал</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineFolderOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className={`${baseInputClass} pl-10 bg-white appearance-none cursor-pointer`}
                      >
                        <option value="">Эцэг ангиллыг сонгоно уу</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-400 italic">
                      * Хэрэв үндсэн ангилал бол хоосон үлдээнэ үү.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүртгэлийг устгах
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Буцах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                    <>
                      <HiOutlineSave className="w-4 h-4" />
                      Хадгалах
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;
