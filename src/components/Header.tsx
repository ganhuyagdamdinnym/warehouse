import { HiMenuAlt3, HiOutlineBell, HiOutlineCog } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import {
  useState,
  useEffect,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react"; // Added useEffect and useRef

type Props = {
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
  isOpenSidebar: boolean;
};
export const Header = (props: Props) => {
  const { setIsOpenSidebar, isOpenSidebar } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a reference for the dropdown

  const handleOpen = () => {
    setIsOpen(!isOpen); // Simplified toggle logic
  };

  // Close dropdown when clicking outside
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Warehouse</h1>
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
            <button className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold">
              <HiOutlineCog className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center p-2 bg-white text-gray-700 hover:text-white hover:bg-blue-700 rounded-sm font-bold focus:outline-hidden">
              <HiOutlineBell className="w-5 h-5" />
            </button>
          </div>

          {/* Attached Ref to this wrapper container */}
          <div className="relative" ref={dropdownRef}>
            <div>
              <button
                onClick={handleOpen}
                className="flex items-center p-1 rounded-full focus:outline-hidden focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
              >
                <div className="h-8 w-8 rounded-full object-cover sm:mr-2 bg-black"></div>
                <span className="hidden sm:inline-flex items-center mr-2">
                  Ganaa Daimaa
                </span>
                <IoIosArrowDown className={`h-3 w-3 hidden sm:inline-flex`} />
              </button>
            </div>
            {isOpen && (
              <div className="w-48 origin-top-right right-0 absolute z-50 my-2 rounded-md shadow-lg">
                <div className="rounded-md ring-1 ring-black/5 py-2 bg-white">
                  <div className="block px-4 py-2 text-xs text-gray-400">
                    Manage Account
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-2 leading-5 text-gray-700 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                  >
                    Profile
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <button className="block w-full px-4 py-2 leading-5 text-gray-700 text-left hover:bg-gray-100 focus:outline-hidden transition duration-150 ease-in-out">
                    Log Out
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
