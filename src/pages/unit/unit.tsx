import { useState } from "react";
import { Confirmation } from "../../components/confirmation";

const EditUnit = () => {
  const [parentCategory, setParentCategory] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOperationFields, setShowOperationFields] = useState(false);

  const categories = [
    { id: "1", name: "метр" },
    { id: "2", name: "ширхэг" },
    { id: "3", name: "килограмм" },
  ];

  const handleDelete = () => {
    console.log("Устгасан");
    setShowConfirm(false);
  };

  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      {showConfirm && (
        <Confirmation
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Нэгжийг устгах уу?"
          description="Та энэ нэгжийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй."
        />
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-slide-in {
          animation: fadeSlideIn 0.25s ease forwards;
        }
      `}</style>

      <div>
        <div className="px-4 md:px-0 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900">
            <div className="flex items-center">
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Нэгж
              </a>
              <span className="text-blue-600 font-medium mx-2">/</span>
              имбмр
            </div>
          </h3>
          <p className="mt-1 text-gray-600">
            Доорх формын дагуу мэдээллийг өөрчлөн бүртгэлийг шинэчилнэ үү
          </p>
        </div>

        <div className="mt-6">
          <form>
            <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-6">
                  {/* Нэр */}
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className="text-gray-700 font-medium">
                      <span>Нэр</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Нэгжийн нэр оруулна уу"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Код */}
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className="text-gray-700 font-medium">
                      <span>Код</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Жишээ: CAT01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Үндсэн нэгж */}
                  <div className="col-span-6 sm:col-span-4 relative mb-2">
                    <label className="text-gray-700 font-medium">
                      <span>Үндсэн нэгж</span>
                    </label>
                    <div className="relative">
                      <select
                        value={parentCategory}
                        onChange={(e) => {
                          setParentCategory(e.target.value);
                          setShowOperationFields(e.target.value !== "");
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-xs rounded-md focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm bg-white appearance-none"
                      >
                        <option value="">Нэгж сонгоно уу</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
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

                  {/* Operator & Operation Value */}
                  {showOperationFields && (
                    <div className="fade-slide-in flex flex-col gap-y-6">
                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="text-gray-700 font-medium">
                          <span>Оператор</span>
                        </label>
                        <div className="relative">
                          <select className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-xs rounded-md focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm bg-white appearance-none">
                            <option value="">Оператор сонгоно уу</option>
                            <option value="multiply">× Үржих</option>
                            <option value="divide">÷ Хуваах</option>
                            <option value="add">+ Нэмэх</option>
                            <option value="subtract">− Хасах</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
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

                      <div className="col-span-6 sm:col-span-4 relative mb-2">
                        <label className="text-gray-700 font-medium">
                          <span>Үйлдлийн утга</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Утга оруулна уу"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Үйлдэл хийх хэсэг */}
              <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md mt-6">
                <div className="w-full flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="text-red-600 px-4 py-2 rounded-sm border-2 border-transparent hover:border-gray-300 focus:outline-hidden focus:border-gray-300 transition-colors"
                  >
                    Бүртгэлийг устгах
                  </button>
                  <button
                    type="submit"
                    className="relative flex items-center justify-center px-6 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:shadow-outline-gray transition-all ease-in-out duration-150"
                  >
                    Хадгалах
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

export default EditUnit;
