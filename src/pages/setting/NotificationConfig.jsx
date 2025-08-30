// src/pages/settings/NotificationConfig.jsx
export default function NotificationConfig({ settings, onChange }) {
  const sms = settings.find((s) => s.key === "sms_provider")?.value || "";
  const email = settings.find((s) => s.key === "email_host")?.value || "";

  return (
    <div className="p-4 border rounded bg-gray-50 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        ការជូនដំណឹង (Notifications)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        កំណត់អ្នកផ្គត់ផ្គង់សេវា SMS និងម៉ាស៊ីនផ្ញើអ៊ីមែល
        ដើម្បីអនុញ្ញាតឱ្យប្រព័ន្ធផ្ញើសារ និងអ៊ីមែលជូនដំណឹងទៅអតិថិជន ឬបុគ្គលិក។
      </p>

      <div className="mb-3">
        <label className="block font-medium mb-1">
          អ្នកផ្គត់ផ្គង់ SMS (SMS Provider)
        </label>
        <input
          value={sms}
          onChange={(e) => onChange("sms_provider", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. Twilio, Nexmo"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          ម៉ាស៊ីនផ្ញើអ៊ីមែល (Email Host)
        </label>
        <input
          value={email}
          onChange={(e) => onChange("email_host", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. smtp.gmail.com"
        />
      </div>
    </div>
  );
}
