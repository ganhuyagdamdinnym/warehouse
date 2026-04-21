import { useState, useEffect, useCallback } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineTrash,
  HiOutlineClock,
} from "react-icons/hi";
import { request } from "../../api/client";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  type: "success" | "warning" | "info";
  isRead: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request<any>("/notifications?limit=50");
      setNotifications(res.data || []);
      setTotal(res.total || 0);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error("Notification татахад алдаа:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await request("/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await request(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await request(`/notifications/${id}`, { method: "DELETE" });
      const wasUnread = notifications.find((n) => n.id === id && !n.isRead);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    if (!confirm("Бүх мэдэгдлийг устгах уу?")) return;
    try {
      await request("/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Дөнгөж сая";
    if (mins < 60) return `${mins} минутын өмнө`;
    if (hours < 24) return `${hours} цагийн өмнө`;
    return `${days} өдрийн өмнө`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return (
          <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500" />
        );
      default:
        return <HiOutlineInformationCircle className="w-5 h-5 text-blue-500" />;
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
              {unreadCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {total > 0 ? `Нийт ${total} мэдэгдэл` : "Мэдэгдэл байхгүй"}
              {unreadCount > 0 && ` · ${unreadCount} уншаагүй`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Бүгдийг уншсан гэж тэмдэглэх
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAll}
                className="text-sm font-semibold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Бүгдийг устгах
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Уншиж байна...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getTypeIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm ${!notif.isRead ? "font-bold" : "font-semibold"} text-gray-900`}
                      >
                        {notif.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                        <HiOutlineClock className="w-3 h-3" />
                        {formatTime(notif.createdAt)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2.5 flex gap-4">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors"
                        >
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
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <HiOutlineBell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Одоогоор мэдэгдэл байхгүй байна.
              </p>
            </div>
          )}
        </div>

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
