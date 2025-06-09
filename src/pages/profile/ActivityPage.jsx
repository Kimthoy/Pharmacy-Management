import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "lucide-react";

const ActivityPage = () => {
 
  const { theme } = useTheme();
  const { t } = useTranslation();
  const activities = [
    {
      type: "login",
      location: "New York, USA",
      timestamp: "2025-05-17T12:00:00+07:00",
    },
    { type: "profileUpdate", timestamp: "2025-05-16T09:30:00+07:00" },
    { type: "logout", timestamp: "2025-05-15T18:00:00+07:00" },
    {
      type: "login",
      location: "London, UK",
      timestamp: "2025-05-15T10:00:00+07:00",
    },
  ];
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    });
  };

  return (
    <div
      className={`flex-1 p-6 overflow-auto ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-semibold mb-6">{t("activity.title")}</h1>
      {activities.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t("activity.noActivity")}
        </p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
            >
              <Activity className="w-6 h-6 text-emerald-500 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.type === "login"
                    ? t("activity.events.login", {
                        location: activity.location,
                      })
                    : activity.type === "profileUpdate"
                    ? t("activity.events.profileUpdate")
                    : t("activity.events.logout")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityPage;
