const Checkins = () => {
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="relative z-30 print:hidden"></div>
      <div className="px-4 md:px-0">
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Checkins</h3>
          <p className="mt-1 text-gray-600">
            Please review the data in the table below
          </p>
        </div>
        <div className="mb-6 flex justify-between items-center print:hidden">
          <div className="flex items-center w-full max-w-md mr-4">
            <div className="flex items-stretch w-full bg-white shadow-sm rounded-md">
              <div className="relative">Filter</div>
              <input
                type="text"
                name="search"
                id="search"
                className="relative z-0 w-full px-6 py-2 border-0 border-l border-gray-300 focus:border-transparent rounded-r-md focus:ring-3 focus:ring-gray-300"
                placeholder="Search..."
              />
            </div>
            <button className="ml-2 p-2 text-sm text-gray-500 hover:text-gray-700 focus:text-indigo-500 rounded-md border-2 border-transparent focus:outline-hidden focus:ring-3 focus:ring-gray-300">
              Reset
            </button>
          </div>
          <a
            href="/checkins/create"
            className="inline-flex items-center px-4 py-3 bg-gray-800 shadow-sm border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150"
          >
            <span>+</span>
            <span className="hidden lg:inline">CREATE NEW CHECKIN</span>
          </a>
        </div>
        <div className="bg-white -mx-4 md:mx-0 md:rounded-md shadow-sm overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4">Checkin</th>
                <th className="px-6 pt-6 pb-4">Relations</th>
                <th className="px-6 pt-6 pb-4">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                <td className="border-t cursor-pointer">
                  <div className="px-6 py-4 flex items-center focus:text-indigo-500">
                    <div>
                      <div>TCI28</div>
                      <div>Feb 23, 2026</div>
                      <div className="inline-flex gap-x-2 items-center justify-start">
                        Draft
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-t cursor-pointer">
                  <div className="px-6 py-4">
                    <div className="flex items-center">
                      <h1 className="text-gray-500 mr-1">Contact:</h1>
                      Marianna Upton
                    </div>
                    <div className="flex items-center">
                      <h1 className="text-gray-500 mr-1">WareHouse:</h1>
                      Warehouse 3
                    </div>
                    <div className="flex items-center">
                      <h1 className="text-gray-500 mr-1">User:</h1>
                      Damdinnyam
                    </div>
                  </div>
                </td>
                <td className="border-t max-w-lg min-w-56 cursor-pointer">
                  <div className="px-6 py-4 flex items-center">
                    <div className="w-full whitespace-normal line-clamp-3">
                      Rerum mollitia doloribus necessitatibus rerum cumque
                      blanditiis aut est. Labore totam et aut et. Eos molestias
                      qui cumque rerum veniam. Repellendus cumque repellat fuga
                      minima odio voluptatem.
                    </div>
                  </div>
                </td>
                <td className="border-t w-16">
                  <div className="px-4 flex items-center print:hidden">
                    <div className="flex items-center">
                      <button className="flex items-center p-3 md:p-2 bg-blue-600 rounded-l-md text-white hover:bg-blue-700 focus:bg-blue-700 z-0 focus:z-10 focus:outline-hidden focus:ring-3 focus:ring-gray-300 transition ease-in-out duration-150">
                        edit
                      </button>
                      <button className="flex items-center p-3 md:p-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:bg-indigo-700 z-0 focus:z-10 focus:outline-hidden focus:ring-3 focus:ring-gray-300 transition ease-in-out duration-150">
                        message
                      </button>
                      <button className="flex items-center p-3 md:p-2 bg-yellow-600 text-white hover:bg-yellow-700 focus:bg-yellow-700 z-0 focus:z-10 focus:outline-hidden focus:ring-3 focus:ring-gray-300 transition ease-in-out duration-150">
                        edit
                      </button>
                      <button className="flex items-center p-3 md:p-2 bg-red-600 rounded-r-md text-white hover:bg-red-700 focus:bg-red-700 z-0 focus:z-10 focus:outline-hidden focus:ring-3 focus:ring-gray-300 transition ease-in-out duration-150">
                        delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Checkins;
