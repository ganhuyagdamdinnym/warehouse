const TotalRecords = () => {
  const data = [
    {
      name: "Items",
      count: 150,
    },
    {
      name: "Contacts",
      count: 80,
    },
    {
      name: "Categories",
      count: 20,
    },
    {
      name: "Warehouses",
      count: 10,
    },
    {
      name: "Checkins",
      count: 200,
    },
    {
      name: "Checkouts",
      count: 180,
    },
    {
      name: "Transfers",
      count: 50,
    },
    {
      name: "Adjustments",
      count: 30,
    },
    {
      name: "Units",
      count: 15,
    },
    {
      name: "Users",
      count: 25,
    },
    {
      name: "Roles",
      count: 5,
    },
  ];
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0">
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Total Records</h3>
          <p className="mt-1 text-gray-600">
            Please review the total records below
          </p>
        </div>
        <section className="mb-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <div key={index} className="p-4 rounded-md shadow-sm bg-white">
                <div className="flex items-start justify-between">
                  <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 truncate">
                    {item.count}
                  </h2>
                </div>
                <p className="leading-none text-gray-600">{item.name}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 pt-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Report Links</h3>
          <p className="mt-1 text-gray-600">Please click to view the report</p>
        </div>
        <section className="mb-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/reports/checkin"
              className="p-4 rounded-md shadow-sm bg-gray-700"
            >
              <p className="leading-none text-gray-100">Checkin Report</p>
            </a>
            <a
              href="/reports/checkout"
              className="p-4 rounded-md shadow-sm bg-gray-700"
            >
              <p className="leading-none text-gray-100">Checkout Report</p>
            </a>
            <a
              href="/reports/transfor"
              className="p-4 rounded-md shadow-sm bg-gray-700"
            >
              <p className="leading-none text-gray-100">Transfor Report</p>
            </a>
            <a
              href="/reports/adjustment"
              className="p-4 rounded-md shadow-sm bg-gray-700"
            >
              <p className="leading-none text-gray-100">Adjustment Report</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TotalRecords;
