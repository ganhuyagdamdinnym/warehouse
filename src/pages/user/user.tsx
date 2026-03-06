const User = () => {
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div>
        {/* Breadcrumb Header */}
        <div className="px-4 md:px-0">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                Хэрэглэгчид
              </span>
              <span className="text-gray-400 font-medium mx-2">/</span>
              Хэрэглэгчийн нэр
            </div>
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            Шинэ бичлэг нэмэхийн тулд доорх маягтыг бөглөнө үү.
          </p>
        </div>

        <div className="mt-6">
          <form className="px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
            <div className="grid gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Зүүн тал: Үндсэн мэдээлэл */}
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Нэр
                      </label>
                      <input
                        type="text"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Нэвтрэх нэр
                      </label>
                      <input
                        type="text"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        И-мэйл хаяг
                      </label>
                      <input
                        type="email"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Утасны дугаар
                      </label>
                      <input
                        type="text"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Баруун тал: Нууц үг болон Агуулах */}
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Нууц үг
                      </label>
                      <input
                        type="password"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Нууц үг баталгаажуулах
                      </label>
                      <input
                        type="password"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="block text-md font-medium text-gray-900 mb-1">
                        Агуулах
                      </label>
                      <input
                        type="text"
                        defaultValue="WH4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <label className="block w-full font-medium text-gray-700">
                  Үүрэг (Roles)
                </label>
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="super_admin"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="super_admin"
                      className="ml-2 text-gray-600 cursor-pointer"
                    >
                      Супер Админ
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div className="font-bold border-b pb-2">
                Зөвшөөрлүүд (Permissions)
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="view_all"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="view_all"
                        className="ml-2 text-gray-600 cursor-pointer"
                      >
                        Бүх бичлэгийг харах боломжтой
                      </label>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="edit_all"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="edit_all"
                        className="ml-2 text-gray-600 cursor-pointer"
                      >
                        Бүх бичлэгийг засах боломжтой
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="px-4 py-4 mt-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                className="text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
              >
                Хэрэглэгчийг устгах
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 shadow-sm transition-colors uppercase tracking-wider"
              >
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
