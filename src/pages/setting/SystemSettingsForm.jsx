// src/pages/settings/SystemSettingsForm.jsx
import { useState } from "react";
import { updateSetting } from "../api/settingService";

export default function MaintenanceToggle({ currentValue }) {
  const [status, setStatus] = useState(currentValue);

  const toggleMaintenance = () => {
    const newValue = status === "on" ? "off" : "on";
    updateSetting("maintenance_mode", newValue).then(() => {
      setStatus(newValue);
      alert(`Maintenance mode set to ${newValue}`);
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="font-medium">របៀបថែទាំ (Maintenance Mode):</span>
      <button
        onClick={toggleMaintenance}
        className={`px-4 py-2 rounded ${
          status === "on" ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}
      >
        {status === "on" ? "ON" : "OFF"}
      </button>
    </div>
  );
}
