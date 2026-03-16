import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserAdd,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineTrash,
  HiOutlineAnnotation,
} from "react-icons/hi";
import { createContact } from "../../api/contact/contact_api";

const CreateContact = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Нэр заавал бөглөнө.");
      return;
    }
    try {
      setSaving(true);
      await createContact({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        details: details.trim() || undefined,
      });
      navigate("/contacts", { replace: true });
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
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible bg-gray-50/30 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="px-4 md:px-0 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HiOutlineUserAdd className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Шинэ харилцагч үүсгэх
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Шинэ бүртгэл үүсгэхийн тулд доорх формыг бөглөнө үү.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-6 bg-white border border-gray-200 md:p-8 md:rounded-t-xl shadow-sm">
              {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-6">
                  {/* Нэр */}
                  <div className="relative">
                    <label className={labelClass}>Нэр</label>
                    <div className="relative group mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineIdentification className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Бүтэн нэр оруулна уу"
                        className={`${baseInputClass} pl-10`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Имэйл & Утас */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className={labelClass}>Имэйл хаяг</label>
                      <div className="relative group mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                          <HiOutlineMail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          className={`${baseInputClass} pl-10`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className={labelClass}>Утасны дугаар</label>
                      <div className="relative group mt-1">
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
                  </div>

                  {/* Дэлгэрэнгүй */}
                  <div>
                    <label className={labelClass}>Дэлгэрэнгүй мэдээлэл</label>
                    <div className="relative group mt-1">
                      <div className="absolute top-3 left-3 pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <HiOutlineAnnotation className="w-4 h-4" />
                      </div>
                      <textarea
                        className={`${baseInputClass} pl-10 resize-none`}
                        rows={4}
                        placeholder="Нэмэлт тайлбар энд бичнэ үү..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-x border-b border-gray-200 md:px-8 md:rounded-b-xl">
              <button
                type="button"
                onClick={() => navigate("/contacts")}
                className="flex items-center gap-1.5 text-red-500 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-sm"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Цуцлах
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/contacts")}
                  className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4"
                >
                  Буцах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center px-8 py-2.5 bg-blue-600 border border-transparent rounded-md font-bold text-sm text-white uppercase tracking-wider hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition-all shadow-md shadow-blue-200"
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

export default CreateContact;
