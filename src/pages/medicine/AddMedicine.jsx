import { useState, useCallback } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useTranslation } from "../../hooks/useTranslation";
import { createMedicine,  } from "../api/medicineService";

const AddMedicine = () => {
  const { t } = useTranslation();
  const [medicine, setMedicine] = useState({
    medicine_name: "",
    price: "",
    weight: "",
    quantity: "",
    expire_date: "",
    status: "",
    category: "",
    medicine_detail: "",
    barcode_number: "",
  });
  const [openScanner, setOpenScanner] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMedicineChange = useCallback((e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleMedicineSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!medicine.quantity || parseInt(medicine.quantity) < 0) {
        setError(t("add-medicine.InvalidQuantity"));
        setIsLoading(false);
        return;
      }
      if (
        medicine.expire_date &&
        new Date(medicine.expire_date) <= new Date()
      ) {
        setError(t("add-medicine.InvalidExpireDate"));
        setIsLoading(false);
        return;
      }
      if (!medicine.barcode_number) {
        setError(t("add-medicine.InvalidBarcode"));
        setIsLoading(false);
        return;
      }

      try {
        const payload = {
          medicine_name: medicine.medicine_name,
          price: parseFloat(medicine.price) || 0,
          weight: medicine.weight,
          quantity: parseInt(medicine.quantity) || 0,
          expire_date: medicine.expire_date || null,
          status: medicine.status,
          category: medicine.category,
          medicine_detail: medicine.medicine_detail || null,
          barcode_number: medicine.barcode_number,
        };

        console.log("Sending payload:", payload);
        await createMedicine(payload);
        setSuccess(t("add-medicine.SuccessMessage"));
        setMedicine({
          medicine_name: "",
          price: "",
          weight: "",
          quantity: "",
          expire_date: "",
          status: "",
          category: "",
          medicine_detail: "",
          barcode_number: "",
        });
      } catch (err) {
        console.error("Full error:", err);
        const errorMessage = err?.message || t("add-medicine.ErrorMessage");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [t, medicine]
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800 w-full max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {t("add-medicine.AddMedicine")}
          </h2>
          <p className="text-gray-500 italic text-sm dark:text-gray-400">
            {t("add-medicine.title-addmedicine")}
          </p>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 text-sm rounded-md border border-red-200 dark:border-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-300 text-sm rounded-md border border-green-200 dark:border-green-700">
          {success}
        </div>
      )}
      <form onSubmit={handleMedicineSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="medicine_name"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Price")}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              placeholder={t("add-medicine.Price-PlaceHolder")}
              value={medicine.price}
              onChange={handleMedicineChange}
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="weight"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="quantity"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="expire_date"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.ExpireDate")} ({t("add-medicine.Optional")})
            </label>
            <input
              type="date"
              id="expire_date"
              name="expire_date"
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              value={medicine.expire_date}
              onChange={handleMedicineChange}
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            />
          </div>
          <div className="flex flex-col relative">
            <label
              htmlFor="barcode_number"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.BarcodeScan")}
            </label>
            <div className="relative">
              <input
                id="barcode_number"
                type="text"
                name="barcode_number"
                value={medicine.barcode_number}
                onChange={handleMedicineChange}
                placeholder={t("add-medicine.BarcodeScan-PlaceHolder")}
                className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
              />
              <button
                type="button"
                onClick={() => setOpenScanner(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                aria-label="Open barcode scanner"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Status")}
            </label>
            <select
              id="status"
              name="status"
              value={medicine.status}
              onChange={handleMedicineChange}
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            >
              <option value="">{t("add-medicine.Status-PlaceHolder")}</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.Category")}
            </label>
            <select
              id="category"
              name="category"
              value={medicine.category}
              onChange={handleMedicineChange}
              className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            >
              <option value="">{t("add-medicine.Category-PlaceHolder")}</option>
              <option value="tablet">Tablet</option>
              <option value="syrup">Syrup</option>
              <option value="vitamin">Vitamin</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col col-span-1 md:col-span-3">
            <label
              htmlFor="medicine_detail"
              className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-medicine.MedicineInformation")}
            </label>
            <textarea
              id="medicine_detail"
              name="medicine_detail"
              placeholder={t("add-medicine.MedicineInformation-PlaceHolder")}
              value={medicine.medicine_detail}
              onChange={handleMedicineChange}
              className="text-sm border border-gray-300 dark:border-gray-600 w-full h-28 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 transition"
            ></textarea>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-md text-sm font-medium text-white transition ${
              isLoading
                ? "bg-green-400 dark:bg-green-500 cursor-not-allowed"
                : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
            } w-full md:w-auto shadow-md`}
          >
            {isLoading
              ? t("add-medicine.Submitting")
              : t("add-medicine.ButtonAddMedicine")}
          </button>
        </div>
      </form>
      {openScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="relative" style={{ height: "300px" }}>
              <BarcodeScannerComponent
                width="100%"
                height="100%"
                facingMode="environment"
                torch={torchOn}
              />
              <button
                onClick={() => setTorchOn(!torchOn)}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition"
                aria-label={torchOn ? "Turn flash off" : "Turn flash on"}
              >
                {torchOn ? "🔦 Off" : "💡 On"}
              </button>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {medicine.barcode_number &&
                  `${t("add-medicine.Scanned")}: ${medicine.barcode_number}`}
              </div>
              <button
                onClick={() => setOpenScanner(false)}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-500 text-sm transition"
              >
                {t("add-medicine.CloseScanner")}
              </button>
            </div>
            {isLoading && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("add-medicine.LoadingMedicine")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicine;
