import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { createMedicine } from "../api/medicineService";
import { getAllCategory } from "../api/categoryService";
import { getAllUnits } from "../api/unitService";
import { Html5QrcodeScanner } from "html5-qrcode"; // <-- fixed import
import BarcodeScanner from "../../components/BarcodeScanner";
import Select from "react-select";
import { LuScanBarcode } from "react-icons/lu";
const AddMedicine = () => {
  const { t } = useTranslation();
  const [medicine, setMedicine] = useState({
    medicine_name: "",
    barcode: "",
    price: "",
    weight: "",
    status: "active",
    category: "",
    unit_id: "",
    medicine_detail: "",
    category_ids: [],
    unit_ids: [],
    image: null,
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isScanning, setIsScanning] = useState(false);
  // const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [unit, setUnit] = useState([]);

  const openScanner = () => setIsScanning(true);
  const closeScanner = () => setIsScanning(false);

  const handleScanSuccess = (decodedText) => {
    setMedicine((prev) => ({
      ...prev,
      barcode: decodedText,
    }));
    setIsScanning(false);
  };
  // Fetch units once
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const data = await getAllUnits();
        setUnit(data);
      } catch (err) {
        setError("Failed to fetch units.");
      }
    };
    fetchUnit();
  }, []);
  const handleAmountBlur = () => {
    setMedicine((prev) => ({
      ...prev,
      price: parseFloat(prev.price || 0).toFixed(2),
    }));
  };
  // Fetch categories once
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getAllCategory();
        setCategory(data);
      } catch (err) {
        setError("Failed to fetch categories.");
      }
    };
    fetchCategory();
  }, []);

  // Handle form input change
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

  // Barcode scanner start
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner("scanner", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setMedicine((prev) => ({ ...prev, barcode: decodedText }));
        scanner.clear();
        setIsScanning(false);
      },
      (error) => {
        console.warn("Scan error:", error);
      }
    );

    setScannerInstance(scanner);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScanning]);

  const startScanner = () => setIsScanning(true);

  // Submit handler (simplified here)
  const handleMedicineSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("medicine_name", medicine.medicine_name);
        formData.append("barcode", medicine.barcode);
        formData.append("price", parseFloat(medicine.price) || 0);
        formData.append("weight", medicine.weight || "");
        formData.append("status", medicine.status);
        formData.append("medicine_detail", medicine.medicine_detail || "");
        medicine.category_ids.forEach((id) =>
          formData.append("category_ids[]", id)
        );
        medicine.unit_ids.forEach((id) => formData.append("unit_ids[]", id));
        if (medicine.image instanceof File)
          formData.append("image", medicine.image);

        await createMedicine(formData);
        setSuccess("Created successfully!");
        // Reset form if needed
        setMedicine({
          medicine_name: "",
          barcode: "",
          price: "",
          weight: "",
          status: "active",
          category: "",
          unit_id: "",
          medicine_detail: "",
          category_ids: [],
          unit_ids: [],
          image: null,
        });
        setImagePreview(null);
      } catch (err) {
        setError(err.message || "Failed to create medicine");
      } finally {
        setIsLoading(false);
      }
    },
    [medicine]
  );

  // Category options for react-select
  const categoryOptions = category.map((cat) => ({
    value: cat.id,
    label: cat.category_name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    setMedicine((prev) => ({
      ...prev,
      category_ids: selectedOptions.map((opt) => opt.value),
    }));
  };

  // Unit options
  const unitOptions = unit.map((unt) => ({
    value: unt.id,
    label: unt.unit_name,
  }));

  const handleUnitChange = (selectedOptions) => {
    setMedicine((prev) => ({
      ...prev,
      unit_ids: selectedOptions.map((opt) => opt.value),
    }));
  };

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
            {t("add-medicine.title-addmedicine")}
          </p>
        </div>
      </div>

      <form onSubmit={handleMedicineSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="barcode"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Barcode")}
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="barcode"
                name="barcode"
                placeholder={t("add-medicine.Barcode-Placeholder")}
                value={medicine.barcode || ""}
                onChange={handleMedicineChange}
                className="w-full text-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-16 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
              />
              <button
                type="button"
                onClick={startScanner}
                className="absolute right-1 top-1/2 -translate-y-1/2  px-3 py-1 rounded-md text-sm"
              >
                <LuScanBarcode className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Render scanner modal */}
          {isScanning && (
            <BarcodeScanner
              onScanSuccess={handleScanSuccess}
              onClose={closeScanner}
            />
          )}

          <div className="flex flex-col">
            <label
              htmlFor="medicine_name"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Madicinename")}
            </label>
            <input
              type="text"
              id="medicine_name"
              name="medicine_name"
              placeholder={t("add-medicine.MecineName-PlaceHolder")}
              value={medicine.medicine_name}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Price")}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder={t("add-medicine.Price-PlaceHolder")}
              value={medicine.price}
              onBlur={handleAmountBlur}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="weight"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Weight")}
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder={t("add-medicine.Weight-PlaceHolder")}
              value={medicine.weight}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>

          <div>
            <label htmlFor=""> {t("add-medicine.Category")}</label>
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
              className="basic-single-select"
              classNamePrefix="select"
              styles={{
                container: (base) => ({
                  ...base,
                  maxHeight: "150px",
                  marginBottom: "2.3rem",
                  marginTop: "0.5rem",
                }),
              }}
            />
          </div>
          <div>
            <label htmlFor=""> {t("add-medicine.Unit")}</label>
            <Select
              name="unit_id"
              options={unitOptions}
              value={unitOptions.filter((opt) =>
                Array.isArray(medicine.unit_ids)
                  ? medicine.unit_ids.includes(opt.value)
                  : false
              )}
              onChange={handleUnitChange}
              isMulti
              className="basic-single-select"
              classNamePrefix="select"
              styles={{
                container: (base) => ({
                  ...base,
                  maxHeight: "150px",
                  marginBottom: "2.3rem",
                  marginTop: "0.5rem",
                }),
              }}
            />
          </div>

          <div className="flex flex-col w-full max-w-lg relative">
            <label
              htmlFor="medicine-image"
              className="mb-2 text-md text-gray-900 dark:text-gray-100 tracking-wide"
            >
              {t("add-medicine.Photo")}
            </label>

            <input
              id="medicine-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleMedicineChange}
              className="mb-2 border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col col-span-1 md:col-span-3">
            <label
              htmlFor="medicine_detail"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.MedicineInformation")}
            </label>
            <textarea
              id="medicine_detail"
              name="medicine_detail"
              placeholder={t("add-medicine.MedicineInformation-PlaceHolder")}
              value={medicine.medicine_detail}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 w-full sm:h-28 h-16 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            ></textarea>
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
            {isLoading ? "Creating" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;
