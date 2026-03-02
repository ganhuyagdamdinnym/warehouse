import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State for the preview URL
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Handle file selection with TypeScript ChangeEvent
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for the preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPhoto = (): void => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (): void => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the actual input
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    // Handle form logic here
  };
  return (
    <div className="md:flex-1 md:px-4 py-8 md:p-8 overflow-x-hidden md:overflow-y-auto print:m-0 print:p-0 print:overflow-visible">
      <div>
        <div>
          <div className="px-4 md:px-0 md:col-span-1">
            <h3 className="text-lg font-bold text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 text-gray-600">
              Update your account's profile information and email address.
            </p>
          </div>
          <p className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-tl-md md:rounded-tr-md">
                <div className="grid gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label className="font-medium text-gray-700 block mb-2">
                      Photo
                    </label>

                    {/* Hidden TS-typed File Input */}
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                    />

                    {/* Avatar Preview */}
                    <div className="mt-2">
                      {photoPreview ? (
                        <div
                          className="rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center border border-gray-200"
                          style={{ backgroundImage: `url(${photoPreview})` }}
                        />
                      ) : (
                        <div className="rounded-full w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <span className="text-xs">No Photo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleSelectPhoto}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none transition"
                      >
                        Select a new photo
                      </button>

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-red-600 uppercase tracking-widest shadow-sm hover:bg-red-50 focus:outline-none transition"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Ganaa Daimaa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="ganaa@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 transition uppercase tracking-wider"
                >
                  Save
                </button>
              </div>
            </form>
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="py-8">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="px-4 md:px-0 md:col-span-1">
            <h3 className="text-lg font-bold text-gray-900">Update Password</h3>
            <p className="mt-1 text-gray-600">
              Ensure your account is using a long, random password to stay
              secure.
            </p>
          </div>
          <div className="mt-6">
            <form>
              <div className="px-4 py-5 bg-white md:p-6 shadow-sm md:rounded-md md:rounded-tr-md">
                <div className="grid gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      Current Password
                    </label>
                    <input
                      type="text"
                      defaultValue="WH4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      New Password
                    </label>
                    <input
                      type="text"
                      defaultValue="WH4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label className="block text-md font-medium text-gray-900 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="text"
                      defaultValue="WH4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right md:px-6 shadow-sm md:rounded-bl-md md:rounded-br-md">
                <button className="relative flex items-center justify-center px-4 py-3 bg-gray-800 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-300 focus:shadow-outline-gray transition-all ease-in-out duration-150">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
