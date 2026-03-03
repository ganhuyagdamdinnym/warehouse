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

export const AdjutmentDetails = ({ onClose, items }: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative z-50 flex max-h-[95vh] w-full flex-col overflow-hidden bg-white shadow-xl md:rounded-md lg:my-4 sm:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed at top */}
        <div className="flex items-center justify-between border-b px-6 py-4 print:hidden">
          <div className="flex gap-1 text-xl font-semibold">
            Checkin Details
            <span className="hidden text-gray-500 sm:inline">(TCI28)</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800 focus:outline-none"
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

        {/* Modal Body - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 print:bg-white print:overflow-visible">
          <div className="rounded-md bg-white p-4 shadow-sm print:shadow-none print:p-0">
            {/* Warehouse Info Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row print:flex-row">
              <div className="flex items-start">
                <h1 className="text-2xl font-bold">Warehouse</h1>
              </div>
              <div className="max-w-md leading-snug text-left sm:text-right print:text-right">
                <div className="font-bold">Warehouse 1 (WH1)</div>
                <div className="text-sm text-gray-600">
                  2141 Upton Burgs Apt. 914 Port Makaylafurt, ME 70020-7413
                </div>
                <div className="text-sm">+16812757668</div>
                <div className="text-sm text-blue-600">mmohr@example.com</div>
              </div>
            </div>

            <div className="my-4 border-b border-gray-200"></div>

            <div className="py-2 text-center">
              <h1 className="text-lg font-bold uppercase tracking-wide">
                Checkin
              </h1>
            </div>

            {/* Checkin Details Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row print:flex-row">
              <div className="w-full space-y-1 text-sm leading-snug sm:w-1/2">
                <div>
                  <span className="text-gray-500">Date:</span> Feb 26, 2026
                </div>
                <div>
                  <span className="text-gray-500">Reference:</span> TCI27
                </div>
                <div>
                  <span className="text-gray-500">Created at:</span> Feb 26,
                  2026 7:20 AM
                </div>
              </div>
              <div className="w-full text-sm leading-snug sm:w-1/2">
                <div className="font-bold uppercase text-gray-500 text-xs mb-1">
                  For:
                </div>
                <div className="font-semibold text-base">Braeden Schoen</div>
                <div>+1 (283) 572-3820</div>
                <div className="text-blue-600 font-medium">
                  bernita.bartell@example.net
                </div>
              </div>
            </div>

            {/* Items Table - Horizontal scroll for small screens */}
            <div className="mt-8 overflow-x-auto rounded-lg">
              <table className="w-full min-w-[500px] ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">
                      Item
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500 w-32">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500 w-32">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm">
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="ml-2 text-gray-400">
                          ({item.code})
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-600">
                        {item.weight}
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-sm text-gray-500 italic leading-relaxed">
              Impedit ipsum quibusdam tempora omnis consequatur omnis. Magni
              odit fugiat aut. Voluptatum accusantium aliquam animi ut
              asperiores velit.
            </div>
          </div>
        </div>

        {/* Footer Actions - Optional but good for UX */}
        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded hover:bg-black transition-all"
          >
            PRINT
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
