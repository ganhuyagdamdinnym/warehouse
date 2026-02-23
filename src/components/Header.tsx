import { HiMenuAlt3, HiOutlineBell, HiOutlineCog } from "react-icons/hi";

export const Header = () => {
  return (
    <div className="md:flex md:shrink-0 print:hidden">
      <div className="bg-gray-900 md:shrink-0 md:w-64 px-6 py-3 flex items-center justify-between md:justify-center">
        <h1 className="text-gray-900">
          <div className="flex items-start max-h-8 overflow-hidden block w-56">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Warehouse</h1>
            </div>
          </div>
        </h1>
        <span className="md:hidden">
          <button className="text-white focus:outline-hidden">
            <div className="h-4 w-4">
              <HiMenuAlt3 />
            </div>
          </button>
        </span>
      </div>
      <div className="bg-white border-b border-gray-400 w-full py-2 px-4 md:py-0 md:text-md flex justify-between items-center">
        <div className="mt-1 mr-4 flex items-center">
          <div className="relative">us</div>
          <div className="relative"></div>
        </div>
        <div className="flex items-center gap-x-3">
          <div className="px-4 flex gap-x-3 items-center">
            <a className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold">
              <HiOutlineCog className="w-5 h-5" />
            </a>
            <button className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold focus:outline-hidden">
              <HiOutlineBell className="w-5 h-5" />
            </button>
          </div>
          <div className="relative"></div>
        </div>
      </div>
    </div>
  );
};
