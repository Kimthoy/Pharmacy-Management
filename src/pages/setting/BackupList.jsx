import { useState, useEffect } from "react";
import {
  getBackupList,
  runBackup,
  downloadBackup,
} from "../api/settingsService";
import { LuDatabaseBackup } from "react-icons/lu";

const BackupList = () => {
  const [backupList, setBackupList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBackupList = async () => {
    try {
      const backups = await getBackupList();

      let list = [];
      if (Array.isArray(backups)) {
        list = backups;
      } else if (Array.isArray(backups?.data)) {
        list = backups.data;
      } else if (backups?.files) {
        list = backups.files;
      } else {
        
      }

      setBackupList(list);
    } catch (err) {
      
      setBackupList([]);
    }
  };

  const handleRunBackup = async () => {
    try {
      setLoading(true);
      setMessage("Running backup...");
      const result = await runBackup();

      if (result?.status === "success") {
        setMessage("Backup completed successfully!");
        await fetchBackupList();
      } else {
        setMessage(`Backup failed: ${result?.message || "Unknown error"}`);
      }
    } catch (error) {
      
      setMessage(
        `Backup failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackupList();
  }, []);

  return (
    <div>
      <button
        onClick={handleRunBackup}
        disabled={loading}
        className="mt-2 px-4 py-3 flex items-center gap-2 text-green-600 dark:text-green-400 rounded disabled:opacity-50"
      >
        {loading ? (
          "⏳ Backing up..."
        ) : (
          <>
            <LuDatabaseBackup className="w-5 h-5 text-green-600 dark:text-green-400" />
            Run Backup Now
          </>
        )}
      </button>

      {message && (
        <p
          className={`mt-2 text-xs ${
            message.includes("")
              ? "text-green-600 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <ul className="mt-4">
        {Array.isArray(backupList) && backupList.length === 0 && (
          <li className="text-gray-600 dark:text-gray-300">
            No backups found!
          </li>
        )}

        {(Array.isArray(backupList) ? backupList : []).map((b, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-200"
          >
            <div>
              <span className="font-medium">{b.name || "Unknown Backup"}</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                ({b.size || "??"})
              </span>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {b.date || "No date"}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => downloadBackup(b.name)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                ⬇ Download
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BackupList;
