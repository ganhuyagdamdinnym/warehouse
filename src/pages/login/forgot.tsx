import { useState, useRef, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuWarehouse } from "react-icons/lu";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
} from "react-icons/hi";

type Step = "email" | "otp" | "reset" | "done";

const Forgot = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────
  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Алдаа гарлаа");
      setStep("otp");
      setResendTimer(60);
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) return setError("6 оронтой кодоо оруулна уу");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Алдаа гарлаа");
      setResetToken(data.resetToken);
      setStep("reset");
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────
  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword)
      return setError("Нууц үг таарахгүй байна");
    if (password.length < 6)
      return setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Алдаа гарлаа");
      setStep("done");
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const stepIndex = { email: 0, otp: 1, reset: 2, done: 3 }[step];

  const steps = [
    { label: "И-мэйл" },
    { label: "OTP код" },
    { label: "Нууц үг" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      {/* Logo */}
      <div className="flex items-center mb-8 gap-2.5">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <LuWarehouse className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          Агуулах
        </span>
      </div>

      <div className="w-full max-w-md">
        {/* Step indicator */}
        {step !== "done" && (
          <div className="flex items-center justify-center mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      i < stepIndex
                        ? "bg-indigo-600 text-white"
                        : i === stepIndex
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium ${
                      i <= stepIndex ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mb-5 mx-1 transition-all duration-500 ${
                      i < stepIndex ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Нууц үг сэргээх
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Бүртгэлтэй и-мэйл хаягаа оруулна уу. OTP код илгээгдэх болно.
                </p>
              </div>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    И-мэйл хаяг
                  </label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Илгээж байна...
                    </span>
                  ) : (
                    "OTP код илгээх"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  OTP код оруулах
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{email}</span>{" "}
                  хаяг руу илгээсэн 6 оронтой кодоо оруулна уу.
                </p>
              </div>
              <form onSubmit={handleVerifyOtp}>
                <div
                  className="flex justify-center gap-2 mb-6"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 text-center text-xl font-bold border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-500 ${
                        digit
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-800"
                      }`}
                      style={{ height: "3.25rem" }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Шалгаж байна...
                    </span>
                  ) : (
                    "Баталгаажуулах"
                  )}
                </button>

                <div className="mt-4 text-center">
                  {resendTimer > 0 ? (
                    <span className="text-sm text-gray-400">
                      Дахин илгээх боломжтой болоход:{" "}
                      <span className="font-semibold text-indigo-600">
                        {resendTimer}с
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(["", "", "", "", "", ""]);
                        setError("");
                        handleForgot({ preventDefault: () => {} } as FormEvent);
                        setResendTimer(60);
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Код дахин илгээх
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Reset Password ── */}
          {step === "reset" && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Шинэ нууц үг тохируулах
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Хамгийн багадаа 6 тэмдэгт бүхий шинэ нууц үгээ оруулна уу.
                </p>
              </div>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Шинэ нууц үг
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="w-4 h-4" />
                      ) : (
                        <HiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            password.length >= level * 2
                              ? password.length >= 10
                                ? "bg-green-400"
                                : password.length >= 6
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Нууц үг давтах
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword && confirmPassword !== password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                          : confirmPassword && confirmPassword === password
                            ? "border-green-300 focus:border-green-400 focus:ring-green-50"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <HiOutlineEyeOff className="w-4 h-4" />
                      ) : (
                        <HiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Шинэчилж байна...
                    </span>
                  ) : (
                    "Нууц үг шинэчлэх"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── STEP DONE ── */}
          {step === "done" && (
            <div className="py-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-9 h-9 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Амжилттай!
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Таны нууц үг амжилттай шинэчлэгдлээ.
              </p>
              <p className="text-sm text-gray-400">
                Нэвтрэх хуудас руу шилжиж байна...
              </p>
              <div className="mt-5 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1 rounded-full animate-[width_3s_linear]"
                  style={{ animation: "progress 3s linear forwards" }}
                />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          )}

          {/* Back to login */}
          {step !== "done" && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                ← Нэвтрэх хуудас руу буцах
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Агуулахын удирдлагын систем
        </p>
      </div>
    </div>
  );
};

export default Forgot;
