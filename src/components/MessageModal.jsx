import React from "react";

const MessageModal = ({ isOpen, onClose, recentChats, t }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 z-50 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-lg py-2 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("topbar.recentChats")}
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
        {recentChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={`${chat.name}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                    chat.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {chat.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-32">
                  {chat.message}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {chat.time}
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

export default MessageModal;
