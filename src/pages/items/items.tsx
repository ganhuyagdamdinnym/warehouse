import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiChevronDown,
  HiCheck,
  HiX,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { ItemDetails } from "../../components/details/itemDetails";
import { getItems, deleteItem } from "../../api/item/item";
import { useAuth } from "../../hooks/auth";

export interface ItemDetailData {
  id: string;
  name: string;
  code: string;
  internalCode?: string;
  symbology?: string;
  sku?: string;
  rack?: string;
  category: string;
  unit: string;
  stock?: string;
  image?: string;
  description?: string;
  trackStock?: boolean;
  stockAlert?: number;
  trackSerials: boolean;
  trackWeight: boolean;
  trackQuantity: boolean;
  alertOn?: string;
  variants?: { label: string; values: string }[];
  warehouseStocks?: {
    id: string;
    name: string;
    code: string;
    totalQuantity: string;
    variantStocks: { label: string; quantity: string }[];
  }[];
}

const Items: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, warehouse: userWarehouse } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemDetailData | null>(null);
  const [itemsList, setItemsList] = useState<ItemDetailData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getItems({
        search: searchTerm,
        category: categoryFilter,
        page: currentPage,
        limit: itemsPerPage,
      });

      let data = res.data as ItemDetailData[];

      // SuperAdmin биш бол зөвхөн өөрийн агуулахтай холбоотой барааг харуулна
      if (!isSuperAdmin && userWarehouse) {
        data = data.filter((item) =>
          item.warehouseStocks?.some((ws) => ws.name === userWarehouse),
        );
      }

      setItemsList(data);
      setTotalItems(isSuperAdmin ? res.total : data.length);
    } catch (err) {
      console.error("Өгөгдөл татахад алдаа гарлаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [
    searchTerm,
    categoryFilter,
    currentPage,
    itemsPerPage,
    isSuperAdmin,
    userWarehouse,
  ]);

  const handleDelete = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    try {
      await deleteItem(id);
      fetchItems();
    } catch (err) {
      console.error("Устгахад алдаа гарлаа:", err);
    }
  };

  // Details нээхэд энгийн хэрэглэгчид зөвхөн өөрийн агуулахын үлдэгдэл харуулна
  const handleSelectItem = (item: ItemDetailData) => {
    if (!isSuperAdmin && userWarehouse) {
      const filtered = {
        ...item,
        warehouseStocks: item.warehouseStocks?.filter(
          (ws) => ws.name === userWarehouse,
        ),
      };
      setSelectedItem(filtered);
    } else {
      setSelectedItem(item);
    }
    setIsOpenDetails(true);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayFrom =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const displayTo = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto">
      <div className="px-4 md:px-0">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Бараа материал
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isSuperAdmin
              ? "Бүх агуулахын бараа"
              : `${userWarehouse} агуулахын бараа`}
          </p>
        </div>

        {isOpenDetails && selectedItem && (
          <ItemDetails
            onClose={() => setIsOpenDetails(false)}
            item={selectedItem}
          />
        )}

        {/* Toolbar */}
        <div className="mb-5 flex gap-3 justify-between items-center">
          <div className="flex items-center gap-2 w-full max-w-2xl">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Шүүлтүүр
                <HiChevronDown
                  className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white border border-gray-300 rounded-xl z-10 p-1.5">
                  <p className="text-xs font-semibold text-gray-400 px-2 py-1.5 uppercase tracking-wider">
                    Ангилал
                  </p>
                  {[
                    { val: "", lab: "Бүгд" },
                    { val: "parts", lab: "Сэлбэг хэрэгсэл" },
                    { val: "fluids", lab: "Шингэн зүйлс" },
                    { val: "electronics", lab: "Цахим төхөөрөмж" },
                  ].map((f) => (
                    <button
                      key={f.val}
                      onClick={() => {
                        setCategoryFilter(f.val);
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${categoryFilter === f.val ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {f.lab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-3 gap-2 hover:border-gray-300 transition-colors">
              <HiOutlineSearch className="text-gray-400 w-4 h-4 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 text-sm border-0 focus:ring-0 outline-none text-gray-700 placeholder-gray-400"
                placeholder="Хайх..."
              />
              {(searchTerm || categoryFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                    setCurrentPage(1);
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 shrink-0 transition-colors"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/items/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span className="hidden lg:block">Шинэ бараа нэмэх</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left border-b border-gray-200/60">
                <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12"></th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Нэр
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Сонголтууд
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Холбоос
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isSuperAdmin ? "Нийт үлдэгдэл" : "Үлдэгдэл"}
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-6">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Уншиж байна...
                  </td>
                </tr>
              ) : itemsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              ) : (
                itemsList.map((item) => {
                  // Энгийн хэрэглэгчид өөрийн агуулахын үлдэгдэл харуулна
                  const displayStock = isSuperAdmin
                    ? (item.stock ?? "-")
                    : (item.warehouseStocks?.find(
                        (ws) => ws.name === userWarehouse,
                      )?.totalQuantity ?? "0");

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Зураг */}
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-300 text-xs font-bold">
                              {item.name?.[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Код:{" "}
                          <span className="font-medium text-gray-600">
                            {item.internalCode || item.code}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Тэмдэглэгээ: {item.symbology || "CODE128"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-xs text-gray-400 w-20 shrink-0">
                              Тоо хянах
                            </span>
                            {item.trackStock ? (
                              <HiCheck className="text-emerald-500 w-4 h-4" />
                            ) : (
                              <HiX className="text-red-400 w-4 h-4" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-gray-400 w-20 shrink-0">
                              Доод хязгаар
                            </span>
                            <span className="text-gray-700 font-medium">
                              {item.stockAlert ?? "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-gray-400 w-14 shrink-0">
                              Ангилал
                            </span>
                            <span className="text-gray-700 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-gray-400 w-14 shrink-0">
                              Нэгж
                            </span>
                            <span className="text-gray-700">{item.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-lg font-bold ${parseFloat(String(displayStock)) < 0 ? "text-red-500" : "text-gray-900"}`}
                        >
                          {displayStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="inline-flex rounded-lg border border-gray-200/60 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(`/item/${item.id}/edit`)}
                            className="p-2 bg-white text-blue-500 hover:bg-blue-50 border-r border-gray-200/60 transition-colors"
                            title="Засах"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-white text-indigo-500 hover:bg-indigo-50 border-r border-gray-200/60 transition-colors"
                            title="Чат"
                          >
                            <HiOutlineChatAlt2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/item/${item.id}/trail`)}
                            className="p-2 bg-white text-amber-500 hover:bg-amber-50 border-r border-gray-200/60 transition-colors"
                            title="Түүх"
                          >
                            <HiOutlineClipboardList className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-white text-red-500 hover:bg-red-50 transition-colors"
                            title="Устгах"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 md:hidden">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-8">
              Уншиж байна...
            </div>
          ) : (
            itemsList.map((item) => {
              const displayStock = isSuperAdmin
                ? (item.stock ?? "-")
                : (item.warehouseStocks?.find((ws) => ws.name === userWarehouse)
                    ?.totalQuantity ?? "0");
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="bg-white border border-gray-200/60 rounded-xl p-4 cursor-pointer hover:border-gray-300/60 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-300 text-sm font-bold">
                          {item.name?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Код:{" "}
                        <span className="font-medium text-gray-600">
                          {item.internalCode || item.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Үлдэгдэл</span>
                    <span
                      className={`font-bold text-base ${parseFloat(String(displayStock)) < 0 ? "text-red-500" : "text-gray-900"}`}
                    >
                      {displayStock}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Харуулах</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-400">
                {displayFrom}–{displayTo} / {totalItems}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Өмнөх
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${currentPage === i + 1 ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Дараах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
