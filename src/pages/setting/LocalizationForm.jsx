// src/pages/settings/LocalizationForm.jsx
export default function LocalizationForm({ settings, onChange }) {
  const locale = settings.find((s) => s.key === "locale")?.value || "";
  const currency = settings.find((s) => s.key === "currency")?.value || "";
  const timezone = settings.find((s) => s.key === "timezone")?.value || "";

  return (
    <div className="p-4 border rounded bg-gray-50 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        កំណត់ភាសា និងរូបិយប័ណ្ណ (Localization)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        កំណត់ភាសាបង្ហាញ រូបិយប័ណ្ណ និងម៉ោងតំបន់
        ដើម្បីឱ្យប្រព័ន្ធបង្ហាញត្រឹមត្រូវតាមតំបន់
        និងប្រើប្រាស់ក្នុងការបោះពុម្ពឯកសារ។
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-medium mb-1">ភាសា (Locale)</label>
          <input
            value={locale}
            onChange={(e) => onChange("locale", e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="ឧ. kh, en"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            រូបិយប័ណ្ណ (Currency)
          </label>
          <input
            value={currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="ឧ. KHR, USD"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">ម៉ោងតំបន់ (Timezone)</label>
          <input
            value={timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="ឧ. Asia/Phnom_Penh"
          />
        </div>
      </div>
    </div>
  );
}
