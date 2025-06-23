import React from "react";

const mockMessages = [
  {
    id: 1,
    name: "Dr. Panharith",
    lastMessage: "Please confirm if you got my last prescription...",
    time: "Now",
    status: "online",
    avatar: "/avatars/user1.jpg",
  },
  {
    id: 2,
    name: "Customer Support",
    lastMessage: "Thank you for your feedback!",
    time: "Today, 9:30 AM",
    status: "offline",
    avatar: "/avatars/user2.jpg",
  },
  {
    id: 3,
    name: "Pharmacy Stock Team",
    lastMessage: "Restock request has been approved.",
    time: "Yesterday",
    status: "offline",
    avatar: "/avatars/user3.jpg",
  },
];

const MessagesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Messages
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md divide-y divide-gray-200 dark:divide-gray-700">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <img
              src={msg.avatar}
              alt={msg.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {msg.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {msg.lastMessage}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {msg.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
