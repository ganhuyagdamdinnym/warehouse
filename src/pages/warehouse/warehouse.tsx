import React, { useState, useRef } from "react";

const Warehouse = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div>
        {/* Breadcrumb Header */}
        <div className="px-4 md:px-0">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                Warehouses
              </span>
              <span className="text-gray-400 font-medium mx-1">/</span>
              <span>Warehouse Name</span>
            </div>
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            Update the record by modifying the details in the form below
          </p>
        </div>

        <div className="mt-6 px-4 md:px-0">
          <form className="bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-5 md:p-6 space-y-6">
              {/* Code & Name */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    defaultValue="WH4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Warehouse 4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    defaultValue="+17695541027"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="robel.maverick@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-1">
                        No Logo
                      </span>
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
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Change
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => setLogoPreview(null)}
                        className="text-xs text-red-600 hover:underline text-left"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  rows={3}
                  defaultValue="931 Wolf Points Apt. 967 Lake Kylieberg, TN 19639-8157"
                />
              </div>

              {/* Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="active"
                  className="ml-2 text-sm text-gray-700 font-medium cursor-pointer"
                >
                  Active
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-3">
              <button
                type="button"
                className="text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-center md:text-left"
              >
                Delete Warehouse
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 shadow-sm transition-colors uppercase tracking-wider"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
