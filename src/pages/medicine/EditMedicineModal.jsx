import { useState, useEffect, useMemo } from "react";
import { updateMedicine } from "../api/medicineService";
import { useTranslation } from "../../hooks/useTranslation";
import Select from "react-select";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";

const EditMedicineModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    medicine_name: "",
    price: "",
    weight: "",
    barcode: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null, // preview URL or server path
    imageFile: null, // new file (optional)
  });

  // Load categories & units when the modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          getAllCategory(),
          getAllUnits(),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
        setUnits(Array.isArray(unitRes) ? unitRes : unitRes?.data || []);
      } catch {
        // ignore
      }
    })();
  }, [isOpen]);

  // Prefill from initialData (no stale spread; no removed fields)
  useEffect(() => {
    if (!isOpen || !initialData) return;
    setFormData({
      id: initialData.id ?? null,
      medicine_name: initialData.medicine_name ?? "",
      price: initialData.price ?? "",
      weight: initialData.weight ?? "",
      barcode: initialData.barcode ?? "",
      medicine_detail: initialData.medicine_detail ?? "",
      category_ids: (initialData.categories || []).map((c) => c.id),
      unit_ids: (initialData.units || []).map((u) => u.id),
      image: initialData.image || null,
      imageFile: null,
    });
    setErrMsg("");
  }, [isOpen, initialData]);

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        value: c.id,
        label: c.category_name,
      })),
    [categories]
  );

  const unitOptions = useMemo(
    () =>
      (units || []).map((u) => ({
        value: u.id,
        label: u.unit_name,
      })),
    [units]
  );

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const v = value === "" ? "" : Number(value);
    setFormData((p) => ({
      ...p,
      [name]: value === "" ? "" : isNaN(v) ? p[name] : Math.max(0, v),
    }));
  };

  const handleCategoryChange = (selected) =>
    setFormData((p) => ({
      ...p,
      category_ids: selected ? selected.map((o) => o.value) : [],
    }));

  const handleUnitChange = (selected) =>
    setFormData((p) => ({
      ...p,
      unit_ids: selected ? selected.map((o) => o.value) : [],
    }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((p) => ({
      ...p,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));
  };

  const validate = () => {
    if (!formData.medicine_name.trim()) {
      return t("edit-medicine.ErrName") || "Name is required.";
    }
    if (formData.price !== "" && Number(formData.price) < 0) {
      return t("edit-medicine.ErrPrice") || "Price must be >= 0.";
    }
    if (formData.weight !== "" && Number(formData.weight) < 0) {
      return t("edit-medicine.ErrWeight") || "Weight must be >= 0.";
    }
    return "";
  };

  const handleSubmit = async () => {
    if (!formData.id) return;
    const v = validate();
    if (v) {
      setErrMsg(v);
      return;
    }

    setIsLoading(true);
    setErrMsg("");
    try {
      // match updateMedicine signature
      const payload = {
        medicine_name: formData.medicine_name,
        barcode: formData.barcode,
        price: formData.price,
        weight: formData.weight,
        medicine_detail: formData.medicine_detail,
        category_ids: formData.category_ids,
        unit_ids: formData.unit_ids,
        imageFile: formData.imageFile ?? undefined,
      };

      await updateMedicine(formData.id, payload);
      onClose?.();
      onSave?.();
    } catch (e) {
      setErrMsg(
        e?.response?.data?.message ||
          e?.message ||
          t("edit-medicine.UpdateFailed") ||
          "Failed to update medicine."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white dark:bg-slate-800 p-6 sm:py-10 sm:w-[60%] w-full h-full overflow-y-auto rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
          {t("edit-medicine.EditTitle")}
        </h2>

        {errMsg && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
            {errMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Barcode */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Barcode")}
            </label>
            <input
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder={t("edit-medicine.BarcodePh")}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.BarcodeDesc")}
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Name")}
            </label>
            <input
              name="medicine_name"
              value={formData.medicine_name}
              onChange={handleChange}
              placeholder={t("edit-medicine.NamePh")}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.NameDesc")}
            </p>
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Price")}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumberChange}
              placeholder={t("edit-medicine.PricePh")}
              className="w-full p-2 border rounded"
              min={0}
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.PriceDesc")}
            </p>
          </div>

          {/* Weight */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Weight")}
            </label>
            <input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder={t("edit-medicine.WeightPh")}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.WeightDesc")}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Category")}
            </label>
            <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter((o) =>
                formData.category_ids.includes(o.value)
              )}
              onChange={handleCategoryChange}
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.CategoryDesc")}
            </p>
          </div>

          {/* Unit */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Unit")}
            </label>
            <Select
              isMulti
              options={unitOptions}
              value={unitOptions.filter((o) =>
                formData.unit_ids.includes(o.value)
              )}
              onChange={handleUnitChange}
            />
            <p className="text-xs text-gray-500">
              {t("edit-medicine.UnitDesc")}
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Image")}
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-16 h-16 mt-2 object-cover"
              />
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="mt-6">
          <label className="block font-medium">
            {t("edit-medicine.Detail")}
          </label>
          <textarea
            name="medicine_detail"
            value={formData.medicine_detail}
            onChange={handleChange}
            placeholder={t("edit-medicine.DetailPh")}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded text-white"
          >
            {t("edit-medicine.BtnCancel")}
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
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
