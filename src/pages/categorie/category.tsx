import React, { useState } from "react";

const Category = () => {
  // Added state to manage the selected parent category
  const [parentCategory, setParentCategory] = useState("");

  const categories = [
    { id: "1", name: "Main Inventory" },
    { id: "2", name: "Sub Store" },
    { id: "3", name: "Electronics" },
    { id: "4", name: "General" },
  ];

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div>
        <div className="px-4 md:px-0 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <a className="text-blue-600 hover:text-blue-700">Categories</a>
              <span className="text-blue-600 font-medium mx-2">/</span>
              Category Name
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
                      <span>Code</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* --- Parent Category Dropdown --- */}
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className=" text-gray-700">
                      <span>Parent Category</span>
                    </label>
                    <select
                      value={parentCategory}
                      onChange={(e) => setParentCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-xs rounded-md focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm bg-white appearance-none"
                    >
                      <option value="">Select a parent category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {/* Optional: Custom Chevron for the dropdown */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-6 text-gray-500">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end px-4 py-3 text-right md:px-6  md:rounded-bl-md md:rounded-br-md">
                <div className="w-full flex items-center justify-between">
                  <div></div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative flex items-center justify-center px-4 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:shadow-outline-gray transition-all ease-in-out duration-150"
                    >
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

export default Category;
