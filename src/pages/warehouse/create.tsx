import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHashtag,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlinePhotograph,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { HiOutlineHomeModern, HiOutlineMapPin } from "react-icons/hi2";
import { createWarehouse } from "../../api/warehouse/warehouse";

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim() || !name.trim()) {
      setError("Код болон нэр заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await createWarehouse({
        code: code.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        is_active: isActive ? 1 : 0,
      });
      navigate("/warehouses", { replace: true });
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
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto bg-gray-50/30">
      <div>
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <HiOutlinePlusCircle className="w-7 h-7 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Шинэ агуулах нэмэх
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Шинэ бүртгэл үүсгэхийн тулд доорх формыг бөглөнө үү.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form
            className="bg-white border border-gray-200 md:rounded-md overflow-hidden"
            onSubmit={handleSubmit}
          >
            <div className="px-4 py-6 md:p-8 space-y-6 max-w-5xl">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              {/* Код & Нэр */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className={labelClass}>Код</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlineHashtag className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Агуулахын код"
                      className={`${baseInputClass} pl-10`}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className={labelClass}>Нэр</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlineHomeModern className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Агуулахын нэр"
                      className={`${baseInputClass} pl-10`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Утас & И-мэйл */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className={labelClass}>Утас</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlinePhone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Утасны дугаар"
                      className={`${baseInputClass} pl-10`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className={labelClass}>И-мэйл</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                      <HiOutlineMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="И-мэйл хаяг"
                      className={`${baseInputClass} pl-10`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Лого */}
              <div className="group">
                <label className={labelClass}>Лого</label>
                <div className="mt-2 flex items-center gap-5">
                  <div className="h-24 w-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden transition-colors group-hover:border-blue-200">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <HiOutlinePhotograph className="w-8 h-8 text-gray-300" />
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
                      className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Зураг сонгох
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => setLogoPreview(null)}
                        className="text-xs text-red-500 font-medium hover:underline text-left"
                      >
                        Устгах
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Хаяг */}
              <div className="relative group">
                <label className={labelClass}>Хаяг</label>
                <div className="relative mt-1">
                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                    <HiOutlineMapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    className={`${baseInputClass} pl-10 resize-none`}
                    rows={3}
                    placeholder="Агуулахын байршил, дэлгэрэнгүй хаяг..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Идэвхтэй төлөв */}
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg w-fit pr-6 border border-blue-100/50">
                <input
                  type="checkbox"
                  id="active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-all"
                />
                <label
                  htmlFor="active"
                  className="text-sm text-gray-700 font-bold cursor-pointer"
                >
                  Идэвхтэй төлөв
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end md:px-8">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/warehouse")}
                  className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-10 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition-all shadow-blue-100 uppercase tracking-wider"
                >
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWarehouse;
