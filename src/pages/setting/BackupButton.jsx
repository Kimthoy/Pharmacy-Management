// src/pages/settings/BackupButton.jsx
import axios from "axios";

export default function BackupButton() {
  const runBackup = () => {
    axios.post("http://localhost:8000/api/backup/run").then(() => {
      alert("បានចាប់ផ្តើមបម្រុងទុកទិន្នន័យ!");
    });
  };

  return (
    <div className=" border rounded bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">
        បម្រុងទុកទិន្នន័យ (Backup Data)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        ការបម្រុងទុកទិន្នន័យនឹងរក្សាទុកព័ត៌មានទាំងអស់របស់ឱសថស្ថាន
        ដើម្បីការពារការបាត់បង់។ សូមចុចប៊ូតុងខាងក្រោម
        ដើម្បីចាប់ផ្តើមការបម្រុងទុក។
      </p>

      <button
        onClick={runBackup}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ចាប់ផ្តើមបម្រុងទុក
      </button>
    </div>
  );
}
