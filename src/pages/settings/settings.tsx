import { useRef, useState, useEffect, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineSave,
  HiOutlineOfficeBuilding,
  HiOutlinePhotograph,
  HiChevronDown,
} from "react-icons/hi";
import { useAuth } from "../../hooks/auth";
import { request } from "../../api/client";

const resizeImage = (file: File, maxSize = 300): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
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

const Settings = () => {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const { user, setUser, isSuperAdmin } = useAuth();

  // Энгийн хэрэглэгч — өөрийн агуулах
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLogoPreview, setWarehouseLogoPreview] = useState("");
  const [warehouseLogoBase64, setWarehouseLogoBase64] = useState("");
  const [brandingLoading, setBrandingLoading] = useState(false);

  // SuperAdmin — аль агуулахыг засах сонголт
  const [allWarehouses, setAllWarehouses] = useState<
    { id: number; name: string; logo?: string }[]
  >([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null,
  );
  const [adminWarehouseName, setAdminWarehouseName] = useState("");
  const [adminLogoPreview, setAdminLogoPreview] = useState("");
  const [adminLogoBase64, setAdminLogoBase64] = useState("");
  const [adminBrandingLoading, setAdminBrandingLoading] = useState(false);
  const adminLogoRef = useRef<HTMLInputElement | null>(null);

  // Энгийн хэрэглэгчийн агуулах мэдээлэл ачаалах
  useEffect(() => {
    if (!isSuperAdmin) {
      request<any>("/warehouses/my")
        .then((data) => {
          setWarehouseName(data.name || "");
          if (data.logo) {
            setWarehouseLogoPreview(data.logo);
            setWarehouseLogoBase64(data.logo);
          }
        })
        .catch(() => {});
    }
  }, [isSuperAdmin]);

  // SuperAdmin-д бүх агуулахуудыг ачаалах
  useEffect(() => {
    if (isSuperAdmin) {
      request<any>("/warehouses?limit=100")
        .then((data) => {
          setAllWarehouses(data.data || []);
        })
        .catch(() => {});
    }
  }, [isSuperAdmin]);

  // SuperAdmin агуулах сонгоход мэдээллийг дүүргэнэ
  useEffect(() => {
    if (!selectedWarehouseId) return;
    const wh = allWarehouses.find((w) => w.id === selectedWarehouseId);
    if (wh) {
      setAdminWarehouseName(wh.name);
      if (wh.logo) {
        setAdminLogoPreview(wh.logo);
        setAdminLogoBase64(wh.logo);
      } else {
        setAdminLogoPreview("");
        setAdminLogoBase64("");
      }
    }
  }, [selectedWarehouseId, allWarehouses]);

  const pickImage = async (
    file: File,
    maxSize: number,
    setPreview: (s: string) => void,
    setBase64: (s: string) => void,
  ) => {
    if (!file.type.startsWith("image/"))
      return toast.error("Зөвхөн зураг файл сонгоно уу");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Зургийн хэмжээ 5MB-аас хэтрэхгүй байх ёстой");
    try {
      const resized = await resizeImage(file, maxSize);
      setPreview(resized);
      setBase64(resized);
    } catch {
      toast.error("Зураг боловсруулахад алдаа гарлаа");
    }
  };

  // Энгийн хэрэглэгч — өөрийн агуулах хадгалах
  const handleUpdateBranding = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setBrandingLoading(true);
      const res = await request<any>("/warehouses/branding", {
        method: "PUT",
        body: {
          name: warehouseName.trim() || undefined,
          logo: warehouseLogoBase64 || null,
        },
      });
      toast.success(res.message);
      if (warehouseName.trim() && setUser && user)
        setUser({ ...user, warehouse: warehouseName.trim() });
    } catch (error: any) {
      toast.error(error?.message || "Алдаа гарлаа");
    } finally {
      setBrandingLoading(false);
    }
  };

  // SuperAdmin — сонгосон агуулах хадгалах
  const handleAdminUpdateBranding = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouseId) return toast.error("Агуулах сонгоно уу");
    try {
      setAdminBrandingLoading(true);
      const res = await request<any>(
        `/warehouses/${selectedWarehouseId}/branding`,
        {
          method: "PUT",
          body: {
            name: adminWarehouseName.trim() || undefined,
            logo: adminLogoBase64 || null,
          },
        },
      );
      toast.success(res.message);
      // allWarehouses list шинэчлэх
      setAllWarehouses((prev) =>
        prev.map((wh) =>
          wh.id === selectedWarehouseId
            ? {
                ...wh,
                name: adminWarehouseName.trim() || wh.name,
                logo: adminLogoBase64 || wh.logo,
              }
            : wh,
        ),
      );
    } catch (error: any) {
      toast.error(error?.message || "Алдаа гарлаа");
    } finally {
      setAdminBrandingLoading(false);
    }
  };

  const base =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const lbl = "text-sm font-semibold text-gray-700 ml-0.5";
  const sec = "text-xl font-bold text-gray-900 flex items-center gap-2";

  // ── Logo upload block (reusable UI) ──────────────────────────────────
  const LogoUpload = ({
    preview,
    inputRef,
    onPick,
    onRemove,
    label,
  }: {
    preview: string;
    inputRef: React.RefObject<HTMLInputElement> | null;
    onPick: () => void;
    onRemove: () => void;
    label?: string;
  }) => (
    <div className="flex flex-col items-center gap-3 shrink-0">
      <div
        onClick={onPick}
        className="w-36 h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
      >
        {preview ? (
          <img
            src={preview}
            alt="Лого"
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <HiOutlinePhotograph className="w-9 h-9 text-gray-300 group-hover:text-blue-400 transition-colors" />
            <span className="text-[10px] text-gray-400 font-medium">
              {label || "ЛОГО"}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 items-center w-full">
        <button
          type="button"
          onClick={onPick}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold uppercase text-gray-700 hover:bg-gray-50 shadow-sm transition-colors w-full text-center"
        >
          {preview ? "Солих" : "Лого нэмэх"}
        </button>
        {preview && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs font-bold uppercase hover:bg-red-100 transition-colors w-full text-center"
          >
            Устгах
          </button>
        )}
      </div>
      <p className="text-[10px] text-gray-400 text-center">
        JPG, PNG — дээд тал 5MB
      </p>
    </div>
  );

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ── SuperAdmin: аль агуулахыг засах сонгох ── */}
        {isSuperAdmin ? (
          <section>
            <div className="mb-6 px-4 md:px-0">
              <h3 className={sec}>
                <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
                Агуулахын лого тохиргоо
              </h3>
              <p className="mt-1 text-sm text-gray-400 ml-0.5">
                Аль агуулахын лого болон нэрийг өөрчлөхийг сонгоно уу
              </p>
            </div>
            <form
              onSubmit={handleAdminUpdateBranding}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8 space-y-6">
                {/* Агуулах сонгох dropdown */}
                <div>
                  <label className={lbl}>Агуулах сонгох</label>
                  <div className="relative mt-1.5">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <HiOutlineOfficeBuilding className="w-4 h-4" />
                    </div>
                    <select
                      className={`${base} pl-10 appearance-none cursor-pointer`}
                      value={selectedWarehouseId ?? ""}
                      onChange={(e) =>
                        setSelectedWarehouseId(Number(e.target.value) || null)
                      }
                    >
                      <option value="">Агуулах сонгох...</option>
                      {allWarehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Сонгосны дараа лого + нэр засах */}
                {selectedWarehouseId && (
                  <div className="flex flex-col md:flex-row items-start gap-8 pt-4 border-t border-gray-100">
                    <input
                      type="file"
                      ref={adminLogoRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          pickImage(
                            f,
                            300,
                            setAdminLogoPreview,
                            setAdminLogoBase64,
                          );
                      }}
                    />
                    <LogoUpload
                      preview={adminLogoPreview}
                      inputRef={adminLogoRef}
                      onPick={() => adminLogoRef.current?.click()}
                      onRemove={() => {
                        setAdminLogoPreview("");
                        setAdminLogoBase64("");
                        if (adminLogoRef.current)
                          adminLogoRef.current.value = "";
                      }}
                    />

                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className={lbl}>Агуулахын нэр</label>
                        <div className="relative mt-1.5">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <HiOutlineOfficeBuilding className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={adminWarehouseName}
                            onChange={(e) =>
                              setAdminWarehouseName(e.target.value)
                            }
                            placeholder="Агуулахын нэр"
                            className={`${base} pl-10`}
                          />
                        </div>
                        <p className="text-xs text-amber-600 mt-1.5 ml-0.5">
                          ⚠️ Нэр өөрчлөгдвөл энэ агуулахтай холбоотой бүх
                          хэрэглэгчид нөлөөлнө.
                        </p>
                      </div>

                      {/* Урьдчилан харах */}
                      {(adminLogoPreview || adminWarehouseName) && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                          {adminLogoPreview ? (
                            <img
                              src={adminLogoPreview}
                              alt="лого"
                              className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-white p-1"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                              <HiOutlineOfficeBuilding className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {adminWarehouseName}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                              Урьдчилан харах
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={adminBrandingLoading || !selectedWarehouseId}
                  className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-md font-bold text-sm shadow-sm uppercase tracking-widest transition-all active:scale-95"
                >
                  <HiOutlineSave className="w-4 h-4" />
                  {adminBrandingLoading ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          /* ── Энгийн хэрэглэгч: өөрийн агуулах ── */
          <section>
            <div className="mb-6 px-4 md:px-0">
              <h3 className={sec}>
                <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
                Агуулахын тохиргоо
              </h3>
              <p className="mt-1 text-sm text-gray-400 ml-0.5">
                Өөрийн агуулахын нэр болон лого тохируулна уу
              </p>
            </div>
            <form
              onSubmit={handleUpdateBranding}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        pickImage(
                          f,
                          300,
                          setWarehouseLogoPreview,
                          setWarehouseLogoBase64,
                        );
                    }}
                  />
                  <LogoUpload
                    preview={warehouseLogoPreview}
                    inputRef={logoInputRef}
                    onPick={() => logoInputRef.current?.click()}
                    onRemove={() => {
                      setWarehouseLogoPreview("");
                      setWarehouseLogoBase64("");
                      if (logoInputRef.current) logoInputRef.current.value = "";
                    }}
                  />

                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <label className={lbl}>Агуулахын нэр</label>
                      <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <HiOutlineOfficeBuilding className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={warehouseName}
                          onChange={(e) => setWarehouseName(e.target.value)}
                          placeholder="Агуулахын нэр"
                          className={`${base} pl-10`}
                        />
                      </div>
                      <p className="text-xs text-amber-600 mt-1.5 ml-0.5">
                        ⚠️ Нэр өөрчлөгдвөл энэ агуулахтай холбоотой бүх
                        хэрэглэгчид нөлөөлнө.
                      </p>
                    </div>

                    {(warehouseLogoPreview || warehouseName) && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                        {warehouseLogoPreview ? (
                          <img
                            src={warehouseLogoPreview}
                            alt="лого"
                            className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-white p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                            <HiOutlineOfficeBuilding className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {warehouseName || user?.warehouse}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Урьдчилан харах
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={brandingLoading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-md font-bold text-sm shadow-sm uppercase tracking-widest transition-all active:scale-95"
                >
                  <HiOutlineSave className="w-4 h-4" />
                  {brandingLoading ? "Хадгалж байна..." : "Агуулах хадгалах"}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;
