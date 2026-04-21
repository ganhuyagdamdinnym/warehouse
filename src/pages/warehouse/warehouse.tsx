import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineOfficeBuilding,
  HiOutlineHashtag,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineSave,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";

// ── Зургийг resize хийж base64 болгох ──────────────────────────────────
const resizeImage = (file: File, maxSize = 400): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Warehouse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Өгөгдөл татах
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/warehouses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Агуулах олдсонгүй");
        const data = await res.json();
        const wh = data.warehouse ?? data;
        setCode(wh.code || "");
        setName(wh.name || "");
        setPhone(wh.phone || "");
        setEmail(wh.email || "");
        setAddress(wh.address || "");
        setIsActive(wh.is_active ?? false);
        if (wh.logo) {
          setLogoPreview(wh.logo);
          setLogoBase64(wh.logo);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Өгөгдөл ачаалахад алдаа");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Зөвхөн зураг файл сонгоно уу");
    if (file.size > 2 * 1024 * 1024)
      return setError("Зургийн хэмжээ 2MB-аас хэтрэхгүй байх ёстой");
    try {
      const resized = await resizeImage(file, 400);
      setLogoPreview(resized);
      setLogoBase64(resized);
      setError(null);
    } catch {
      setError("Зураг боловсруулахад алдаа гарлаа");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError("Код болон нэр заавал бөглөнө.");
      return;
    }
    setError(null);
    try {
      setSaving(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/warehouses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim(),
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          is_active: isActive,
          logoImage: logoBase64 || null,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Алдаа гарлаа");
      navigate("/warehouses", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/warehouses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Устгахад алдаа гарлаа");
      setShowConfirm(false);
      navigate("/warehouses", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа");
      setShowConfirm(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  if (loading) {
    return (
      <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Агуулахыг устгах уу?"
          description="Та энэ агуулахын бүх мэдээллийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              <button
                onClick={() => navigate("/warehouses")}
                className="text-blue-600/60 font-medium hover:underline"
              >
                Агуулахууд
              </button>
              {" / "}Агуулах засах
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Агуулахын байршил, холбоо барих мэдээлэл болон логог шинэчлэх.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {error && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}

              {/* Basic Info + Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Агуулахын код</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineHashtag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="WH-001"
                        className={`${baseInputClass} pl-10 font-mono`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Агуулахын нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineOfficeBuilding className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Төв Агуулах"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-300">
                  <label className={`${labelClass} mb-3 block`}>
                    Байгууллагын лого
                  </label>
                  <div className="flex items-start gap-5">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-24 w-24 flex-shrink-0 border-2 border-white shadow-md rounded-lg bg-gray-100 overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity"
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <HiOutlinePhotograph className="w-8 h-8" />
                        </div>
                      )}
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded transition-opacity">
                          Солих
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
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
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                      >
                        Лого солих
                      </button>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview(null);
                            setLogoBase64(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="text-[11px] text-red-500 font-bold uppercase tracking-tighter hover:underline text-left px-1"
                        >
                          Зургийг устгах
                        </button>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">
                        PNG, JPG формат. Дээд хэмжээ 2МВ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Утасны дугаар</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlinePhone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+976 9911-XXXX"
                        className={`${baseInputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-semibold text-gray-700">
                        Идэвхтэй төлөв
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Имэйл хаяг</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <HiOutlineMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="warehouse@company.mn"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="pt-4">
                <label className={labelClass}>Хаяг байршил</label>
                <div className="relative group mt-1.5">
                  <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${baseInputClass} pl-10 resize-none`}
                    rows={3}
                    placeholder="Улаанбаатар хот, дүүрэг, хороо, гудамж..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Агуулах устгах
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/warehouses")}
                  className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Буцах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Warehouse;
