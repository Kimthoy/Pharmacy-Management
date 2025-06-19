import React, { useState, useEffect } from "react";
import { updateMedicine } from "../api/medicineService"; // adjust path as needed
import Swal from "sweetalert2";

const EditMedicineModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleSaveEdit(formData);
  };

  const handleSaveEdit = async (updatedMedicine) => {
    try {
      const updated = await updateMedicine(updatedMedicine.id, updatedMedicine);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${updatedMedicine.medicine_name} has been updated successfully.`,
      });

      onClose();
      onSave(updated); // This triggers the refresh in parent component
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: error?.message || "Please check the form data and try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[90%] max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
          Edit Medicine
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name || ""}
            onChange={handleChange}
            placeholder="Medicine Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            placeholder="Weight"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="expire_date"
            value={formData.expire_date || ""}
            onChange={handleChange}
            placeholder="Expire Date"
            className="w-full p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="tablet">Tablet</option>
            <option value="syrup">Syrup</option>
            <option value="vitamin">Vitamin</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="barcode_number"
            value={formData.barcode_number || ""}
            onChange={handleChange}
            placeholder="Barcode Number"
            className="w-full p-2 border rounded"
          />
          <div className="md:col-span-2">
            <textarea
              name="medicine_detail"
              value={formData.medicine_detail || ""}
              onChange={handleChange}
              placeholder="Medicine Details"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineModal;
