import React, { useState, useEffect } from "react";
import { updateMedicine } from "../pages/api/medicineService";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const EditMedicineModal = ({ initialData, onClose, onUpdate }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMedicine(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateMedicine(medicine.id, medicine);
      if (onUpdate) onUpdate(medicine);
      onClose();
    } catch (error) {
      console.error("Failed to update medicine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content max-w-4xl">
        <button onClick={onClose} className="btn-close self-end">
          Close
        </button>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Input fields */}
            {/* (Same input fields you already wrote, no changes necessary there) */}
            {/* Copy them back here from your original code block if removed */}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg text-sm font-medium text-white transition ${
                isLoading
                  ? "bg-green-400 dark:bg-green-500 cursor-not-allowed"
                  : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
              } w-full md:w-auto shadow-md`}
            >
              {isLoading ? "Updating..." : "Update Medicine"}
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
                  onUpdate={(err, result) => {
                    if (result) {
                      setMedicine((prev) => ({
                        ...prev,
                        barcode_number: result.text,
                      }));
                      setOpenScanner(false);
                    }
                  }}
                />
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition"
                >
                  {torchOn ? "🔦 Off" : "💡 On"}
                </button>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {medicine.barcode_number &&
                    `Scanned: ${medicine.barcode_number}`}
                </div>
                <button
                  onClick={() => setOpenScanner(false)}
                  className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 text-sm transition"
                >
                  Close Scanner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMedicineModal;
