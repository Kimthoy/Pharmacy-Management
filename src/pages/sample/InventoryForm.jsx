import React, { useState } from "react";
import Select from "react-select";

const InventoryForm = () => {
  const supplierOptions = [
    { value: 1, label: "ABC Co." },
    { value: 2, label: "MedSupply Ltd." },
  ];

  const medicineOptions = [
    { value: 1, label: "Paracetamol 500mg" },
    { value: 2, label: "Amoxicillin 250mg" },
  ];

  const [form, setForm] = useState({
    supplier_id: null,
    invoice_id: "",
    invoice_date: "",
    items: [
      {
        medicine_id: null,
        supply_quantity: 0,
        unit_price: 0,
        expire_date: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, name) => {
    setForm((prev) => ({ ...prev, [name]: selected ? selected.value : null }));
  };

  const handleItemChange = (index, name, value) => {
    const items = [...form.items];
    items[index][name] = value;
    setForm((prev) => ({ ...prev, items }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medicine_id: null,
          supply_quantity: 0,
          unit_price: 0,
          expire_date: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <div>
        <label className="block mb-1 font-medium">Supplier</label>
        <Select
          options={supplierOptions}
          value={
            supplierOptions.find((opt) => opt.value === form.supplier_id) ||
            null
          }
          onChange={(selected) => handleSelectChange(selected, "supplier_id")}
          isClearable
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Invoice ID</label>
        <input
          type="text"
          name="invoice_id"
          value={form.invoice_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Invoice Date</label>
        <input
          type="date"
          name="invoice_date"
          value={form.invoice_date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Medicine
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Quantity
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Unit Price
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Expire Date
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="border border-gray-300 px-2 py-1">
                  <Select
                    options={medicineOptions}
                    value={
                      medicineOptions.find(
                        (opt) => opt.value === item.medicine_id
                      ) || null
                    }
                    onChange={(selected) =>
                      handleItemChange(index, "medicine_id", selected?.value)
                    }
                    isClearable
                    placeholder="Select medicine"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    value={item.supply_quantity}
                    onChange={(e) =>
                      handleItemChange(index, "supply_quantity", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) =>
                      handleItemChange(index, "unit_price", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="date"
                    value={item.expire_date}
                    onChange={(e) =>
                      handleItemChange(index, "expire_date", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:underline"
                    title="Remove item"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addItem}
        className="bg-green-600 text-white px-3 py-2 rounded"
      >
        + Add Item
      </button>

      <button
        type="submit"
        className="block w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default InventoryForm;
