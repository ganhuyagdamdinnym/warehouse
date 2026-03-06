const TotalRecords = () => {
  const data = [
    { name: "Бараа материал", count: 150 },
    { name: "Харилцагчид", count: 80 },
    { name: "Ангилал", count: 20 },
    { name: "Агуулахууд", count: 10 },
    { name: "Орлого (Checkins)", count: 200 },
    { name: "Зарлага (Checkouts)", count: 180 },
    { name: "Шилжүүлэг", count: 50 },
    { name: "Залруулга", count: 30 },
    { name: "Хэмжих нэгж", count: 15 },
    { name: "Хэрэглэгчид", count: 25 },
    { name: "Эрхүүд", count: 5 },
  ];

  const reports = [
    { label: "Орлогын тайлан", href: "/reports/checkin" },
    { label: "Зарлагын тайлан", href: "/reports/checkout" },
    { label: "Шилжүүлгийн тайлан", href: "/reports/transfer" },
    { label: "Залруулгын тайлан", href: "/reports/adjustment" },
  ];

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0">
        {/* Total Records */}
        <div className="-mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Нийт бүртгэл</h3>
          <p className="mt-1 text-gray-600">
            Нийт бүртгэлийн мэдээллийг доороос хянана уу
          </p>
        </div>

        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl shadow-sm bg-white border border-gray-100"
              >
                <h2 className="mb-1 text-2xl font-bold leading-none text-gray-900">
                  {item.count}
                </h2>
                <p className="text-sm leading-none text-gray-500">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Report Links */}
        <div className="-mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Тайлангийн холбоосууд
          </h3>
          <p className="mt-1 text-gray-600">Тайланг үзэхийн тулд дарна уу</p>
        </div>

        <section className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {reports.map((report) => (
              <a
                key={report.href}
                href={report.href}
                className="p-4 rounded-xl shadow-sm bg-gray-700 hover:bg-gray-600 transition-colors active:bg-gray-800"
              >
                <p className="text-sm font-medium leading-none text-gray-100">
                  {report.label}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TotalRecords;
