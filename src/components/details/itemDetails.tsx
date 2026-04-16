import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

type WarehouseVariantStock = { label: string; quantity: string };
type WarehouseStock = {
  id: string;
  name: string;
  code: string;
  totalQuantity: string;
  variantStocks: WarehouseVariantStock[];
};

type ItemDetailData = {
  id: string;
  name: string;
  code: string;
  internalCode?: string;
  sku?: string;
  rack?: string;
  category: string;
  unit: string;
  stock?: number | string;
  image?: string;
  trackSerials: boolean;
  trackWeight: boolean;
  trackQuantity: boolean;
  trackStock?: boolean;
  stockAlert?: number;
  variants?: { label: string; values: string }[];
  details?: string;
  description?: string;
  warehouseStocks?: WarehouseStock[];
};

type Props = { onClose: () => void; item: ItemDetailData };

const BarcodeDisplay = ({ code }: { code: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current && code) {
      try {
        JsBarcode(svgRef.current, code, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch {
        /* invalid barcode */
      }
    }
  }, [code]);
  return <svg ref={svgRef} />;
};

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CrossIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
    <div className="w-36 shrink-0 text-gray-500 text-sm">{label}</div>
    <div className="text-sm text-gray-900">{children}</div>
  </div>
);

export const ItemDetails = ({ onClose, item }: Props) => {
  const barcodeValue = item.internalCode || item.code || "";
  const totalStock = Number(item.stock ?? 0);
  const hasWarehouseStocks =
    item.warehouseStocks && item.warehouseStocks.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 p-4"
      onClick={onClose}
    >
      <div
        className="relative z-50 flex max-h-[95vh] w-full flex-col overflow-hidden bg-white shadow-xl md:rounded-md sm:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-lg font-semibold text-gray-900">
            Барааны дэлгэрэнгүй ({item.name})
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 space-y-4">
          {/* Section 1: Зураг + Barcode + Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            {/* Барааны зураг */}
            {item.image && (
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            )}

            {/* Barcode */}
            {barcodeValue && (
              <div className="flex justify-center mb-6">
                <BarcodeDisplay code={barcodeValue} />
              </div>
            )}

            <div>
              <DetailRow label="Нэр">
                <span className="font-semibold">{item.name}</span>
              </DetailRow>
              <DetailRow label="Дотоод код">
                {item.internalCode || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="SKU">
                {item.sku || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Ангилал">
                {item.category || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Нэгж">
                {item.unit || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Нийт үлдэгдэл">
                <span
                  className={`font-bold text-base ${totalStock < 0 ? "text-red-500" : "text-gray-900"}`}
                >
                  {totalStock} ш
                </span>
              </DetailRow>
              {item.stockAlert != null && (
                <DetailRow label="Доод хязгаар">
                  <span
                    className={`font-medium ${totalStock <= item.stockAlert ? "text-red-500" : "text-gray-700"}`}
                  >
                    {item.stockAlert} ш
                    {totalStock <= item.stockAlert && (
                      <span className="ml-2 text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md ring-1 ring-red-200">
                        Дутагдалтай
                      </span>
                    )}
                  </span>
                </DetailRow>
              )}
              <DetailRow label="Тоо хянах">
                {item.trackStock ? <CheckIcon /> : <CrossIcon />}
              </DetailRow>
              {item.variants && item.variants.length > 0 && (
                <DetailRow label="Хувилбарууд">
                  <div className="space-y-1">
                    {item.variants.map((v, i) => (
                      <div key={i}>
                        <span className="font-semibold">{v.label}:</span>{" "}
                        {v.values}
                      </div>
                    ))}
                  </div>
                </DetailRow>
              )}
              {(item.details || item.description) && (
                <DetailRow label="Дэлгэрэнгүй">
                  <span className="text-gray-600 leading-relaxed">
                    {item.details || item.description}
                  </span>
                </DetailRow>
              )}
            </div>
          </div>

          {/* Section 2: Агуулахын үлдэгдэл */}
          {hasWarehouseStocks ? (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
                Агуулах тус бүрийн үлдэгдэл
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.warehouseStocks!.map((wh) => {
                  const qty = Number(wh.totalQuantity);
                  const isLow =
                    item.stockAlert != null && qty <= item.stockAlert;
                  return (
                    <div
                      key={wh.id}
                      className="rounded-lg bg-white p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {wh.name}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {wh.code}
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold ${qty < 0 ? "text-red-500" : isLow ? "text-amber-500" : "text-gray-900"}`}
                        >
                          {qty}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div
                          className={`h-1.5 rounded-full transition-all ${qty <= 0 ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, (qty / Math.max(totalStock, 1)) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Нийт {totalStock}-аас {qty} ш
                        </span>
                        {qty <= 0 ? (
                          <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded ring-1 ring-red-200 font-medium">
                            Дуссан
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded ring-1 ring-amber-200 font-medium">
                            Цөөн
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded ring-1 ring-emerald-200 font-medium">
                            Хангалттай
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-sm text-center text-sm text-gray-400 italic">
              Агуулахын үлдэгдэл бүртгэгдээгүй байна
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded hover:bg-black transition-all"
          >
            ХЭВЛЭХ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-all"
          >
            ХААХ
          </button>
        </div>
      </div>
    </div>
  );
};
