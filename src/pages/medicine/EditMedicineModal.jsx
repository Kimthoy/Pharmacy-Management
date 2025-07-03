import React, { useState, useEffect } from "react";
import { updateMedicine } from "../api/medicineService"; // adjust path as needed
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";
const EditMedicineModal = ({ isOpen, onClose, onSave, initialData }) => {
  // const [formData, setFormData] = useState(initialData || {});
  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicine, setMedicine] = useState([]);
  const [formData, setFormData] = useState({
    medicine_name: "",
    price: "",
    weight: "",
    quantity: "",
    expire_date: "",
    status: "",
    barcode_number: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null,
    imageFile: null,
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        medicine_name: medicine.medicine_name || "",
        price: medicine.price || "",
        weight: medicine.weight || "",
        quantity: medicine.quantity || "",
        expire_date: medicine.expire_date || "",
        status: medicine.status || "",
        barcode_number: medicine.barcode_number || "",
        medicine_detail: medicine.medicine_detail || "",
        category_ids: medicine.categories
          ? medicine.categories.map((c) => c.id)
          : [],
        unit_ids: medicine.unit ? medicine.unit.map((u) => u.id) : [],
        image: medicine.image_url || null, // Your image URL or null
        imageFile: null,
      });
    }
  }, [medicine]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getAllCategory();
        setCategory(result);
      } catch (e) {
        console.error("Failed to load categories");
      }
    };
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await getAllCategory();
      setCategory(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  // const handleCategoryChange = (e) => {
  //   const selected = Array.from(e.target.selectedOptions, (option) =>
  //     Number(option.value)
  //   );
  //   setMedicine({ ...medicine, category_ids: selected });
  // };

  //Fetch unit
  //Unit fetch
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const result = await getAllUnits();
        setUnit(result);
      } catch (e) {
        console.error("Failed to load units");
      }
    };
    fetchUnit();
  }, []);
  const fetchUnit = async () => {
    setLoading(true);
    try {
      const data = await getAllUnits();
      setUnit(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch units.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUnit();
  }, []);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? "" : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  const handleSubmit = () => {
    handleSaveEdit(formData);
  };

  const handleSaveEdit = async (updatedMedicine) => {
    try {
      const payload = {
        ...updatedMedicine,
        category_ids: updatedMedicine.category_ids || [],
      };

      const updated = await updateMedicine(updatedMedicine.id, payload);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${updatedMedicine.medicine_name} has been updated successfully.`,
      });

      onClose();
      onSave(updated);
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: error?.message || "Please check the form data and try again.",
      });
    }
  };
  // import Select from "react-select";

  const categoryOptions = category.map((cat) => ({
    value: cat.id,
    label: cat.category_name,
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  //Set Unit Option
  const unitOptions = unit.map((unt) => ({
    value: unt.id,
    label: unt.unit_name,
  }));
  // const handleUnitChange = (selectedOptions) => {
  //   setMedicine((prev) => ({
  //     ...prev,
  //     unit_ids: selectedOptions.map((opt) => opt.value),
  //   }));
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white sm:mb-0 mb-16 dark:bg-slate-800 p-6 focus:border-none-xl overflow-y-auto max-h-[85vh] w-[95%] max-w-lg shadow-lg">
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
            className="w-full p-2 border focus:border-none"
          />
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border focus:border-none"
          />
          <input
            type="text"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            placeholder="Weight"
            className="w-full p-2 border focus:border-none"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full p-2 border focus:border-none"
          />
          <input
            type="date"
            name="expire_date"
            value={formData.expire_date}
            onChange={handleChange}
            className="w-full p-2 border focus:border-none"
          />
          <input
            type="text"
            name="barcode_number"
            value={formData.barcode_number || ""}
            onChange={handleChange}
            placeholder="Barcode Number"
            className="w-full p-2 border focus:border-none"
          />
          <Select
            name="category_id"
            options={categoryOptions}
            value={
              categoryOptions.find(
                (opt) => opt.value === formData.category_id
              ) || null
            }
            onChange={(selectedOption) => {
              setFormData((prev) => ({
                ...prev,
                category_id: selectedOption ? selectedOption.value : null,
              }));
            }}
            className="basic-single-select"
            classNamePrefix="select"
            styles={{
              container: (base) => ({
                ...base,
                maxHeight: "150px",
              }),
            }}
          />
          <Select
            name="unit_ids"
            options={unitOptions}
            value={
              unitOptions.find(
                (opt) => opt.value === formData.unit_ids
              ) || null
            }
            onChange={(selectedOption) => {
              setFormData((prev) => ({
                ...prev,
                unit_ids: selectedOption ? selectedOption.value : null,
              }));
            }}
            className="basic-single-select"
            classNamePrefix="select"
            styles={{
              container: (base) => ({
                ...base,
                maxHeight: "150px",
              }),
            }}
          />

          <Select
            name="status"
            options={statusOptions}
            value={
              statusOptions.find((opt) => opt.value === formData.status) || null
            }
            onChange={(selectedOption) => {
              handleChange({
                target: {
                  name: "status",
                  value: selectedOption ? selectedOption.value : "",
                },
              });
            }}
            classNamePrefix="select "
            className=" rounded-lg"
          />

          <div className="md:col-span-2">
            <textarea
              name="medicine_detail"
              value={formData.medicine_detail || ""}
              onChange={handleChange}
              placeholder="Medicine Details"
              className="w-full h-10 p-2 border focus:border-none"
              rows={3}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            className="border rounded-lg h-12 p-2 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setFormData((prev) => ({
                  ...prev,
                  image: imageUrl,
                  imageFile: file,
                }));
              }
            }}
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 focus:border-none"
            />
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 shadow-lg hover:bg-opacity-40 hover:text-red-600 py-2 focus:border-none text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 shadow-lg hover:bg-opacity-40 hover:text-blue-600 px-4 py-2 focus:border-none text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineModal;
