// src/pages/settings/PharmacyProfileForm.jsx
export default function PharmacyProfileForm({ settings, onChange }) {
  const name = settings.find((s) => s.key === "pharmacy_name")?.value || "";
  const address =
    settings.find((s) => s.key === "pharmacy_address")?.value || "";
  const branch = settings.find((s) => s.key === "branch_code")?.value || "";

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">
        ព័ត៌មានអំពីឱសថស្ថាន (Pharmacy Profile)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        កំណត់ព័ត៌មានសំខាន់ៗនៃឱសថស្ថាន រួមមានឈ្មោះ អាសយដ្ឋាន និងកូដសាខា
        ដើម្បីបង្ហាញនៅក្នុងវិក្កយបត្រ និងរបាយការណ៍។
      </p>

      <div className="mb-3">
        <label className="block font-medium mb-1">
          ឈ្មោះឱសថស្ថាន (Pharmacy Name)
        </label>
        <input
          value={name}
          onChange={(e) => onChange("pharmacy_name", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. មេឱសថស្ថាន ឬ Main Pharmacy"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">អាសយដ្ឋាន (Address)</label>
        <input
          value={address}
          onChange={(e) => onChange("pharmacy_address", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. ផ្ទះលេខ ១២៣ ផ្លូវសហព័ន្ធ ភ្នំពេញ"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">កូដសាខា (Branch Code)</label>
        <input
          value={branch}
          onChange={(e) => onChange("branch_code", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. MAIN, B001"
        />
      </div>
    </div>
  );
}
