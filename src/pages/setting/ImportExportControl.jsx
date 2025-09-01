// src/pages/settings/ImportExportControl.jsx
export default function ImportExportControl() {
  const importData = () => alert("ការនាំចូលមិនទាន់អនុវត្តទេ!");
  const exportData = () => alert("ការនាំចេញមិនទាន់អនុវត្តទេ!");

  return (
    <div className=" border rounded bg-gray-50 mt-4">
      <h2 className="text-lg font-semibold mb-2">
        នាំចូល / នាំចេញ ទិន្នន័យ (Import / Export Data)
      </h2>
      <p className="text-sm text-gray-700 mb-3">
        អ្នកអាចនាំចូលឯកសារ CSV ឬ Excel ដើម្បីបញ្ចូលទិន្នន័យទៅក្នុងប្រព័ន្ធ
        ឬនាំចេញទិន្នន័យដែលមានស្រាប់ ដើម្បីរក្សាទុក ឬប្រើប្រាស់ក្រៅប្រព័ន្ធ។
      </p>

      <div className="space-x-3">
        <button
          onClick={importData}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          នាំចូល CSV/Excel
        </button>
        <button
          onClick={exportData}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          នាំចេញ CSV/Excel
        </button>
      </div>
    </div>
  );
}
