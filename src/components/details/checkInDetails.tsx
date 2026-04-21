import { useEffect, useState } from "react";
import { getCheckin } from "../../api/checkin/checkin_api";

type Props = {
  onClose: () => void;
  id: string | null;
};

export const CheckInDetails = ({ onClose, id }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await getCheckin(id);
          setData(res);
        } catch (error) {
          console.error("Error fetching checkin:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (loading && id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded shadow-md flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-700">
            Ачаалж байна...
          </span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalQty =
    data.items?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0,
    ) ?? 0;
  const totalItems = data.items?.length ?? 0;

  const statusLabel =
    data.status === "Completed"
      ? "Баталгаажсан"
      : data.status === "Draft"
        ? "Ноорог"
        : data.status;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/50 overflow-y-auto py-6 print:bg-white print:py-0 print:block print:overflow-visible"
      onClick={onClose}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 18mm 20mm; }
          body * { visibility: hidden; }
          .doc-root, .doc-root * { visibility: visible; }
          .doc-root { position: fixed; inset: 0; }
          .no-print { display: none !important; }
          .doc-table thead { background-color: #111 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-table thead th { color: #fff !important; }
          .doc-summary { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `,
        }}
      />

      <div
        className="doc-root relative bg-white w-full max-w-3xl shadow-2xl rounded-none sm:rounded-lg overflow-hidden mx-4 print:shadow-none print:mx-0 print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal toolbar (screen only) ─────────────────────────── */}
        <div className="no-print flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Орлогын баримт
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-mono font-semibold text-gray-700">
              #{data.code}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
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

        {/* ── Document body ───────────────────────────────────────── */}
        <div className="px-10 pt-10 pb-8 print:px-0 print:pt-0">
          {/* ── Document header ── */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
            {/* Left: Company / Warehouse */}
            <div className="flex-1">
              {data.warehouse?.logo ? (
                <img
                  src={data.warehouse.logo}
                  alt="Лого"
                  className="h-10 w-auto object-contain mb-3"
                />
              ) : (
                <div className="text-lg font-black tracking-tight text-gray-900 mb-1">
                  {data.warehouse || "АГУУЛАХЫН СИСТЕМ"}
                </div>
              )}
              <div className="text-xs text-gray-500 space-y-0.5 mt-1">
                {data.warehouse?.address && <p>{data.warehouse.address}</p>}
                {data.warehouse?.phone && <p>Утас: {data.warehouse.phone}</p>}
                {data.warehouse?.email && <p>{data.warehouse.email}</p>}
              </div>
            </div>

            {/* Right: Document meta */}
            <div className="sm:text-right shrink-0">
              <div className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-3">
                Орлогын баримт
              </div>
              <table className="text-xs sm:ml-auto">
                <tbody>
                  <tr>
                    <td className="text-gray-400 pr-4 py-0.5">Дугаар</td>
                    <td className="font-mono font-bold text-gray-900">
                      #{data.code}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 pr-4 py-0.5">Огноо</td>
                    <td className="font-semibold text-gray-800">
                      {new Date(data.date).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 pr-4 py-0.5">Бүртгэсэн</td>
                    <td className="text-gray-700">
                      {new Date(
                        data.created_at || data.createdAt,
                      ).toLocaleDateString("mn-MN")}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 pr-4 py-0.5">Төлөв</td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          data.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t-2 border-gray-900 mb-6" />

          {/* ── Parties ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Нийлүүлэгч / Харилцагч
              </p>
              <div className="border border-gray-200 rounded p-3 text-sm space-y-0.5">
                <p className="font-bold text-gray-900">
                  {data.contact?.name || data.contact || "—"}
                </p>
                {data.contact?.email && (
                  <p className="text-gray-500">{data.contact.email}</p>
                )}
                {data.contact?.phone && (
                  <p className="text-gray-500">{data.contact.phone}</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Хүлээн авсан ажилтан
              </p>
              <div className="border border-gray-200 rounded p-3 text-sm space-y-0.5">
                <p className="font-bold text-gray-900">
                  {data.user?.name || data.user || "—"}
                </p>
                {data.user?.email && (
                  <p className="text-gray-500">{data.user.email}</p>
                )}
                <p className="text-gray-400 text-xs pt-1">
                  Бүртгэсэн:{" "}
                  {new Date(data.created_at || data.createdAt).toLocaleString(
                    "mn-MN",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* ── Items table ── */}
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Барааны жагсаалт
            </p>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="doc-table w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider w-10">
                      №
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider">
                      Барааны нэр
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider w-32">
                      Код
                    </th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider w-24">
                      Тоо
                    </th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider w-16">
                      Нэгж
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items?.map((item: any, index: number) => (
                    <tr
                      key={item.id}
                      className={`border-t border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="px-4 py-2.5 text-gray-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.category}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-600">
                        {item.code || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                        {Number(item.quantity).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs text-gray-400">
                        ш
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Totals row */}
                <tfoot>
                  <tr className="doc-summary border-t-2 border-gray-300 bg-gray-50">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Нийт {totalItems} төрлийн бараа
                    </td>
                    <td className="px-4 py-3 text-right text-base font-black text-gray-900">
                      {totalQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500">
                      ш
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Notes ── */}
          {data.details && (
            <div className="mb-8 border border-gray-200 rounded p-4 bg-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Тайлбар
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {data.details}
              </p>
            </div>
          )}

          {/* ── Legal note ── */}
          <div className="mb-10 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
            Дээрх бараа материалыг бүрэн тоолж, агуулахын бүртгэлд хүлээн авлаа.
            Энэхүү баримт нь санхүүгийн анхан шатны баримт болох бөгөөд
            засварлах боломжгүй.
          </div>

          {/* ── Signatures ── */}
          <div className="grid grid-cols-2 gap-16 mt-4">
            {[
              {
                label: "Хүлээлгэн өгсөн",
                sub: "Нийлүүлэгч / Гарын үсэг, тамга",
              },
              {
                label: "Хүлээн авсан",
                sub: "Агуулахын эзэн / Гарын үсэг, тамга",
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="h-12 border-b border-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Page footer ── */}
          <div className="mt-10 pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-[10px] text-gray-300 font-mono">#{data.code}</p>
            <p className="text-[10px] text-gray-300">
              {new Date(data.date).toLocaleDateString("mn-MN")}
            </p>
          </div>
        </div>

        {/* ── Action bar (screen only) ─────────────────────────────── */}
        <div className="no-print flex justify-end items-center gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            Хаах
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-black transition-colors active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Хэвлэх
          </button>
        </div>
      </div>
    </div>
  );
};
