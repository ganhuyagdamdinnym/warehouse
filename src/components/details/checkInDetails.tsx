type Item = {
  id: string | number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
};

type Props = {
  onClose: () => void;
  items: Item[];
};

export const CheckInDetails = ({ onClose, items }: Props) => {
  console.log("🚀 ~ file: checkInDetails.tsx:1 ~ Item:", items);
  return (
    <div
      className="fixed z-10 inset-0 bg-gray-500/75 transition-opacity flex justify-center"
      onClick={onClose}
    >
      <div
        className="sm:max-w-4xl bg-white shadow-xl inline-block align-bottom md:rounded-md text-left transform transition-all lg:my-4 md:align-middle w-full relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 print:px-0">
          <div className="flex items-center justify-between print:hidden">
            <div className="text-xl flex gap-1">
              Checkin Details
              <span className="hidden sm:inline">(TCI28)</span>
            </div>
            <div className="-mr-2 flex items-center">
              <button
                onClick={onClose}
                className="flex items-center justify-center h-8 w-8 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-300 focus:outline-hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 print-mt-0">
            <div className="mt-auto bg-gray-100 -m-6 py-6 px-4 md:px-6 rounded-md print:bg-white print:mt-0 print:pt-0 print:h-screen print:overflow-visible">
              <div className="bg-white p-4 rounded-md shadow-sm overflow-x-auto print:shadow-none print:pt-0">
                {/* Header Section */}
                <div className="block sm:flex justify-between print:flex">
                  <div className="flex items-start max-h-8 overflow-hidden mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold">Warehouse</h1>
                    </div>
                  </div>
                  <div className="text-left sm:text-right leading-snug max-w-md print:text-right">
                    <div className="font-bold">Warehouse 1 (WH1)</div>
                    <div>
                      2141 Upton Burgs Apt. 914 Port Makaylafurt, ME 70020-7413
                    </div>
                    <div>+16812757668</div>
                    <div>mmohr@example.com</div>
                  </div>
                </div>

                <div className="border-b my-4 -mx-4 border-gray-300"></div>

                <div className="py-4 w-full text-center">
                  <h1 className="text-xl uppercase font-semibold">Checkin</h1>
                </div>

                {/* Details Section */}
                <div className="block sm:flex justify-between print:flex">
                  <div className="w-full sm:w-1/2 leading-snug mb-6 sm:mb-0">
                    <div className="text-white h-5"></div>
                    <div>Date: Feb 26, 2026</div>
                    <div>Reference: TCI27</div>
                    <div>Created at: Feb 26, 2026 7:20 AM</div>
                  </div>
                  <div className="text-left w-full sm:w-1/2 leading-snug">
                    <div className="text-sm font-bold">For:</div>
                    <div>Braeden Schoen</div>
                    <div>+1 (283) 572-3820</div>
                    <div>bernita.bartell@example.net</div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="-mx-4 overflow-x-auto">
                  <table className="w-full mt-8 mb-4 min-w-125">
                    <thead>
                      <tr>
                        <th className="px-6 py-2 text-left">Item</th>
                        <th className="px-6 py-2 text-right w-32">Weight</th>
                        <th className="px-6 py-2 text-right w-32">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="group avoid">
                          <td className="group-hover:bg-gray-100 border-t px-6 py-2">
                            <div className="flex items-center gap-x-2 gap-y-1">
                              {item.name} ({item.code})
                            </div>
                          </td>
                          <td className="group-hover:bg-gray-100 border-t px-6 py-2 text-right w-32">
                            {item.weight}
                          </td>
                          <td className="group-hover:bg-gray-100 border-t px-6 py-2 text-right w-32">
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="py-4 w-full">
                  Impedit ipsum quibusdam tempora omnis consequatur omnis. Magni
                  odit fugiat aut. Voluptatum accusantium aliquam animi ut
                  asperiores velit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
