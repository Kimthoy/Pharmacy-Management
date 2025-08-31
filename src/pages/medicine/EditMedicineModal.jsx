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

  const [formData, setFormData] = useState({
    id: null,
    medicine_name: "",
    price: "",
    weight: "",
    barcode: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null,
    imageFile: null,
    manufacturer: "",
    origin: "",
    purchase: "",
    medicine_status: "",
    strips_per_box: "",
    tablets_per_box: "",
  });

  // === Fetch categories & units ===
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
      } catch {}
    })();
  }, [isOpen]);

  // === Prefill from initialData ===
  useEffect(() => {
    if (!isOpen || !initialData) return;
    const boxUnit = (initialData.units || []).find(
      (u) => String(u.unit_name).toLowerCase() === "box"
    );

    setFormData({
      ...formData,
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
      manufacturer: initialData.manufacturer ?? "",
      origin: initialData.origin ?? "",
      purchase: initialData.purchase ?? "",
      medicine_status: initialData.medicine_status ?? "",
      strips_per_box: boxUnit?.pivot?.strips_per_box ?? "",
      tablets_per_box: boxUnit?.pivot?.tablets_per_box ?? "",
    });
  }, [isOpen, initialData]);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.category_name })),
    [categories]
  );
  const unitOptions = useMemo(
    () => units.map((u) => ({ value: u.id, label: u.unit_name })),
    [units]
  );

  const getBoxUnitId = () =>
    unitOptions.find((opt) => opt.label === "Box")?.value;
  const isBoxSelected = () => {
    const boxId = getBoxUnitId();
    return boxId ? formData.unit_ids.includes(boxId) : false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value === "" ? "" : Math.max(0, Number(value)),
    }));
  };

  const handleCategoryChange = (selected) =>
    setFormData((p) => ({
      ...p,
      category_ids: selected ? selected.map((o) => o.value) : [],
    }));

  const handleUnitChange = (selected) => {
    const ids = selected ? selected.map((o) => o.value) : [];
    const boxId = getBoxUnitId();
    const boxStill = boxId ? ids.includes(boxId) : false;
    setFormData((p) => ({
      ...p,
      unit_ids: ids,
      strips_per_box: boxStill ? p.strips_per_box : "",
      tablets_per_box: boxStill ? p.tablets_per_box : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((p) => ({
      ...p,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.id) return;

    setIsLoading(true);
    try {
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
        units: formData.unit_ids.map((uId) =>
          isBoxSelected() && uId === getBoxUnitId()
            ? {
                unit_id: uId,
                strips_per_box: Number(formData.strips_per_box) || undefined,
                tablets_per_box: Number(formData.tablets_per_box) || undefined,
              }
            : { unit_id: uId }
        ),
        imageFile: formData.imageFile ?? undefined,
      };

      const res = await updateMedicine(formData.id, payload);
      onClose();
      onSave?.(res);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white dark:bg-slate-800 p-6 sm:py-10 sm:w-[60%] w-full h-full overflow-y-auto rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-slate-200">
          {t("edit-medicine.EditTitle")}
        </h2>

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

          {/* Manufacturer */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Manufacturer")}
            </label>
            <input
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder={t("edit-medicine.ManufacturerPh")}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Origin */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.Origin")}
            </label>
            <input
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder={t("edit-medicine.OriginPh")}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">
              {t("edit-medicine.MedicineStatus")}
            </label>
            <select
              name="medicine_status"
              value={formData.medicine_status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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

        {/* Box only */}
        {isBoxSelected() && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label>{t("edit-medicine.TabletPerBox")}</label>
              <input
                type="number"
                name="strips_per_box"
                value={formData.strips_per_box}
                onChange={handleNumberChange}
                placeholder="e.g. 10"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>{t("edit-medicine.CapsulePerBox")}</label>
              <input
                type="number"
                name="tablets_per_box"
                value={formData.tablets_per_box}
                onChange={handleNumberChange}
                placeholder="e.g. 100"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {/* Detail */}
        <div className="mt-6">
          <label>{t("edit-medicine.Detail")}</label>
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
