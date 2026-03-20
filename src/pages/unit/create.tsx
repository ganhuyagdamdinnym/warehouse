import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineScale,
  HiOutlineHashtag,
  HiOutlineColorSwatch,
  HiChevronDown,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { createUnit, getUnits } from "../../api/unit/unit";

const CreateUnit = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");
  const [unitList, setUnitList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnits({ limit: 100 });
        setUnitList(res.data as { id: string; name: string }[]);
      } catch (err) {
        console.error("Нэгж татахад алдаа:", err);
      }
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !code.trim()) {
      setError("Нэгжийн нэр болон код заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await createUnit({
        name: name.trim(),
        code: code.trim(),
        parentId: parentId ? Number(parentId) : undefined,
      });
      navigate("/units", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const baseInputClass =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible bg-gray-50/30">
      <div>
        {/* Header */}
        <div className="px-4 md:px-0 md:col-span-1 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <HiOutlinePlusCircle className="w-7 h-7 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Шинэ нэгж үүсгэх
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Доорх формын дагуу мэдээллийг бөглөж бүртгэлийг үүсгэнэ үү
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-md">
              {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-6">
                  {/* Нэр */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Нэгжийн нэр</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineScale className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Нэгжийн нэр оруулна уу (Жишээ: Литр)"
                        className={`${baseInputClass} pl-10`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Код */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Код</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Жишээ: L, PCS, KG"
                        className={`${baseInputClass} pl-10`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Үндсэн нэгж сонгох */}
                  <div className="col-span-6 sm:col-span-4 relative">
                    <label className={labelClass}>
                      <span>Үндсэн нэгж</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineColorSwatch className="w-4 h-4" />
                      </div>
                      <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className={`${baseInputClass} pl-10 appearance-none cursor-pointer bg-white`}
                      >
                        <option value="">Нэгж сонгоно уу</option>
                        {unitList.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
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
            </div>

            {/* Хадгалах хэсэг */}
            <div className="flex items-center justify-end px-4 py-4 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-md">
              <div className="w-full flex items-center justify-between max-w-4xl">
                <div></div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/unit")}
                    className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center px-10 py-2.5 bg-blue-600 border border-transparent rounded-md font-bold text-sm text-white uppercase tracking-wider hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition-all"
                  >
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;
