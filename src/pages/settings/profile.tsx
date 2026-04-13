import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { updatePassword, updateProfile } from "../../api/user/user";
import { getToken } from "../../utils/auth";
import { toast } from "react-hot-toast";
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineCamera,
  HiOutlineSave,
  HiOutlineKey,
} from "react-icons/hi";
import { useAuth } from "../../hooks/auth";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, setUser } = useAuth();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const token = getToken();
  if (!token) return null;

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // user ачаалагдсаны дараа form-г дүүргэнэ
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  // Нууц үгийн state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPhoto = (): void => fileInputRef.current?.click();
  const handleRemovePhoto = (): void => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Profile хадгалах ────────────────────────────────────────────────────
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim() && !profileData.email.trim()) {
      return toast.error("Нэр эсвэл имэйл оруулна уу");
    }
    // alert("hi");
    try {
      setProfileLoading(true);
      const res = await updateProfile({
        name: profileData.name.trim() || undefined,
        email: profileData.email.trim() || undefined,
      });
      toast.success(res.message);
      // Auth state шинэчлэх (хэрэв setUser байвал)
      if (setUser) setUser(res.user as any);
    } catch (error: any) {
      toast.error(error?.message || "Алдаа гарлаа");
      // alert("hiiiiii");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Нууц үг шинэчлэх ───────────────────────────────────────────────────
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return toast.error("Мэдээллээ бүрэн бөглөнө үү");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Шинэ нууц үгүүд зөрж байна");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой");
    }

    try {
      setPasswordLoading(true);
      const res = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(res.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.message || "Алдаа гарлаа");
    } finally {
      setPasswordLoading(false);
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";
  const sectionTitleClass =
    "text-xl font-bold text-gray-900 flex items-center gap-2";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section 1: Profile Information */}
        <section>
          <div className="mb-6 px-4 md:px-0">
            <h3 className={sectionTitleClass}>
              <HiOutlineUserCircle className="w-6 h-6 text-blue-600" />
              Хэрэглэгчийн мэдээлэл
            </h3>
          </div>

          <form
            onSubmit={handleUpdateProfile}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-8">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-inner bg-gray-100 overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-100">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiOutlineUserCircle className="w-20 h-20 text-gray-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectPhoto}
                    className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full shadow-lg text-blue-600 hover:bg-blue-50"
                  >
                    <HiOutlineCamera className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectPhoto}
                      className="px-4 py-2 bg-white border border-gray-300 rounded text-xs font-bold uppercase text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                      Зураг солих
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded text-xs font-bold uppercase hover:bg-red-100"
                      >
                        Устгах
                      </button>
                    )}
                  </div>
                  {/* Агуулах харуулах */}
                  {user?.warehouse && (
                    <p className="text-xs text-gray-400">
                      Агуулах:{" "}
                      <span className="font-semibold text-gray-600">
                        {user.warehouse}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClass}>Таны нэр</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <HiOutlineUserCircle className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Нэрээ оруулна уу"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Имэйл хаяг</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <HiOutlineMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="И-мэйл хаяг"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-md font-bold text-sm shadow-sm uppercase tracking-widest transition-all active:scale-95"
              >
                <HiOutlineSave className="w-4 h-4" />
                {profileLoading ? "Хадгалж байна..." : "Мэдээлэл хадгалах"}
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Password Update */}
        <section>
          <div className="mb-6 px-4 md:px-0">
            <h3 className={sectionTitleClass}>
              <HiOutlineLockClosed className="w-6 h-6 text-blue-600" />
              Нууц үг шинэчлэх
            </h3>
          </div>

          <form
            onSubmit={handleUpdatePassword}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-6 max-w-2xl">
              <div>
                <label className={labelClass}>Одоогийн нууц үг</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <HiOutlineKey className="w-4 h-4" />
                  </div>
                  <input
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    type="password"
                    placeholder="••••••••"
                    className={`${baseInputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Шинэ нууц үг</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <HiOutlineLockClosed className="w-4 h-4" />
                    </div>
                    <input
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      type="password"
                      placeholder="••••••••"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Баталгаажуулах</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <HiOutlineLockClosed className="w-4 h-4" />
                    </div>
                    <input
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      type="password"
                      placeholder="••••••••"
                      className={`${baseInputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                disabled={passwordLoading}
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
              >
                {passwordLoading ? "Түр хүлээнэ үү..." : "Нууц үг шинэчлэх"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
