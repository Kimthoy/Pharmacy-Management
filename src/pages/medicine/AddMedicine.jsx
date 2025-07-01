import { useState, useCallback, useEffect } from "react";
import BarcodeScanner from "../../components/BarcodeScanner";
// import { LiaWindowCloseSolid } from "react-icons/lia";
import { useTranslation } from "../../hooks/useTranslation";
import { createMedicine } from "../api/medicineService";
import { getAllCategory } from "../api/categoryService";
import { LuScanBarcode } from "react-icons/lu";
import Select from "react-select";
const AddMedicine = () => {
  const { t } = useTranslation();
  const [medicine, setMedicine] = useState({
    medicine_name: "",
    price: "",
    weight: "",
    quantity: "",
    expire_date: "",
    status: "active",
    category: "",
    medicine_detail: "",
    barcode_number: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleMedicineChange = useCallback((e) => {
    const { name, value, type, files, options } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setMedicine((prev) => ({
          ...prev,
          [name]: file,
        }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setMedicine((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setMedicine((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const [category, setCategory] = useState([]);
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

  const handleMedicineSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      // 🧪 Quantity validation
      if (!medicine.quantity || parseInt(medicine.quantity) < 0) {
        setError("Please enter the quantity of product!");
        setIsLoading(false);
        return;
      }

      // 🧪 Expire date validation
      if (
        medicine.expire_date &&
        new Date(medicine.expire_date) <= new Date()
      ) {
        setError(t("Ops! the expire date not enter yet!"));
        setIsLoading(false);
        return;
      }

      try {
        // ✅ Prepare FormData for Laravel + image
        const formData = new FormData();
        formData.append("medicine_name", medicine.medicine_name);
        formData.append("price", parseFloat(medicine.price) || 0);
        formData.append("weight", medicine.weight || "");
        formData.append("quantity", parseInt(medicine.quantity) || 0);
        formData.append("expire_date", medicine.expire_date || "");
        formData.append("status", medicine.status);
        formData.append("medicine_detail", medicine.medicine_detail || "");
        formData.append("barcode_number", medicine.barcode_number);

        // ✅ Append category_ids[] for Laravel array
        medicine.category_ids.forEach((id) => {
          formData.append("category_ids[]", id);
        });

        // ✅ Append image file only if valid
        if (medicine.image instanceof File) {
          formData.append("image", medicine.image);
        }

        // ✅ Debug: log FormData content
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        // ✅ Call API
        await createMedicine(formData);

        // ✅ Show success + reset form
        setSuccess("Success");
        setMedicine({
          medicine_name: "",
          price: "",
          weight: "",
          quantity: "",
          expire_date: "",
          status: "active",
          category: "",
          medicine_detail: "",
          barcode_number: "",
          category_ids: [],
          image: null, // ✅ set to null (not empty string)
        });
      } catch (err) {
        console.error("Full error:", err);
        const errorMessage = err?.message || "Something went wrong";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [t, medicine]
  );

  const handleDetected = (barcode) => {
    if (!medicine.barcode_number) {
      setMedicine((prev) => ({ ...prev, barcode_number: barcode }));
      // fetchMedicineDetails(barcode); // example async fetch
    }
  };
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");

  const handleScan = (scannedBarcode) => {
    setMedicine((prev) => ({ ...prev, barcode_number: scannedBarcode }));
    setShowScanner(false);
  };

  const categoryOptions = category.map((cat) => ({
    value: cat.id,
    label: cat.category_name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setMedicine((prev) => ({
      ...prev,
      category_ids: selectedIds,
    }));
  };
  return (
    <div className="p-6 mb-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800 w-full max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {t("add-medicine.AddMedicine")}
          </h2>
          <p className="text-gray-500 italic text-md dark:text-gray-400">
            {t("add-medicine.title-addmedicine")}
          </p>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 text-md rounded-md border border-red-200 dark:border-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-300 text-md rounded-md border border-green-200 dark:border-green-700">
          {success}
        </div>
      )}
      <form onSubmit={handleMedicineSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              defaultValue={"0"}
              placeholder={t("add-medicine.Price-PlaceHolder")}
              value={medicine.price}
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
          <div className="flex flex-col">
            <label
              htmlFor="quantity"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Quantity")}
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder={t("add-medicine.Quantity-PlaceHolder")}
              value={medicine.quantity}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="expire_date"
              className="mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.ExpireDate")}
            </label>
            <input
              type="date"
              id="expire_date"
              name="expire_date"
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              value={medicine.expire_date}
              onChange={handleMedicineChange}
              className="text-md border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col relative">
            <label
              htmlFor="barcode_number"
              className=" text-md  text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.BarcodeScan")}
            </label>
            <div className="relative">
              {/* Barcode Scan Button */}
              <button
                onClick={() => setShowScanner(true)}
                className="text-green-700 px-2 py-2 rounded-md absolute right-0 top-1"
                type="button"
              >
                <LuScanBarcode className="w-7 h-7 hover:scale-110 transition-all" />
              </button>

              {/* Barcode Text Input */}
              <input
                type="text"
                value={medicine.barcode_number}
                onChange={(e) =>
                  setMedicine({ ...medicine, barcode_number: e.target.value })
                }
                placeholder="Enter barcode"
                className="border rounded-lg border-slate-600 outline-none p-2 mt-2 block w-full"
              />

              {/* Barcode Scanner Popup */}
              {showScanner && (
                <BarcodeScanner
                  onScanSuccess={handleScan}
                  onClose={() => setShowScanner(false)}
                />
              )}
            </div>
          </div>

          <div>
            <label htmlFor=""> {t("add-medicine.Category")}</label>
            <Select
              isMulti
              name="category_ids"
              options={categoryOptions}
              value={categoryOptions.filter(
                (opt) =>
                  Array.isArray(medicine.category_ids) &&
                  medicine.category_ids.includes(opt.value)
              )}
              onChange={handleCategoryChange}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{
                container: (base) => ({
                  ...base,
                  maxHeight: "150px",
                  marginBottom: "2.3rem", // or '16px', '20px', etc.
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

            {imagePreview && (
              <div className="absolute right-0 top-0">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-24 h-24 object-cover rounded shadow border border-gray-300"
                />
              </div>
            )}
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
