import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineSave,
} from "react-icons/hi";
import { createRole } from "../../api/role/role";

const permissionModules = [
  { id: "warehouse", name: "Агуулах" },
  { id: "products", name: "Бараа материал" },
  { id: "users", name: "Хэрэглэгчид" },
  { id: "orders", name: "Захиалга" },
  { id: "reports", name: "Тайлан" },
];

type PermissionKey = "canView" | "canCreate" | "canEdit" | "canDelete";

interface PermissionRow {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const actions: { key: PermissionKey; label: string }[] = [
  { key: "canView", label: "Харах" },
  { key: "canCreate", label: "Үүсгэх" },
  { key: "canEdit", label: "Засах" },
  { key: "canDelete", label: "Устгах" },
];

const defaultPermissions = (): PermissionRow[] =>
  permissionModules.map((m) => ({
    module: m.id,
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  }));

const CreateRole = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [permissions, setPermissions] =
    useState<PermissionRow[]>(defaultPermissions());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (moduleId: string, key: PermissionKey) => {
    setPermissions((prev) =>
      prev.map((p) => (p.module === moduleId ? { ...p, [key]: !p[key] } : p)),
    );
  };

  // Toggle entire row
  const toggleRow = (moduleId: string, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === moduleId
          ? {
              ...p,
              canView: checked,
              canCreate: checked,
              canEdit: checked,
              canDelete: checked,
            }
          : p,
      ),
    );
  };

  const isRowFull = (p: PermissionRow) =>
    p.canView && p.canCreate && p.canEdit && p.canDelete;

  const handleClear = () => {
    setName("");
    setPermissions(defaultPermissions());
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Эрхийн нэр оруулна уу.");
      return;
    }

    try {
      setSaving(true);
      await createRole({ name: name.trim(), permissions });
      navigate("/roles", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineShieldCheck className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Шинэ эрх (Role) үүсгэх
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Системийн функцуудад хандах эрхийн түвшинг тодорхойлох.
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

              {/* Role Name */}
              <div className="max-w-md">
                <label className={labelClass}>Эрхийн нэр</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineKey className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Жишээ: Оператор, Менежер"
                    className={`${baseInputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
                  Модулийн зөвшөөрлүүд
                </h4>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3">Модуль</th>
                        {actions.map((a) => (
                          <th key={a.key} className="px-4 py-3 text-center">
                            {a.label}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center text-gray-400">
                          Бүгд
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {permissionModules.map((module) => {
                        const perm = permissions.find(
                          (p) => p.module === module.id,
                        )!;
                        return (
                          <tr
                            key={module.id}
                            className="hover:bg-blue-50/30 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {module.name}
                            </td>
                            {actions.map((a) => (
                              <td key={a.key} className="px-4 py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={perm[a.key]}
                                  onChange={() => toggle(module.id, a.key)}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                            ))}
                            {/* Select all in row */}
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isRowFull(perm)}
                                onChange={(e) =>
                                  toggleRow(module.id, e.target.checked)
                                }
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Цэвэрлэх
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-12 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
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
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
