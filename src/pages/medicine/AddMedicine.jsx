import  { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import axios from "axios"; // Uncomment when ready to use API
import { useTranslation } from "../../hooks/useTranslation";

const AddMedicine = () => {
  
  const { t } = useTranslation();

  // State for medicine form
  const [medicine, setMedicine] = useState({
    medicine_name: "",
    price: "",
    quantity: "",
    in_stock_date: "",
    weight: "",
    expire_date: "",
    status: "",
    category: "",
    medicine_detail: "",
    barcode_number: "",
  });

  // Modal states
  const [openScanner, setOpenScanner] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Medicine Data:", medicine);
    alert(t("add-medicine.SuccessMessage")); // Simulate success
    // TODO: Uncomment below to send data to backend
    // axios.post('/api/medicine', medicine).then(...).catch(...);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {t("add-medicine.AddMedicine")}
          </h1>
          <p className="text-gray-600">{t("add-medicine.title-addmedicine")}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="text-xs text-emerald-500 border border-emerald-500 px-4 py-2 rounded-md hover:text-white hover:bg-emerald-500 transition"
        >
          {t("add-medicine.ButtonAddSupplier")}
        </button>
      </div>

      {/* Supplier Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsFormOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">
              {t("add-medicine.SupplierFormTitle")}
            </h2>
            <p className="text-gray-500 mb-4">
              {t("add-medicine.SupplierFormDescription")}
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("add-medicine.SupplierName")}
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <input
                type="text"
                placeholder={t("add-medicine.PharmacyName")}
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <input
                type="text"
                placeholder={t("add-medicine.Address")}
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <input
                type="file"
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <input
                type="text"
                placeholder={t("add-medicine.InvoiceID")}
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <input
                type="date"
                className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
                required
              />
              <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4">
                <button
                  type="submit"
                  className="border text-green-600 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md"
                >
                  {t("add-medicine.Save")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="hover:text-red-600 text-gray-400 rounded-md"
                >
                  {t("add-medicine.Cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicine Add Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Medicine Name */}
          <div className="flex flex-col">
            <label htmlFor="medicine_name" className="mb-2">
              {t("add-medicine.Madicinename")}
            </label>
            <input
              type="text"
              id="medicine_name"
              name="medicine_name"
              placeholder={t("add-medicine.MecineName-PlaceHolder")}
              value={medicine.medicine_name}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-2">
              {t("add-medicine.Price")}
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder={t("add-medicine.Price-PlaceHolder")}
              value={medicine.price}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label htmlFor="quantity" className="mb-2">
              {t("add-medicine.Quantity")}
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder={t("add-medicine.Quantity-PlaceHolder")}
              value={medicine.quantity}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* In Stock Date */}
          <div className="flex flex-col">
            <label htmlFor="in_stock_date" className="mb-2">
              {t("add-medicine.InStockDate")}
            </label>
            <input
              type="date"
              id="in_stock_date"
              name="in_stock_date"
              value={medicine.in_stock_date}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col">
            <label htmlFor="weight" className="mb-2">
              {t("add-medicine.Weight")}
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder={t("add-medicine.Weight-PlaceHolder")}
              value={medicine.weight}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* Barcode Scanner */}
          <div className="flex flex-col relative">
            <label htmlFor="barcode_number" className="mb-2">
              {t("add-medicine.BarcodeScan")}
            </label>
            <div className="border border-gray-400 text-xs font-light focus-within:outline-green-400 focus-within:border-green-700 z-10 rounded-sm px-6 py-2 cursor-pointer relative">
              <input
                id="barcode_number"
                type="text"
                name="barcode_number"
                value={medicine.barcode_number}
                onChange={handleChange}
                placeholder={t("add-medicine.BarcodeScan-PlaceHolder")}
                className="bg-transparent focus:outline-none w-full"
                readOnly
              />
              <button
                type="button"
                onClick={() => setOpenScanner(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label="Open scanner"
              >
                <img
                  src="https://img.icons8.com/ios/50/barcode.png"
                  alt="Scan"
                  width="25"
                />
              </button>
            </div>
          </div>

          {/* Expire Date */}
          <div className="flex flex-col">
            <label htmlFor="expire_date" className="mb-2">
              {t("add-medicine.ExpireDate")}
            </label>
            <input
              type="date"
              id="expire_date"
              name="expire_date"
              value={medicine.expire_date}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-2">
              {t("add-medicine.Status")}
            </label>
            <select
              id="status"
              name="status"
              value={medicine.status}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            >
              <option value="">{t("add-medicine.Status-PlaceHolder")}</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2">
              {t("add-medicine.Category")}
            </label>
            <select
              id="category"
              name="category"
              value={medicine.category}
              onChange={handleChange}
              className="text-xs border border-gray-400 px-2 py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700"
              required
            >
              <option value="">{t("add-medicine.Category-PlaceHolder")}</option>
              <option value="tablet">Tablet</option>
              <option value="syrup">Syrup</option>
              <option value="vitamin">Vitamin</option>
            </select>
          </div>

          {/* Medicine Details */}
          <div className="flex flex-col col-span-1 md:col-span-3">
            <label htmlFor="medicine_detail" className="mb-2">
              {t("add-medicine.MedicineInformation")}
            </label>
            <textarea
              id="medicine_detail"
              name="medicine_detail"
              placeholder={t("add-medicine.MedicineInformation-PlaceHolder")}
              value={medicine.medicine_detail}
              onChange={handleChange}
              className="border border-gray-400 w-full h-32 px-2 py-2 rounded-[4px] font-light text-xs focus:outline-green-400 focus:border-green-700"
              required
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-500 text-xs text-white px-3 py-3 rounded-md w-full md:w-auto shadow-md active:shadow-none"
          >
            {t("add-medicine.ButtonAddMedicine")}
          </button>
        </div>
      </form>

      {/* Barcode Scanner Modal */}
      {openScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="relative" style={{ height: "300px" }}>
              <BarcodeScannerComponent
                width="100%"
                height="100%"
                facingMode="environment"
                torch={torchOn}
                onUpdate={(err, result) => {
                  if (result) {
                    setMedicine((prev) => ({
                      ...prev,
                      barcode_number: result.text,
                    }));
                    setOpenScanner(false);
                  }
                  if (err) {
                    console.error("Scanner error:", err);
                  }
                }}
              />
              <button
                onClick={() => setTorchOn(!torchOn)}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full"
                aria-label={torchOn ? "Flash On" : "Flash Off"}
              >
                {torchOn ? "🔦 Flash On" : "💡 Flash Off"}
              </button>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {medicine.barcode_number &&
                  `${t("add-medicine.Scanned")}: ${medicine.barcode_number}`}
              </div>
              <button
                onClick={() => setOpenScanner(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("add-medicine.CloseScanner")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicine;
