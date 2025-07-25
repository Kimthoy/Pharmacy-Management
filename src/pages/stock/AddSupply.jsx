import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { createSupply } from "../api/suppliesService";
import { getAllSupplier } from "../api/supplierService";
import { getAllMedicines } from "../api/medicineService";
import { toast } from "react-toastify";
import { useTranslation } from "../../hooks/useTranslation";
const AddSupply = () => {
  const navigate = useNavigate();
  const [supply, setSupply] = useState({
    supplier_id: null,
    invoice_date: "",
    invoice_id: "",
  });
  const { t } = useTranslation();
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [supplyItems, setSupplyItems] = useState([
    { medicine_id: "", supply_quantity: "", expire_date: "", unit_price: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliers = await getAllSupplier(); 
        const medicinesResponse = await getAllMedicines();

        const medicines = Array.isArray(medicinesResponse)
          ? medicinesResponse
          : medicinesResponse.data || [];

        setSupplierOptions(
          suppliers.map((s) => ({
            value: s.id,
            label: s.company_name,
          }))
        );

        if (Array.isArray(medicines)) {
          setMedicineOptions(
            medicines.map((m) => ({
              value: m.id,
              label: m.medicine_name,
              barcode: m.barcode,
            }))
          );
        } else {
          console.error("Medicines is not an array:", medicines);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);


  const handleSupplierChange = (selected) => {
    setSupply((prev) => ({ ...prev, supplier_id: selected?.value || null }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...supplyItems];
    updated[index][field] = value;
    setSupplyItems(updated);
  };

  const addItem = () => {
    setSupplyItems([
      ...supplyItems,
      { medicine_id: "", supply_quantity: "", expire_date: "", unit_price: "" },
    ]);
  };

  const removeItem = (index) => {
    const updated = [...supplyItems];
    updated.splice(index, 1);
    setSupplyItems(updated);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllMedicines(1);
        const medicines = result?.data || [];

        setMedicineOptions(
          medicines.map((m) => ({
            value: m.id,
            label: m.medicine_name,
            barcode: m.barcode,
          }))
        );
      } catch (err) {
        console.error("Failed to load medicines", err);
      }
    };

    fetchData();
  }, []);

  const handleBarcodeScan = (barcode) => {
    const found = medicineOptions.find((m) => m.barcode === barcode);
    if (!found) return toast.error(`Barcode ${barcode} not found`);

    const index = supplyItems.findIndex(
      (item) => item.medicine_id === found.value
    );

    if (index === -1) {
      setSupplyItems((prev) => [
        ...prev,
        {
          medicine_id: found.value,
          supply_quantity: "1",
          expire_date: "",
          unit_price: "",
        },
      ]);
      toast.success(`Added: ${found.label}`);
    } else {
      const updated = [...supplyItems];
      updated[index].supply_quantity =
        parseInt(updated[index].supply_quantity || "0") + 1;
      setSupplyItems(updated);
      toast.info(`Updated quantity for: ${found.label}`);
    }
  };

  useEffect(() => {
    let buffer = "";
    let timeout;

    const handleKeyPress = (e) => {
      if (timeout) clearTimeout(timeout);

      if (e.key === "Enter") {
        if (buffer) handleBarcodeScan(buffer.trim());
        buffer = "";
      } else {
        buffer += e.key;
        timeout = setTimeout(() => (buffer = ""), 100);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [medicineOptions, supplyItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { ...supply, items: supplyItems };
      await createSupply(payload);
      toast.success("Supply created successfully!");
      navigate("/supplies");
    } catch (err) {
      toast.error(err.message || "Submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSupply((prev) => ({ ...prev, invoice_date: today }));
  }, []);

  return (
    <div className="shadow-lg bg-[#FBFBFB] dark:bg-slate-900 mb-14 max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold  dark:text-teal-50">
        {t("add-supply.title")}
      </h2>
      <p className="mb-4 text-gray-400">{t("add-supply.description")}</p>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 dark:text-teal-50">
              {t("add-supply.InvoiceDate")}
            </label>
            <input
              type="date"
              required
              className="border px-3 py-2 w-full"
              value={supply.invoice_date}
              onChange={(e) =>
                setSupply({ ...supply, invoice_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-teal-50">
              {t("add-supply.InvoiceID")}
            </label>
            <input
              required
              type="text"
              className="border px-3 py-2 w-full"
              value={supply.invoice_id}
              onChange={(e) =>
                setSupply({ ...supply, invoice_id: e.target.value })
              }
            />
          </div>
        </div>
        <div className="w-full sm:w-1/2 mt-4">
          <label className="block mb-1 dark:text-teal-50">
            {t("add-supply.Supplier")}
          </label>
          <Select
            options={supplierOptions}
            required
            onChange={handleSupplierChange}
            value={
              supplierOptions.find((opt) => opt.value === supply.supplier_id) ||
              null
            }
            isClearable
          />
        </div>
        <h3 className="font-semibold mt-6 dark:text-teal-50">
          {t("add-supply.SupplyItem")}
        </h3>
        <div className="w-full  ">
          {supplyItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md p-4 shadow-sm bg-white dark:bg-slate-800"
            >
              <div className="mb-3">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.Medicine")}
                </label>
                <Select
                  className="mt-1 text-md"
                  required
                  classNamePrefix="react-select"
                  value={
                    medicineOptions.find(
                      (opt) => opt.value === item.medicine_id
                    ) || null
                  }
                  onChange={(selected) =>
                    handleItemChange(
                      index,
                      "medicine_id",
                      selected?.value || ""
                    )
                  }
                  options={medicineOptions}
                  placeholder="Select medicine"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "white",
                      borderColor: "#ccc",
                      minHeight: "38px",
                      fontSize: "0.875rem",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.Quantity")}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  className="w-full px-3 py-2 mt-1 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.supply_quantity}
                  onChange={(e) =>
                    handleItemChange(index, "supply_quantity", e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.UnitPrice")}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  className="w-full px-3 py-2 mt-1 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "unit_price", e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.ExpireDate")}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.expire_date}
                  onChange={(e) =>
                    handleItemChange(index, "expire_date", e.target.value)
                  }
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 text-md hover:underline"
                >
                  {t("add-supply.Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-md text-green-600 hover:underline  rounded flex items-center gap-2 w-full sm:w-auto"
        >
          {t("add-supply.AddNew")}
        </button>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 shadow-lg text-md text-white px-6 py-2 mt-4 rounded w-full sm:w-auto"
          >
            {isLoading ? t("add-supply.Saving") : t("add-supply.Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupply;
