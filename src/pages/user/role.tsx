const Role = () => {
  const data = [
    {
      item: "Checkins",
      permissions: [
        "View Checkins",
        "Create New Checkins",
        "Update Checkins",
        "Delete Checkins",
      ],
    },
    {
      item: "Checkouts",
      permissions: [
        "View Checkouts",
        "Create New Checkouts",
        "Update Checkouts",
        "Delete Checkouts",
      ],
    },
    {
      item: "Adjustments",
      permissions: [
        "View Adjustments",
        "Create New Adjustments",
        "Update Adjustments",
        "Delete Adjustments",
      ],
    },
    {
      item: "Transfers",
      permissions: [
        "View Transfers",
        "Create New Transfers",
        "Update Transfers",
        "Delete Transfers",
      ],
    },
  ];
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div>
        {/* Breadcrumb Header */}
        <div className="px-4 md:px-0">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                Roles
              </span>
              <span className="text-gray-400 font-medium mx-2">/</span>
              Role Name
            </div>
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            Update the record by modifying the details in the form below
          </p>
        </div>

        <div className="mt-6">
          <form className="px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
            <div className="grid gap-6">
              <div>
                <div className="col-span-6 sm:col-span-4 relative mb-2">
                  <label className="block text-md font-medium text-gray-900 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue="WH4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Form Actions Footer */}
            <div className="px-4 py-4 mt-4 bg-gray-50 flex items-center justify-between">
              <button
                type="button"
                className="text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
              >
                Delete Role
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 shadow-sm transition-colors uppercase tracking-wider"
              >
                Save
              </button>
            </div>
            <div className="mt-8">
              <div>
                <div className="px-4 md:px-0 md:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    Role Permissions
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Update the role permissions in the form below
                  </p>
                </div>
                <div className="mt-6">
                  <form>
                    <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
                      <div className="grid gap-6">
                        <div>
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 w-1/4">
                                  Module
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                                  Permissions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {data.map((row) => (
                                <tr
                                  key={row.item}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="px-4 py-4 text-sm font-bold text-gray-700 align-top">
                                    {row.item}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {row.permissions.map((permission) => (
                                        <label
                                          key={permission}
                                          className="flex items-center space-x-3 cursor-pointer group"
                                        >
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                          />
                                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            {permission}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 mt-4 bg-gray-50 flex items-center justify-between">
                      <div></div>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Role;
