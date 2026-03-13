import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineClock,
} from "react-icons/hi";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Бараа дууссан",
    message: "Агуулах А-д 'Test Item 01' барааны үлдэгдэл 5-аас доош орлоо.",
    time: "2 минутын өмнө",
    type: "warning",
    isRead: false,
  },
  {
    id: "2",
    title: "Амжилттай хадгалагдлаа",
    message: "Шинэ хэрэглэгч 'Ibrahim Waters' системд амжилттай бүртгэгдлээ.",
    time: "1 цагийн өмнө",
    type: "success",
    isRead: false,
  },
  {
    id: "3",
    title: "Системийн шинэчлэл",
    message: "Өнөөдөр 22:00 цагт системийн төлөвлөгөөт засвар хийгдэнэ.",
    time: "3 цагийн өмнө",
    type: "info",
    isRead: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <HiOutlineCheckCircle className="w-6 h-6 text-green-500" />;
      case "warning":
        return (
          <HiOutlineExclamationCircle className="w-6 h-6 text-amber-500" />
        );
      default:
        return <HiOutlineInformationCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="md:flex-1 md:px-6 py-8 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4 md:px-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineBell className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Мэдэгдэл</h3>
            </div>
            <p className="text-sm text-gray-500">
              Таны бүртгэлтэй холбоотой сүүлийн үеийн мэдэгдлүүд.
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Бүгдийг уншсанаар тэмдэглэх
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                >
                  <div className="mt-1">{getTypeIcon(notif.type)}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm ${!notif.isRead ? "font-bold" : "font-semibold"} text-gray-900`}
                      >
                        {notif.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <HiOutlineClock className="w-3 h-3" />
                        {notif.time}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-3 flex gap-4">
                      {!notif.isRead && (
                        <button className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Унших
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <HiOutlineBell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Одоогоор мэдэгдэл байхгүй байна.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 italic">
            Мэдэгдлүүд 30 хоногийн дараа автоматаар устгагдана.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
