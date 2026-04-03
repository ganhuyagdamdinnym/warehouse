import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserAdd,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
  HiOutlineSave,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { createUser } from "../../api/user/user_api";
import { getWarehouses } from "../../api/warehouse/warehouse_api";

const CreateUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouseList, setWarehouseList] = useState<
    { id: string; name: string }[]
  >([]);

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [superAdmin, setSuperAdmin] = useState(false);

  const handleClear = () => {
    setName("");
    setUserName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setWarehouse("");
    setSuperAdmin(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !userName.trim() || !password || !warehouse) {
      setError("Нэр, хэрэглэгчийн нэр, нууц үг, агуулах заавал бөглөнө.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна.");
      return;
    }
    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.");
      return;
    }

    try {
      setSaving(true);
      await createUser({
        name: name.trim(),
        userName: userName.trim(),
        password,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        warehouse,
        superAdmin,
        permission: superAdmin ? "canEdit" : "canView",
      });
      navigate("/users", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await getWarehouses({ limit: 100 });
        setWarehouseList(res.data);
      } catch (err) {
        console.error("Агуулах татахад алдаа:", err);
      }
    };
    fetchWarehouses();
  }, []);

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineUserAdd className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Шинэ хэрэглэгч үүсгэх
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Системд нэвтрэх хэрэглэгчийн бүртгэл болон эрхийг тохируулах.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineUser className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Нэр оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Хэрэглэгчийн нэр (Username)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineUser className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Username оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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
                        type="email"
                        placeholder="Email оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Утасны дугаар</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlinePhone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Утасны дугаар оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Нууц үг</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineLockClosed className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`${baseInputClass} pl-10`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                      >
                        {showPassword ? (
                          <HiOutlineEyeOff className="w-4 h-4" />
                        ) : (
                          <HiOutlineEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Нууц үг баталгаажуулах</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineLockClosed className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className={`${baseInputClass} pl-10`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Агуулах сонгох</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineOfficeBuilding className="w-4 h-4" />
                      </div>
                      <select
                        className={`${baseInputClass} pl-10 appearance-none bg-white cursor-pointer`}
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                      >
                        <option value="">Агуулах сонгоно уу</option>
                        {warehouseList.map((wh) => (
                          <option key={wh.id} value={wh.name}>
                            {wh.name}
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
                  </div>
                </div>
              </div>

              {/* ── Эрх тохируулах ── */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
                  Эрх болон Зөвшөөрөл
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SuperAdmin card */}
                  <div
                    onClick={() => setSuperAdmin(true)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      superAdmin
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          superAdmin ? "border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {superAdmin && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Super Admin
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Бүх агуулахын бүх өгөгдлийг удирдах эрхтэй
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Энгийн хэрэглэгч card */}
                  <div
                    onClick={() => setSuperAdmin(false)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      !superAdmin
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          !superAdmin ? "border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {!superAdmin && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Энгийн хэрэглэгч
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Зөвхөн өөрийн агуулахын өгөгдлийг харах, засах эрхтэй
                        </p>
                      </div>
                    </div>
                  </div>
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
                className="flex items-center gap-2 px-12 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
              >
                <HiOutlineSave className="w-4 h-4" />
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
