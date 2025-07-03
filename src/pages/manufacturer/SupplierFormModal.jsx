import React, { useState, useEffect } from "react";

const SupplierFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // company_id: "",
    company_name: "",
    email: "",
    phone_number: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        // company_id: "",
        company_name: "",
        email: "",
        phone_number: "",
        address: "",
        is_active: true,
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      email: formData.email.trim() === "" ? null : formData.email.trim(),
      phone_number:
        formData.phone_number.trim() === ""
          ? null
          : formData.phone_number.trim(),
      address: formData.address.trim() === "" ? null : formData.address.trim(),
    };
    onSubmit(cleanedData);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Add Supplier</h2>
        <form onSubmit={handleSubmit}>
      
          <input
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="mb-3 w-full border p-2 rounded"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mb-3 w-full border p-2 rounded"
          />
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="mb-3 w-full border p-2 rounded"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="mb-3 w-full border p-2 rounded"
          />
          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            Active
          </label>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierFormModal;
