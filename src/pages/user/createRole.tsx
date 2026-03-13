import {
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineSave,
} from "react-icons/hi";

const CreateRole = () => {
  // Зөвшөөрлийн модулиудын жишээ дата
  const permissionModules = [
    { id: "warehouse", name: "Агуулах" },
    { id: "products", name: "Бараа материал" },
    { id: "users", name: "Хэрэглэгчид" },
    { id: "orders", name: "Захиалга" },
    { id: "reports", name: "Тайлан" },
  ];

  // Consistent Styles
  const baseInputClass =
    "mt-1.5 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none placeholder:text-gray-400";
  const labelClass = "text-sm font-semibold text-gray-700 ml-0.5";

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="px-4 md:px-0 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineShieldCheck className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Шинэ эрх (Role) үүсгэх
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Системийн функцуудад хандах эрхийн түвшинг тодорхойлох.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
              {/* Role Name Section */}
              <div className="max-w-md">
                <label className={labelClass}>Эрхийн нэр</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiOutlineKey className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Жишээ: Оператор, Менежер"
                    className={`${baseInputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
                  Модулийн зөвшөөрлүүд
                </h4>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3">Модуль</th>
                        <th className="px-4 py-3 text-center">Харах</th>
                        <th className="px-4 py-3 text-center">Үүсгэх</th>
                        <th className="px-4 py-3 text-center">Засах</th>
                        <th className="px-4 py-3 text-center">Устгах</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {permissionModules.map((module) => (
                        <tr
                          key={module.id}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {module.name}
                          </td>
                          {["view", "create", "edit", "delete"].map(
                            (action) => (
                              <td
                                key={action}
                                className="px-4 py-4 text-center"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-4">
              <button
                type="button"
                className="px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Цэвэрлэх
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-12 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-bold text-sm shadow-sm transition-all active:scale-95"
              >
                <HiOutlineSave className="w-4 h-4" />
                Хадгалах
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
