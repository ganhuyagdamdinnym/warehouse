import { useState, type FormEvent, type ChangeEvent } from "react";
import { LuWarehouse, LuEye, LuEyeOff } from "react-icons/lu";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Нэвтрэх үед алдаа гарлаа");
        return;
      }

      if (formData.remember) {
        console.log("data", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      window.location.href = "/";
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center text-gray-800 items-center py-8 bg-gray-100 px-4">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <LuWarehouse className="h-10 w-10 mr-3 text-indigo-600" />
        <h2 className="text-3xl font-bold tracking-tight">Агуулах</h2>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md px-6 py-8 bg-white shadow-md border border-gray-200 rounded-xl"
      >
        {/* Алдаа */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            И-мэйл
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Нууц үг */}
        {/* <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Нууц үг
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div> */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Нууц үг
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"} // Dynamic type
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all pr-10"
            />
            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? (
                <LuEyeOff className="h-5 w-5" />
              ) : (
                <LuEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600">Намайг сана</span>
          </label>

          <a
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Нууц үг мартсан уу?
          </a>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest"
          >
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Агуулахын удирдлагын систем
      </p>
    </div>
  );
};

export default Login;
