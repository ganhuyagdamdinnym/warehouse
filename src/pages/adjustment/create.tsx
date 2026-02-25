import { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";

const CreateAdjustment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  // Dummy data for select options
  const contacts = ["Marianna Upton", "John Doe", "Alice Smith", "Bob Brown"];
  const warehouses = [
    "Warehouse 1",
    "Warehouse 2",
    "Warehouse 3",
    "Main Storage",
  ];
  const items = [
    "Product 1 - Warehouse A",
    "Product 2 - Warehouse B",
    "Item 3 - Storage C",
    "Spare Part 4",
    "Electronic Device 5",
  ];
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Гадна дарахад хаах
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div>
        <div className="px-4 md:px-0 md:col-span-1">
          <h3 className="text-lg font-bold text-gray-900">
            Create New Adjustment
          </h3>
          <p className="mt-1 text-gray-600">
            Please fill the form below to add new record.
          </p>
        </div>
        <div className="mt-6">
          <form>
            <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
              <div className="grid gap-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Date</span>
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 text-xl"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Reference</span>
                        </label>
                        <input
                          placeholder="Reference"
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 text-xl"
                        />
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/2">
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Contact</span>
                        </label>
                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 text-xl">
                          <option value="">Select Contact</option>
                          {contacts.map((contact) => (
                            <option key={contact} value={contact}>
                              {contact}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="font-medium text-gray-700">
                          <span>Warehouse</span>
                        </label>
                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 text-xl">
                          <option value="">Select Warehouse</option>
                          {warehouses.map((wh) => (
                            <option key={wh} value={wh}>
                              {wh}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:px-6 bg-gray-50 -mx-4 md:-mx-6">
                    <div
                      className="col-span-6 sm:col-span-4 relative mb-2"
                      ref={containerRef}
                    >
                      <div className="relative flex items-center">
                        {/* Баруун талын Icon */}
                        <label className="inline-block cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 border border-transparent p-1 text-gray-400">
                          <div className="h-4 w-4">
                            <HiChevronDown
                              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </label>

                        <input
                          type="text"
                          value={
                            isOpen ? searchTerm : selectedValue || searchTerm
                          }
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                          }}
                          onFocus={() => setIsOpen(true)}
                          placeholder="Search and select..."
                          className="pr-8 mt-1 border rounded-md shadow-xs py-2 pl-4 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none block w-full transition-all"
                        />
                      </div>

                      {/* Dropdown жагсаалт */}
                      {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-50 last:border-none"
                                onClick={() => {
                                  setSelectedValue(item);
                                  setSearchTerm(item);
                                  setIsOpen(false);
                                }}
                              >
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-400 text-sm">
                              No results found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bg-white mt-4 rounded-md shadow-sm overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left font-bold">
                            <th className="px-2 lg:pl-6 py-4 w-4"></th>
                            <th className="px-2 lg:px-6 py-4">Item</th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56">
                              <span>Weight</span>
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56">
                              <span>Quantity</span>
                            </th>
                            <th className="px-2 lg:px-6 py-4 text-center w-32 xl:w-56">
                              <span>Unit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              colSpan={5}
                              className="border-t px-2 lg:px-6 py-4"
                            >
                              Add item to the list by search or scan barcode
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="pt-4">
                      <div>Add item to the list by search or scan barcode </div>
                    </div> */}
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">
                      Attachments
                    </label>
                    <div className="border-gray-300 mt-1 flex justify-center px-6 py-3 border-2 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex items-center justify-center text-gray-600">
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>
                            You can select .png, .jpg, .pdf, .docx, .xlsx & .zip
                            files.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label className="font-medium text-gray-700">
                      <span>Details</span>
                    </label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      rows={3}
                      placeholder="Enter details here..."
                    ></textarea>
                  </div>
                  <div className="flex mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="draft"
                        className="rounded-sm border-gray-300 text-indigo-600 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200/50"
                      />
                      <span className="ml-2 text-gray-600">
                        This record is draft
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
              <div className="w-full flex items-center justify-between">
                <div></div>
                <div className="flex items-center">
                  <button className="relative flex items-center justify-center px-4 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:shadow-outline-gray transition-all ease-in-out duration-150">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdjustment;
