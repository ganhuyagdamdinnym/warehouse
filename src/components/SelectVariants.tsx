import { IoIosArrowDown } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedValue?: React.Dispatch<React.SetStateAction<string>>;
};

export const SelectVariants = (props: Props) => {
  const { isOpen, onClose, setSelectedItem, setSearchTerm, setSelectedValue } =
    props;
  const handleOnclose = () => {
    onClose();
    setSelectedItem(null);
    setSearchTerm && setSearchTerm("");
    setSelectedValue && setSelectedValue("");
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-10 inset-0 bg-gray-500/75 transition-opacity flex justify-center items-center"
      onClick={handleOnclose} // 👈 Click backdrop → close
    >
      <div
        className="sm:max-w-2xl bg-white shadow-xl inline-block align-bottom md:rounded-md text-left transform transition-all lg:my-4 md:align-middle w-full relative z-999"
        onClick={(e) => e.stopPropagation()} // 👈 Prevent closing when clicking inside
      >
        <div className="relative px-6 py-4">
          <h3 className="text-lg font-bold">Select Variants</h3>

          {/* X Button */}
          <button
            onClick={handleOnclose} // 👈 X button → close
            className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none transition-colors"
          >
            ✕
          </button>

          <div className="mt-4">
            <section className="py-2 mx-auto max-w-7xl">
              <div className="col-span-6 sm:col-span-4 relative mb-6 w-full block">
                <input
                  className="placeholder-gray-400 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md shadow-sm block w-full h-12 px-4 outline-none"
                  placeholder="Scan Barcode"
                />
              </div>
              <div className="flex items-start gap-6">
                {/* Color */}
                <div className="col-span-6 sm:col-span-4 relative mb-2 w-1/2">
                  <label className="font-medium text-gray-700 inline-block mb-1">
                    Color
                  </label>
                  <div className="relative flex items-center">
                    <label className="inline-block cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 p-1 text-gray-500">
                      <IoIosArrowDown className="w-4 h-4" />
                    </label>
                    <input
                      className="placeholder-gray-400 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md shadow-sm block w-full h-12 px-4 pr-8 outline-none"
                      placeholder="Color"
                    />
                  </div>
                </div>

                {/* Size */}
                <div className="col-span-6 sm:col-span-4 relative mb-2 w-1/2">
                  <label className="font-medium text-gray-700 inline-block mb-1">
                    Size
                  </label>
                  <div className="relative flex items-center">
                    <label className="inline-block cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 p-1 text-gray-500">
                      <IoIosArrowDown className="w-4 h-4" />
                    </label>
                    <input
                      className="placeholder-gray-400 text-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md shadow-sm block w-full h-12 px-4 pr-8 outline-none"
                      placeholder="Size"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
