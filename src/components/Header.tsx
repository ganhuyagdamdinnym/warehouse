import {
  HiMenuAlt3,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "../hooks/auth";
import {
  useState,
  useEffect,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react"; // Added useEffect and useRef
import { LuWarehouse } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { request } from "../api/client";
type Props = {
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
  isOpenSidebar: boolean;
};
export const Header = (props: Props) => {
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  const { setIsOpenSidebar, isOpenSidebar } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a reference for the dropdown
  const profileImage = user?.image;
  const handleOpen = () => {
    setIsOpen(!isOpen); // Simplified toggle logic
  };

  // Энгийн хэрэглэгч — өөрийн агуулах
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLogoPreview, setWarehouseLogoPreview] = useState("");
  const [warehouseLogoBase64, setWarehouseLogoBase64] = useState("");

  // Энгийн хэрэглэгчийн агуулах мэдээлэл ачаалах
  useEffect(() => {
    if (!isSuperAdmin) {
      request<any>("/warehouses/my")
        .then((data) => {
          setWarehouseName(data.name || "");
          if (data.logo) {
            setWarehouseLogoPreview(data.logo);
            setWarehouseLogoBase64(data.logo);
          }
        })
        .catch(() => {});
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is open and the click is NOT inside the dropdown container
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="md:flex md:shrink-0 print:hidden">
      <div className="bg-gray-900 md:shrink-0 md:w-64 px-6 py-3 flex items-center justify-between md:justify-center">
        <h1 className="text-gray-900">
          <div className="flex items-start max-h-8 overflow-hidden w-56">
            <div className="flex items-center max-h-10 overflow-hidden w-56">
              {isSuperAdmin ? (
                // Super Admin бол өмнөх хэвээрээ
                <div className="flex items-center">
                  <LuWarehouse className="h-8 w-8 mr-3 text-indigo-500" />
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Warehouse
                  </h1>
                </div>
              ) : (
                // Энгийн хэрэглэгч бол Агуулахын лого болон нэр
                <div className="flex items-center gap-3">
                  {warehouseLogoPreview ? (
                    <img
                      src={warehouseLogoPreview}
                      alt="Logo"
                      className="h-12 w-12 object-contain rounded-sm"
                    />
                  ) : (
                    <LuWarehouse className="h-8 w-8 text-indigo-500" />
                  )}
                  <h1 className="text-lg font-semibold text-white truncate">
                    {warehouseName || "Агуулах"}
                  </h1>
                </div>
              )}
            </div>
          </div>
        </h1>
        <span className="md:hidden">
          <button className="text-white focus:outline-hidden">
            {isOpenSidebar == false ? (
              <div onClick={() => setIsOpenSidebar(true)} className="h-4 w-4">
                <HiMenuAlt3 />
              </div>
            ) : (
              <svg
                onClick={() => setIsOpenSidebar(false)}
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
            )}
          </button>
        </span>
      </div>
      <div className="bg-white border-b border-gray-200 w-full py-2 px-4 md:py-0 md:text-md flex justify-between items-center">
        <div className="mt-1 mr-4 flex items-center">
          <div className="relative text-sm text-gray-500 uppercase"></div>
        </div>
        <div className="flex items-center gap-x-3">
          <div className="px-4 flex gap-x-3 items-center">
            <button
              onClick={() => navigate("/settings")}
              className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold"
            >
              <HiOutlineCog className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold focus:outline-hidden"
            >
              <HiOutlineBell className="w-5 h-5" />
            </button>
          </div>

          {/* Attached Ref to this wrapper container */}
          <div className="relative" ref={dropdownRef}>
            <div>
              <button
                onClick={handleOpen}
                className="flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                      // Зураг ачаалахад алдаа гарвал Default icon гаргах fallback
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        // Энд fallback логик нэмж болно
                      }}
                    />
                  ) : (
                    <HiOutlineUserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>

                <span className="hidden sm:inline-flex items-center mx-2 font-medium text-gray-700">
                  {user?.name || "Хэрэглэгч"}
                </span>
                <IoIosArrowDown
                  className={`h-3 w-3 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {isOpen && (
              <div className="w-48 origin-top-right right-0 absolute z-50 my-2 rounded-md shadow-lg">
                <div className="rounded-md ring-1 ring-black/5 py-2 bg-white">
                  <a
                    href="/profile"
                    className="block px-4 py-2 leading-5 text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                  >
                    Пропайл
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => logout()}
                    className="block w-full px-4 py-2 leading-5 text-gray-700 text-left hover:bg-gray-100 focus:outline-hidden transition duration-150 ease-in-out"
                  >
                    Гарах
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
