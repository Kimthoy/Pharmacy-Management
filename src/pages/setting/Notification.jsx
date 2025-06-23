import React from "react";

const notifications = [
  {
    id: 1,
    title: "New Message",
    message: "You have a new message from Dr. Panharith.",
    time: "Just now",
  },
  {
    id: 2,
    title: "System Update",
    message: "Scheduled maintenance at 2:00 AM tonight.",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Stock Alert",
    message: "Paracetamol is low in stock.",
    time: "Yesterday",
  },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Notifications
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <p className="text-gray-900 dark:text-white font-medium">
              {n.title}
            </p>
            <p className="text-gray-600 dark:text-gray-300">{n.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {n.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
