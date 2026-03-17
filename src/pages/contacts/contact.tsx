import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineIdentification,
} from "react-icons/hi";
import { Confirmation } from "../../components/confirmation";
import {
  getContact,
  updateContact,
  deleteContact,
} from "../../api/contact/contact_api";

const ContactPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getContact(id);
        if (cancelled) return;
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setDetails(data.details || "");
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Өгөгдөл ачаалахад алдаа.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    if (!name.trim()) {
      setError("Нэр заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await updateContact(id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        details: details.trim() || undefined,
      });
      navigate("/contacts", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шинэчлэхэд алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteContact(id);
      setShowConfirm(false);
      navigate("/contacts", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгахад алдаа гарлаа.");
    }
  };

  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  if (loading) {
    return (
      <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Холбоо барих хаяг устгах уу?"
          description="Та энэ хэрэглэгчийн холбоо барих мэдээллийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineIdentification className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Холбоо барих</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Холбоо барих мэдээллийг шинэчлэх, өөрчлөх.
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

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Нэр</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <HiOutlineUser className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${baseInputClass} pl-10`}
                        placeholder="Бүтэн нэр"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${baseInputClass} pl-10`}
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                </div>

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
                        className={`${baseInputClass} pl-10`}
                        placeholder="Утасны дугаар"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-100">
                <label className={labelClass}>Дэлгэрэнгүй мэдээлэл</label>
                <div className="relative group mt-1.5">
                  <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineDocumentText className="w-4 h-4" />
                  </div>
                  <textarea
                    className={`${baseInputClass} pl-10 resize-none`}
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Нэмэлт тайлбар..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
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
                  onClick={() => navigate("/contacts")}
                  className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Буцах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
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

export default ContactPage;
