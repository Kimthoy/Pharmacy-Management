import { useState, useEffect, useMemo } from "react";
import { updateMedicine } from "../api/medicineService";
import Swal from "sweetalert2";
import { useTranslation } from "../../hooks/useTranslation";
import Select from "react-select";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";

const EditMedicineModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    medicine_name: "",
    price: "",
    weight: "",
    barcode: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null, // preview URL or existing absolute URL
    imageFile: null, // File to upload
    manufacturer: "",
    origin: "",
    purchase: "",
    medicine_status: "",
    // BOX-only fields (pivot)
    strips_per_box: "",
    tablets_per_box: "",
  });

  // ========== Fetch lookups ==========
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          getAllCategory(),
          getAllUnits(),
        ]);
        setCategories(catRes || []);
        setUnits(unitRes || []);
      } catch (_) {
        // noop – your UI already has guards
      }
    })();
  }, [isOpen]);

  // ========== Prefill from initialData ==========
  useEffect(() => {
    if (!isOpen || !initialData) return;

    // pull pivot fields if Box exists in the loaded record
    const boxUnit = (initialData.units || []).find(
      (u) => String(u.unit_name).toLowerCase() === "box"
    );

    setFormData({
      id: initialData.id ?? null,
      medicine_name: initialData.medicine_name ?? "",
      price: initialData.price ?? "",
      weight: initialData.weight ?? "",
      barcode: initialData.barcode ?? "",
      medicine_detail: initialData.medicine_detail ?? "",
      category_ids: (initialData.categories || []).map((c) => c.id),
      unit_ids: (initialData.units || []).map((u) => u.id),
      image: initialData.image || null, // already a URL coming from the Resource
      imageFile: null,
      manufacturer: initialData.manufacturer ?? "",
      origin: initialData.origin ?? "",
      purchase: initialData.purchase ?? "",
      medicine_status: initialData.medicine_status ?? "",
      strips_per_box: boxUnit?.pivot?.strips_per_box ?? "",
      tablets_per_box: boxUnit?.pivot?.tablets_per_box ?? "",
    });
  }, [isOpen, initialData]);

  // ========== Select options ==========
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.category_name })),
    [categories]
  );
  const unitOptions = useMemo(
    () => units.map((u) => ({ value: u.id, label: u.unit_name })),
    [units]
  );

  // ========== Helpers for Box ==========
  const getBoxUnitId = () => {
    const box = unitOptions.find((opt) => opt.label === "Box");
    return box?.value ?? null;
  };
  const isBoxSelected = () => {
    const boxId = getBoxUnitId();
    return boxId ? formData.unit_ids.includes(boxId) : false;
  };

  // ========== Handlers ==========
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === "") return setFormData((p) => ({ ...p, [name]: "" }));
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    setFormData((p) => ({ ...p, [name]: n }));
  };

  const handleCategoryChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  const handleUnitChange = (selected) => {
    const nextUnitIds = selected ? selected.map((opt) => opt.value) : [];

    // If the user deselects Box, clear box-only fields to avoid sending stale pivots
    const boxId = getBoxUnitId();
    const boxStillSelected = boxId ? nextUnitIds.includes(boxId) : false;

    setFormData((prev) => ({
      ...prev,
      unit_ids: nextUnitIds,
      strips_per_box: boxStillSelected ? prev.strips_per_box : "",
      tablets_per_box: boxStillSelected ? prev.tablets_per_box : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: url, imageFile: file }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.id) {
        Swal.fire({
          icon: "error",
          title: "Invalid ID",
          text: "Missing record ID.",
        });
        return;
      }

      setIsLoading(true);

      // Build `units[]` payload expected by backend
      const unitsPayload = formData.unit_ids.map((uId) => {
        if (isBoxSelected() && uId === getBoxUnitId()) {
          return {
            unit_id: uId,
            strips_per_box:
              formData.strips_per_box !== "" && formData.strips_per_box != null
                ? Number(formData.strips_per_box)
                : undefined,
            tablets_per_box:
              formData.tablets_per_box !== "" &&
              formData.tablets_per_box != null
                ? Number(formData.tablets_per_box)
                : undefined,
          };
        }
        return { unit_id: uId };
      });

      // Send only fields your backend `update()` cares about
      const payload = {
        medicine_name: formData.medicine_name,
        barcode: formData.barcode,
        price: formData.price,
        weight: formData.weight,
        medicine_detail: formData.medicine_detail,
        manufacturer: formData.manufacturer,
        origin: formData.origin,
        purchase: formData.purchase,
        category_ids: formData.category_ids,
        units: unitsPayload,
        imageFile: formData.imageFile ?? undefined,
      };

      const res = await updateMedicine(formData.id, payload);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${formData.medicine_name} has been updated successfully.`,
      });

      onClose();
      onSave?.(res);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: error?.message || "Please check the form data and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 sm:py-14 sm:w-[50%] w-full sm:h-full h-full overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-slate-200">
          {t("edit-medicine.EditTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label>{t("edit-medicine.Barcode")}</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode || ""}
              onChange={handleChange}
              placeholder="Barcode Number"
              className="w-full p-2 border"
            />
          </div>

          <div>
            <label>{t("edit-medicine.Name")}</label>
            <input
              type="text"
              name="medicine_name"
              value={formData.medicine_name || ""}
              onChange={handleChange}
              placeholder="Medicine Name"
              className="w-full p-2 border"
            />
          </div>

          <div>
            <label>{t("edit-medicine.Price")}</label>
            <input
              type="number"
              name="price"
              value={formData.price ?? ""}
              onChange={handleNumberChange}
              placeholder="Price"
              className="w-full p-2 border"
            />
          </div>

          <div>
            <label>{t("edit-medicine.Weight")}</label>
            <input
              type="text"
              name="weight"
              value={formData.weight || ""}
              onChange={handleChange}
              placeholder="Weight"
              className="w-full p-2 border"
            />
          </div>

          <div>
            <label>{t("edit-medicine.Category")}</label>
            <Select
              isMulti
              name="category_ids"
              options={categoryOptions}
              value={categoryOptions.filter((opt) =>
                formData.category_ids?.includes(opt.value)
              )}
              onChange={handleCategoryChange}
            />
          </div>

          <div>
            <label>{t("edit-medicine.Unit")}</label>
            <Select
              name="unit_ids"
              isMulti
              options={unitOptions}
              value={unitOptions.filter((opt) =>
                formData.unit_ids?.includes(opt.value)
              )}
              onChange={handleUnitChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label htmlFor="manufacturer">
              {t("edit-medicine.Manufacturer")}
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Manufacturer"
              className="w-full p-2 border"
            />
          </div>

          {/* Origin */}
          <div>
            <label htmlFor="origin">{t("edit-medicine.Origin")}</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Country of Origin"
              className="w-full p-2 border"
            />
          </div>

          {/* Medicine Status (not persisted in code above, keep if needed) */}
          <div>
            <label htmlFor="medicine_status">
              {t("edit-medicine.MedicineStatus")}
            </label>
            <select
              name="medicine_status"
              value={formData.medicine_status}
              onChange={handleChange}
              className="w-full p-2 border"
            >
              <option value="">{t("edit-medicine.SelectStatus")}</option>
              <option value="prescription">
                {t("edit-medicine.Prescription")}
              </option>
              <option value="non-prescription">
                {t("edit-medicine.NonPrescription")}
              </option>
              <option value="otc">{t("edit-medicine.OTC")}</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label>{t("edit-medicine.Image")}</label>
            <input
              type="file"
              accept="image/*"
              className="border h-12 p-2 cursor-pointer"
              onChange={handleFileChange}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-12 h-12 object-cover mt-2"
              />
            )}
          </div>
        </div>
        {/* Box-only fields */}
        {isBoxSelected() && (
          <div className="flex gap-3">
            <div>
              <label>{t("edit-medicine.TabletPerBox")}</label>
              <input
                type="number"
                name="strips_per_box"
                min={1}
                value={formData.strips_per_box ?? ""}
                onChange={handleNumberChange}
                placeholder="e.g. 10"
                className="w-full p-2 border"
              />
            </div>

            <div>
              <label>{t("edit-medicine.CapsulePerBox")}</label>
              <input
                type="number"
                name="tablets_per_box"
                min={1}
                value={formData.tablets_per_box ?? ""}
                onChange={handleNumberChange}
                placeholder="e.g. 100"
                className="w-full p-2 border"
              />
            </div>
          </div>
        )}
        <div className="mt-4">
          <label>{t("edit-medicine.Detail")}</label>
          <textarea
            name="medicine_detail"
            value={formData.medicine_detail || ""}
            onChange={handleChange}
            placeholder="Medicine Details"
            className="w-full h-24 p-2 border"
            rows={3}
          />
        </div>

        <div className="sm:mb-0 mb-20 flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 text-white hover:bg-opacity-80"
          >
            {t("edit-medicine.BtnCancel")}
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className={`px-4 py-2 text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-opacity-90"
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
