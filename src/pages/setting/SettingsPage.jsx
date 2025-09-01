// src/pages/settings/SettingsPage.jsx
import { useEffect, useState } from "react";
import { getSettings, updateSetting } from "../api/settingService";

// Components
import MaintenanceToggle from "./MaintenanceToggle";
import BackupButton from "./BackupButton";
import ImportExportControl from "./ImportExportControl";
import NotificationConfig from "./NotificationConfig";
import LocalizationForm from "./LocalizationForm";
import PharmacyProfileForm from "./PharmacyProfileForm";
import IntegrationConfig from "./IntegrationConfig";

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const labels = {
    pharmacy_name: "ឈ្មោះឱសថស្ថាន (Pharmacy Name)",
    pharmacy_address: "អាសយដ្ឋាន (Address)",
    branch_code: "កូដសាខា (Branch Code)",
    locale: "ភាសា (Locale)",
    currency: "រូបិយប័ណ្ណ (Currency)",
    timezone: "ម៉ោងតំបន់ (Timezone)",
    sms_provider: "អ្នកផ្គត់ផ្គង់ SMS",
    email_host: "ម៉ាស៊ីនផ្ញើអ៊ីមែល",
    printer_type: "ប្រភេទម៉ាស៊ីនបោះពុម្ព",
    barcode_prefix: "បាកូដ Prefix",
    backup_enabled: "បើកប្រព័ន្ធបម្រុងទុក",
    import_export_enabled: "អនុញ្ញាត នាំចូល/នាំចេញ",
    maintenance_mode: "របៀបថែទាំ",
  };

  useEffect(() => {
    getSettings().then((res) => setSettings(res.data.data));
  }, []);

  const handleChange = (key, value) => {
    updateSetting(key, value).then(() =>
      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      )
    );
  };

  return (
    <div className="mb-24  space-y-6">
      <h1 className="text-xl font-semibold">System Settings</h1>

      <PharmacyProfileForm settings={settings} onChange={handleChange} />
      <LocalizationForm settings={settings} onChange={handleChange} />
      <NotificationConfig settings={settings} onChange={handleChange} />
      <IntegrationConfig settings={settings} onChange={handleChange} />

      <MaintenanceToggle
        currentValue={settings.find((s) => s.key === "maintenance_mode")?.value}
      />
      <BackupButton />
      <ImportExportControl />
    </div>
  );
}
