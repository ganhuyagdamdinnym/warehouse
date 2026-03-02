import { useState, type FormEvent, type ChangeEvent } from "react";
import { LuWarehouse } from "react-icons/lu";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login Attempt:", formData);
    // Add your auth logic here (e.g., navigate to dashboard)
  };

  return (
    <div className="min-h-screen flex flex-col justify-center text-gray-800 items-center py-8 bg-gray-100 px-4">
      {/* Logo Section */}
      <div className="flex items-center mb-6">
        <LuWarehouse className="h-10 w-10 mr-3 text-indigo-600" />
        <h2 className="text-3xl font-bold tracking-tight">Warehouse</h2>
      </div>

      {/* Card Section */}
      <div className="w-full sm:max-w-md px-6 py-8 bg-white shadow-md border border-gray-200 rounded-xl">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Password
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
          </div>

          <div className="flex items-center justify-between mt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors uppercase tracking-widest"
            >
              Log in
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Warehouse Management System
      </p>
    </div>
  );
};

export default Login;
