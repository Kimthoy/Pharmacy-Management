// src/pages/settings/MaintenanceToggle.jsx
import { useState } from "react";
import { updateSetting } from "../api/settingService";

export default function MaintenanceToggle({ currentValue }) {
  const [status, setStatus] = useState(currentValue);

  const toggleMaintenance = () => {
    const newValue = status === "on" ? "off" : "on";
    updateSetting("maintenance_mode", newValue).then(() => {
      setStatus(newValue);
      alert(
        newValue === "on"
          ? "ប្រព័ន្ធបានបើករបៀបថែទាំ!"
          : "ប្រព័ន្ធបានបិទរបៀបថែទាំ!"
      );
    });
  };

  return (
    <div className="p-2 border rounded bg-gray-50 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        របៀបថែទាំ (Maintenance Mode)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        ប្រព័ន្ធនៅក្នុងរបៀបថែទាំនឹងបិទសម្រាប់អ្នកប្រើទូទៅ
        ហើយអាចប្រើបានតែសម្រាប់អ្នកគ្រប់គ្រង។ សូមប្រុងប្រយ័ត្ននៅពេលបើករបៀបនេះ។
      </p>

      <div className="flex items-center space-x-3">
        <span className="font-medium">
          ស្ថានភាព៖{" "}
          <span className={status === "on" ? "text-red-600" : "text-green-600"}>
            {status === "on" ? "កំពុងថែទាំ" : "ធម្មតា"}
          </span>
        </span>
        <button
          onClick={toggleMaintenance}
          className={`px-4 py-2 rounded ${
            status === "on"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {status === "on" ? "បិទ Maintenance" : "បើក Maintenance"}
        </button>
      </div>
    </div>
  );
}
