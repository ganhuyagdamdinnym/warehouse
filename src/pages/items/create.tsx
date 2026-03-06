import React from "react";

const CreateItem = () => {
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div className="px-4 md:px-0 md:col-span-1">
        <div className="px-4 md:px-0 md:col-span-1 -mx-4 md:mx-0 mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Шинэ бараа бүртгэх
          </h3>
          <p className="mt-1 text-gray-600">
            Шинэ бүртгэл үүсгэхийн тулд доорх формыг бөглөнө үү.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <form>
          <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
            <div className="grid gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Зүүн тал */}
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Нэр</span>
                      </label>
                      <input
                        placeholder="Барааны нэр"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Код</span>
                      </label>
                      <input
                        placeholder="Барааны код"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Баркодны тэмдэглэгээ (Symbology)</span>
                      </label>
                      <input
                        placeholder="Жишээ: CODE128, EAN13"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>SKU</span>
                      </label>
                      <input
                        placeholder="Сонголттой код (SKU)"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Баруун тал */}
                  <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Ангилал</span>
                      </label>
                      <input
                        placeholder="Барааны ангилал сонгох"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Хэмжих нэгж</span>
                      </label>
                      <input
                        placeholder="Ширхэг, кг, литр г.м"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Тавиурын байршил</span>
                      </label>
                      <input
                        placeholder="Агуулах дахь байршил"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative mb-2">
                      <label className="font-medium text-gray-700">
                        <span>Зураг</span>
                      </label>
                      <input
                        type="file"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="font-medium text-gray-700">
                    <span>Дэлгэрэнгүй мэдээлэл</span>
                  </label>
                  <textarea
                    placeholder="Тайлбар..."
                    className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <div className="flex">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">Жингээр хянах</span>
                    </label>
                  </div>
                  <div className="flex">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-700">
                        Тоо ширхэгээр хянах
                      </span>
                    </label>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-4 relative">
                  <label className="font-medium text-gray-700">
                    <span>Үлдэгдэл багасах үед мэдэгдэх</span>
                  </label>
                  <input
                    placeholder="Доод хязгаарыг оруулна уу"
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mt-4">
                  <div className="flex">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-600 font-medium">
                        Хувилбаруудыг хянах (Жишээ нь: Хэмжээ эсвэл Өнгө)
                      </span>
                    </label>
                  </div>
                  <p className="ml-6 mt-1 text-sm text-yellow-600">
                    Анхаар: Үлдэгдэл бүртгэгдсэний дараа хувилбарыг өөрчлөх нь
                    үлдэгдлийн тооцоолол зөрөхөд хүргэж болзошгүй.
                  </p>
                  <div className="mt-6 border-t pt-4">
                    <div className="font-bold text-gray-800">
                      Агуулах дахь байршил (Warehouse Racks)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
            <button
              type="button"
              className="relative flex items-center justify-center px-8 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 transition-all duration-150"
            >
              Хадгалах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
