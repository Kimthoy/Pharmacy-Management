import { useState, useEffect } from "react";
import { updateMedicine } from "../api/medicineService"; // adjust path as needed
import Swal from "sweetalert2";
import { useTranslation } from "../../hooks/useTranslation";
import Select from "react-select";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";
const EditMedicineModal = ({ isOpen, onClose, onSave, initialData }) => {
  // const [formData, setFormData] = useState(initialData || {});
  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [medicine, setMedicine] = useState([]);
  const [formData, setFormData] = useState({
    medicine_name: "",
    price: "",
    weight: "",

    barcode: "",
    medicine_detail: "",
    category_id: null,
    unit_id: null,
    image: null,
    imageFile: null,
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        medicine_name: medicine.medicine_name || "",
        price: medicine.price || "",
        weight: medicine.weight || "",

        barcode: medicine.barcode || "",
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
  //Unit fetch
  useEffect(() => {
    const fetchUnit = async () => {
      setLoading(true);
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
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        medicine_name: initialData.medicine_name || "",
        price: initialData.price || "",
        weight: initialData.weight || "",

        barcode: initialData.barcode || "",
        medicine_detail: initialData.medicine_detail || "",
        category_ids: initialData.categories?.map((c) => c.id) || [],
        unit_ids: initialData.unit?.map((u) => u.id) || [],
        image: initialData.image || null,
        medicine_detail: initialData.medicine_detail || "",
        imageFile: null,
      });
    }
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

  //Set Unit Option
  const unitOptions = unit.map((unt) => ({
    value: unt.id,
    label: unt.unit_name,
  }));
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white sm:mb-0  dark:bg-slate-800 p-6 focus:border-none-xl sm:overflow-hidden overflow-y-auto sm:h-full h-full sm:py-14  sm:w-[50%] w-full  shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
          {t("edit-medicine.EditTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="">{t("edit-medicine.Barcode")}</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode || ""}
              onChange={handleChange}
              placeholder="Barcode Number"
              className="w-full p-2 border focus:border-none"
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Name")}</label>
            <input
              type="text"
              name="medicine_name"
              value={formData.medicine_name || ""}
              onChange={handleChange}
              placeholder="Medicine Name"
              className="w-full p-2 border focus:border-none"
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Price")}</label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border focus:border-none"
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Weight")}</label>
            <input
              type="text"
              name="weight"
              value={formData.weight || ""}
              onChange={handleChange}
              placeholder="Weight"
              className="w-full p-2 border focus:border-none"
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Category")}</label>
            <Select
              isMulti
              name="category_ids"
              options={categoryOptions}
              value={categoryOptions.filter((opt) =>
                formData.category_ids?.includes(opt.value)
              )}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  category_ids: selected
                    ? selected.map((opt) => opt.value)
                    : [],
                }));
              }}
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Unit")}</label>
            <Select
              name="unit_ids"
              isMulti
              options={unitOptions}
              value={unitOptions.filter((opt) =>
                formData.unit_ids?.includes(opt.value)
              )}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  unit_ids: selected ? selected.map((opt) => opt.value) : [],
                }));
              }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Detail")}</label>
            <div className="md:col-span-2">
              <textarea
                name="medicine_detail"
                value={formData.medicine_detail || ""}
                onChange={handleChange}
                placeholder="Medicine Details"
                className="w-full h-10 p-2 border  focus:border-none"
                rows={3}
              />
            </div>
          </div>
          <div>
            <label htmlFor="">{t("edit-medicine.Image")}</label>
            <input
              type="file"
              accept="image/*"
              className="border  h-12 p-2 cursor-pointer"
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
          </div>

          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 focus:border-none"
            />
          )}
        </div>

        <div className="sm:mb-0 mb-20 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 shadow-lg hover:bg-opacity-30 hover:text-red-600 py-2 focus:border-none text-white"
          >
            {t("edit-medicine.BtnCancel")}
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-blue-600 shadow-lg hover:bg-opacity-30 hover:text-blue-600 px-4 py-2 focus:border-none text-white"
          >
            {isLoading
              ? t("edit-medicine.BtnSaving")
              : t("edit-medicine.BtnSave")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineModal;
