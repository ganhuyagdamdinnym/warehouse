const CreateItem = () => {
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0 md:col-span-1">
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Create New Item</h3>
          <p className="mt-1 text-gray-600">
            Please fill the form below to add new record.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <form>
          <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
            <div className="grid gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Name</span>
                      </label>
                      <input
                        placeholder="Name"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Code</span>
                      </label>
                      <input
                        placeholder="Code"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Barcode Symbology</span>
                      </label>
                      <input
                        placeholder="Barcode Symbology"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>SKU</span>
                      </label>
                      <input
                        placeholder="SKU"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Category</span>
                      </label>
                      <input
                        placeholder="Category"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Unit</span>
                      </label>
                      <input
                        placeholder="Unit"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Rack Location</span>
                      </label>
                      <input
                        placeholder="Rack Location"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Photo</span>
                      </label>
                      <input
                        placeholder="Select File"
                        type="file"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="font-medium text-gray-700">
                    <span>Details</span>
                  </label>
                  <textarea className="w-full mt-1 px-2 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
                <div>
                  <div className="flex mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">Track Weight</span>
                    </label>
                  </div>
                  <div className="flex">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">Track Quantity</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4 relative mb-6">
                  <label className="font-medium text-gray-700">
                    <span>Alert on low stock of</span>
                  </label>
                  <input
                    placeholder="Alert on low stock of"
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mt-4">
                  <div className="flex">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-600">
                        Track Variants e.g. Size and/or Color
                      </span>
                    </label>
                  </div>
                  <p className="ml-6 text-sm text-yellow-600">
                    Modifying variants after you have stock could result in
                    wrong stock.
                  </p>
                  <div className="mt-6">
                    <div className="font-bold">Warehouse Rack Locations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
            <div className="w-full flex items-center justify-end">
              <div className="flex justify-center">
                <button
                  type="button"
                  className="relative flex items-center justify-center px-6 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 transition-all duration-150"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
