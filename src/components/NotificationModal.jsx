// NotificationModal.jsx
import { Link } from "react-router-dom";

const NotificationModal = ({ isOpen, onClose, notifications = [], t }) => {
  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation(); // prevent outside click handler from firing

  return (
    <div
      className="absolute right-0 z-20 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-label={t?.("topbar.notifications") || "Notifications"}
      onClick={stop}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
          {t?.("topbar.notifications") || "Notifications"}
        </h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500"
          aria-label={t?.("common.close") || "Close"}
          title={t?.("common.close") || "Close"}
        >
          ✕
        </button>
      </div>

      <ul className="max-h-96  overflow-auto">
        {notifications.length === 0 && (
          <li className="p-4 text-sm text-gray-500 dark:text-gray-300">
            {t?.("topbar.noNotifications") || "No notifications"}
          </li>
        )}

        {notifications.map((n) => (
          <li
            key={n.id}
            className="border-b border-gray-100 dark:border-gray-700"
          >
            <Link
              to={n.href || "/expiredate"} // <-- navigate here
              state={n.state || {}}
              className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onClose} // close dropdown after click
            >
              <div className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 h-2.5 w-2.5 rounded-full ${
                    n.type === "warning"
                      ? "bg-amber-500"
                      : n.status === "unread"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {n.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {n.message}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-400">{n.time}</div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="p-2 text-right">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        >
          {t?.("common.close") || "Close"}
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
