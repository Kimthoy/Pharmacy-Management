// src/pages/settings/IntegrationConfig.jsx
export default function IntegrationConfig({ settings, onChange }) {
  const printer = settings.find((s) => s.key === "printer_type")?.value || "";
  const barcode = settings.find((s) => s.key === "barcode_prefix")?.value || "";

  return (
    <div className="border rounded bg-gray-50 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        ការរួមបញ្ចូលប្រព័ន្ធ (Integrations)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        កំណត់រចនាបថម៉ាស៊ីនបោះពុម្ព និងការបង្កើតលេខកូដបាកូដ
        ដើម្បីប្រើប្រាស់នៅក្នុងការបោះពុម្ពវិក្កយបត្រ និងស្លាកផលិតផល។
      </p>

      <div className="mb-3">
        <label className="block font-medium mb-1">
          ប្រភេទម៉ាស៊ីនបោះពុម្ព (Printer Type)
        </label>
        <input
          value={printer}
          onChange={(e) => onChange("printer_type", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="thermal / laser / inkjet"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          បាកូដ Prefix (Barcode Prefix)
        </label>
        <input
          value={barcode}
          onChange={(e) => onChange("barcode_prefix", e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="ឧ. PHA, MED, DRG"
        />
      </div>
    </div>
  );
}
