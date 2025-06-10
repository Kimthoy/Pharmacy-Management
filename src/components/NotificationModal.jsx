import React from "react";
import { MessageCircle, Bell, AlertTriangle } from "lucide-react";

const NotificationModal = ({ isOpen, onClose, notifications, t }) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageCircle size={16} className="text-emerald-500" />;
      case "bell":
        return <Bell size={16} className="text-blue-500" />;
      case "alert":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute right-0 z-50 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-lg py-2 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("topbar.notifications")}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={t("topbar.close")}
        >
          ✕
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIcon(notification.icon)}</div>
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {notification.title}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-40">
                  {notification.message}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between px-4 py-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400"></span>
        <button
          onClick={onClose}
          className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {t("topbar.viewAll")}
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
