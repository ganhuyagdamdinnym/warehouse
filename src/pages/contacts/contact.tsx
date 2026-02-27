const ContactPage = () => {
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div>
        <div className="px-4 md:px-0 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <a className="text-blue-600 hover:text-blue-700">Contacts</a>
              <span className="text-blue-600 font-medium mx-2">/</span>
              Euna Wyman I
            </div>
          </h3>
          <p className="mt-1 text-gray-600">
            Update the record by modifying the details in the form below
          </p>
        </div>
        <div className="mt-6">
          <form>
            <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-6">
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className=" text-gray-700">
                      <span>Name</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className=" text-gray-700">
                      <span>Email</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className=" text-gray-700">
                      <span>Phone</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-xs rounded-md focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label className=" text-gray-700">
                      <span>Details</span>
                    </label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      rows={3}
                      placeholder="Enter details here..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
                <div className="w-full flex items-center justify-between">
                  <button className="text-red-600 px-4 py-2 rounded-sm border-2 border-transparent hover:border-gray-300 focus:outline-hidden focus:border-gray-300">
                    Delete Contact
                  </button>
                  <div className="flex items-center">
                    <button className="relative flex items-center justify-center px-4 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:shadow-outline-gray transition-all ease-in-out duration-150">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
