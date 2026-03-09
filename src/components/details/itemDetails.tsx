import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

type Variant = {
  label: string;
  values: string;
};

type WarehouseVariantStock = {
  label: string; // e.g. "Size: S, Color: Red"
  quantity: string; // e.g. "0.00 pc (0.00 kg)"
};

type WarehouseStock = {
  id: string;
  name: string; // e.g. "Warehouse 1"
  code: string; // e.g. "WH1"
  totalQuantity: string;
  variantStocks: WarehouseVariantStock[];
};

type ItemDetailData = {
  id: string;
  name: string;
  code: string;
  sku?: string;
  rack?: string;
  category: string;
  unit: string;
  trackSerials: boolean;
  trackWeight: boolean;
  trackQuantity: boolean;
  variants?: Variant[];
  details?: string;
  warehouseStocks?: WarehouseStock[];
};

type Props = {
  onClose: () => void;
  item: ItemDetailData;
};

const BarcodeDisplay = ({ code }: { code: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, code, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      });
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          {/* Section 1: Barcode + Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm mb-4">
            {/* Barcode */}
            <div className="flex justify-center mb-6">
              <BarcodeDisplay code={item.code} />
            </div>

            {/* Info Rows */}
            <div>
              <DetailRow label="Нэр">
                <span className="font-semibold">{item.name}</span>
              </DetailRow>
              <DetailRow label="SKU">
                {item.sku || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Ангилал">
                {item.category || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Rack">
                {item.rack || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Нэгж">
                {item.unit || <span className="text-gray-300">—</span>}
              </DetailRow>
              <DetailRow label="Серийн дугаар хянах">
                {item.trackSerials ? <CheckIcon /> : <CrossIcon />}
              </DetailRow>
              <DetailRow label="Жин хянах">
                {item.trackWeight ? <CheckIcon /> : <CrossIcon />}
              </DetailRow>
              <DetailRow label="Тоо хянах">
                {item.trackQuantity ? <CheckIcon /> : <CrossIcon />}
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
              {item.details && (
                <DetailRow label="Дэлгэрэнгүй">
                  <span className="text-gray-600 leading-relaxed">
                    {item.details}
                  </span>
                </DetailRow>
              )}
            </div>
          </div>

          {/* Section 2: Warehouse Stocks Grid */}
          {item.warehouseStocks && item.warehouseStocks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.warehouseStocks.map((wh) => (
                <div key={wh.id} className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="font-bold text-gray-900 mb-3">
                    {wh.name} ({wh.code})
                  </div>
                  {/* Total row */}
                  {/* <div className="flex justify-between py-2 border-b border-gray-200 mb-1">
                    <span className="font-semibold text-sm text-gray-700">
                      Тоо хэмжээ
                    </span>
                    <span
                      className={`font-semibold text-sm ${wh.totalQuantity.startsWith("-") ? "text-red-500" : "text-gray-900"}`}
                    >
                      {wh.totalQuantity}
                    </span>
                  </div> */}
                  {/* Variant rows */}
                  {wh.variantStocks.map((vs, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"
                    >
                      {/* <span className="text-sm text-gray-600">{vs.label}</span> */}
                      <span
                        className={`text-sm ${vs.quantity.startsWith("-") ? "text-red-500" : "text-gray-700"}`}
                      >
                        {vs.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
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
