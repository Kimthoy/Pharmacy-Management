import React, { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, pkg, allMedicines, onSave }) {
  const [items, setItems] = useState([]);

  // 🔑 Load items when pkg changes
  useEffect(() => {
    if (pkg) {
      setItems(pkg.items || []);
    }
  }, [pkg]);

  if (!isOpen) return null;

  // 🟢 Handle medicine select
  const handleMedicineChange = (index, medicineId) => {
    const updated = [...items];
    updated[index].medicine_id = medicineId;
    setItems(updated);
  };

  // 🟢 Handle quantity input
  const handleQuantityChange = (index, qty) => {
    const updated = [...items];
    updated[index].quantity = qty;
    setItems(updated);
  };

  // 🟢 Handle delete
  const handleDeleteRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // 🟢 Add new row
  const handleAddRow = () => {
    setItems([...items, { medicine_id: "", quantity: 1 }]);
  };

  // 🟢 Save
  const handleSave = () => {
    onSave({ ...pkg, items });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">កែប្រែផ្ទុំ {pkg?.name}</h2>

        <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ឈ្មោះថ្នាំ</th>
              <th className="border p-2">បរិមាណ</th>
              <th className="border p-2">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <select
                    className="w-full border rounded p-1"
                    value={it.medicine_id || ""}
                    onChange={(e) =>
                      handleMedicineChange(index, e.target.value)
                    }
                  >
                    <option value="">-- ជ្រើសរើស --</option>
                    {allMedicines.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={it.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    លុប
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleAddRow}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
        >
          ➕ បន្ថែមថ្នាំ
        </button>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            បោះបង់
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            រក្សាទុក
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
