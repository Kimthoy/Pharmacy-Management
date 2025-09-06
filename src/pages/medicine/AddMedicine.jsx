import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { createMedicine } from "../api/medicineService";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";
import { Html5QrcodeScanner } from "html5-qrcode";
import BarcodeScanner from "../../components/BarcodeScanner";
import Select from "react-select";
import { LuScanBarcode } from "react-icons/lu";

const AddMedicine = () => {
  const { t } = useTranslation();

  const [toast, setToast] = useState({ message: "", type: "" });
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);

  const barcodeRef = useRef(null);

  const [medicine, setMedicine] = useState({
    medicine_name: "",
    barcode: "",
    price: "",
    weight: "",
    category: "",
    unit_id: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null,
  });

  useEffect(() => {
    if (barcodeRef.current) barcodeRef.current.focus();
  }, []);

  const focusBarcodeField = () => {
    setTimeout(() => {
      if (barcodeRef.current) barcodeRef.current.focus();
    }, 200);
  };

  const closeScanner = () => {
    setIsScanning(false);
    focusBarcodeField();
  };

  const handleScanSuccess = (decodedText) => {
    setMedicine((prev) => ({ ...prev, barcode: decodedText }));
    setIsScanning(false);
    focusBarcodeField();
  };

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const data = await getAllUnits();
        setUnit(data);
      } catch {
        setError(t("add-medicine.Errors.UnitsFailed"));
      }
    };
    fetchUnit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAmountBlur = () => {
    setMedicine((prev) => ({
      ...prev,
      price:
        prev.price === "" || prev.price === null
          ? ""
          : Number(prev.price).toFixed(2),
    }));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getAllCategory();
        setCategory(data);
      } catch {
        setError(t("add-medicine.Errors.CategoriesFailed"));
      }
    };
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMedicineChange = useCallback((e) => {
    const { name, value, type, files, options } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setMedicine((prev) => ({ ...prev, [name]: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setMedicine((prev) => ({ ...prev, [name]: values }));
    } else {
      let newValue = value;
      if (type === "number" && name === "price") {
        const parsed = parseFloat(value);
        newValue = isNaN(parsed) ? "" : Math.max(parsed, 0);
      }
      setMedicine((prev) => ({ ...prev, [name]: newValue }));
    }
  }, []);

  // Barcode scanner
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });

    scanner.render(
      (decodedText) => {
        setMedicine((prev) => ({ ...prev, barcode: decodedText }));
        scanner.clear();
        setIsScanning(false);
        focusBarcodeField();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning]);

  const startScanner = () => setIsScanning(true);

  // Options
  const categoryOptions = category.map((cat) => ({
    value: cat.id,
    label: cat.category_name,
  }));

  const unitOptions = unit.map((unt) => ({
    value: unt.id,
    label: unt.unit_name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    setMedicine((prev) => ({
      ...prev,
      category_ids: (selectedOptions || []).map((opt) => opt.value),
    }));
  };

  const handleUnitChange = (selectedOptions) => {
    setMedicine((prev) => ({
      ...prev,
      unit_ids: (selectedOptions || []).map((opt) => opt.value),
    }));
  };

  // Submit
  const handleMedicineSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      setSuccess("");
      try {
        const formData = new FormData();
        formData.append("medicine_name", medicine.medicine_name || "");
        formData.append("barcode", medicine.barcode || "");
        formData.append(
          "price",
          medicine.price === ""
            ? ""
            : String(parseFloat(String(medicine.price)) || 0)
        );
        formData.append("weight", medicine.weight || "");
        formData.append("medicine_detail", medicine.medicine_detail || "");

        medicine.category_ids.forEach((id) =>
          formData.append("category_ids[]", String(id))
        );
        medicine.unit_ids.forEach((id) =>
          formData.append("unit_ids[]", String(id))
        );

        if (medicine.image instanceof File) {
          formData.append("image", medicine.image);
        }

        await createMedicine(formData);

        setSuccess(t("add-medicine.Messages.Created"));
        setToast({
          message: t("add-medicine.Messages.ToastSuccess"),
          type: "success",
        });

        // Reset
        setMedicine({
          medicine_name: "",
          barcode: "",
          price: "",
          weight: "",

          category: "",
          unit_id: "",
          medicine_detail: "",
          category_ids: [],
          unit_ids: [],
          image: null,
        });
        setImagePreview(null);
        focusBarcodeField();
      } catch (err) {
        const backendMsg =
          err?.response?.data?.message ||
          (err?.response?.data?.errors &&
            Object.entries(err.response.data.errors)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" | "));
        const msg =
          backendMsg || err?.message || t("add-medicine.Messages.CreateFailed");
        setError(msg);
        setToast({
          message: t("add-medicine.Messages.ToastFailed"),
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [medicine, t]
  );

  return (
    <div className="p-6 mb-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800 w-full max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          {toast.message && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                backgroundColor:
                  toast.type === "success" ? "#4CAF50" : "#F44336",
                color: "white",
                padding: "12px 20px",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 9999,
                minWidth: "250px",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              {toast.message}
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {t("add-medicine.AddMedicine")}
          </h2>
          <p className="text-gray-500 italic text-md dark:text-gray-400">
            {/* FIX: you had "add-micine.title-addmedicine" – use this key instead */}
            {t("add-medicine.Subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleMedicineSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Barcode */}
          <div className="flex flex-col">
            <label
              htmlFor="barcode"
              className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Barcode")}
            </label>
            <div className="relative w-full">
              <input
                ref={barcodeRef}
                type="text"
                id="barcode"
                name="barcode"
                value={medicine.barcode || ""}
                onChange={handleMedicineChange}
                placeholder={t("add-medicine.BarcodePh")}
                className="w-full text-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-16 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
              />
              <button
                type="button"
                onClick={() => setIsScanning(true)}
                aria-label={t("add-medicine.Scan")}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm"
                title={t("add-medicine.Scan")}
              >
                <LuScanBarcode className="w-5 h-5 text-green-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.BarcodeHelp")}
            </p>
          </div>

          {isScanning && (
            <BarcodeScanner
              onScanSuccess={handleScanSuccess}
              onClose={closeScanner}
            />
          )}

          {/* Name */}
          <div className="flex flex-col">
            <label
              htmlFor="medicine_name"
              className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Madicinename")}
            </label>
            <input
              type="text"
              id="medicine_name"
              name="medicine_name"
              value={medicine.medicine_name}
              onChange={handleMedicineChange}
              placeholder={t("add-medicine.NamePh")}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.NameHelp")}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Price")}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={medicine.price}
              onBlur={handleAmountBlur}
              onChange={handleMedicineChange}
              placeholder={t("add-medicine.PricePh")}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.PriceHelp")}
            </p>
          </div>

          {/* Weight */}
          <div className="flex flex-col">
            <label
              htmlFor="weight"
              className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Weight")}
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={medicine.weight}
              onChange={handleMedicineChange}
              placeholder={t("add-medicine.WeightPh")}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.WeightHelp")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <label className="text-sm font-medium dark:text-slate-300 ">
              {t("add-medicine.Category")}
            </label>
            <Select
              name="category_ids"
              options={categoryOptions}
              value={categoryOptions.filter((opt) =>
                Array.isArray(medicine.category_ids)
                  ? medicine.category_ids.includes(opt.value)
                  : false
              )}
              onChange={handleCategoryChange}
              isMulti
              classNamePrefix="select "
              className="mt-2"
              placeholder={t("add-medicine.CategoryPh")}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.CategoryHelp")}
            </p>
          </div>

          {/* Units */}
          <div>
            <label className="text-sm font-medium dark:text-slate-300">
              {t("add-medicine.Unit")}
            </label>
            <Select
              name="unit_ids"
              options={unitOptions}
              value={unitOptions.filter((opt) =>
                Array.isArray(medicine.unit_ids)
                  ? medicine.unit_ids.includes(opt.value)
                  : false
              )}
              onChange={handleUnitChange}
              isMulti
              classNamePrefix="select"
              className="mt-2"
              placeholder={t("add-medicine.UnitPh")}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.UnitHelp")}
            </p>
          </div>

          {/* Image */}
          <div className="flex flex-col w-full max-w-lg relative">
            <label
              htmlFor="medicine-image"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t("add-medicine.Photo")}
            </label>
            <input
              id="medicine-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleMedicineChange}
              className="mt-2 border px-2 py-2 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.PhotoHelp")}
            </p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt={t("add-medicine.PhotoPreviewAlt")}
                className="mt-2 h-28 w-28 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col col-span-1 md:col-span-3">
            <label
              htmlFor="medicine_detail"
              className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.MedicineInformation")}
            </label>
            <textarea
              id="medicine_detail"
              name="medicine_detail"
              value={medicine.medicine_detail}
              onChange={handleMedicineChange}
              placeholder={t("add-medicine.DetailPh")}
              className="text-md border border-gray-300 dark:border-gray-600 w-full sm:h-28 h-16 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("add-medicine.DetailHelp")}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-md text-md font-medium text-white transition ${
              isLoading
                ? "bg-green-400 dark:bg-green-500 cursor-not-allowed"
                : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
            } w-full md:w-auto shadow-md`}
          >
            {isLoading ? t("add-medicine.Creating") : t("add-medicine.Create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;
