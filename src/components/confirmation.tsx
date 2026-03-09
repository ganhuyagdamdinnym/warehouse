type Props = {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export const Confirmation = ({
  onClose,
  onConfirm,
  title = "Бүртгэлийг устгах уу?",
  description = "Та энэ бүртгэлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.",
}: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 transition-opacity p-4"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl rounded-md w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Body */}
        <div className="px-6 py-5">
          <div className="text-lg font-semibold text-gray-900">{title}</div>
          <div className="mt-2 text-sm text-gray-600">{description}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-md">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition ease-in-out duration-150"
            >
              Болих
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-4 py-2 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-600 active:bg-red-700 transition ease-in-out duration-150"
            >
              Устгах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
