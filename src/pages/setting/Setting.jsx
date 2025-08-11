import { useState } from "react";
import AuditLogPage from "./AuditLogPage";
import BackupList from "./BackupList";
import Session from "./Session";

const BackupSection = () => {
  const [activeTab, setActiveTab] = useState("backup");

  return (
    <div>
      <div className="mt-10 mb-5 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex gap-6 border-b pb-2 dark:text-slate-300">
          <button
            onClick={() => setActiveTab("backup")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "backup"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            }`}
          >
            Backups
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "logs"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            }`}
          >
            Audit Logs
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "backup" && <BackupList />}
          {activeTab === "logs" && <AuditLogPage />}
        </div>
      </div>

      <div>
        <Session />
      </div>
    </div>
  );
};

export default BackupSection;
