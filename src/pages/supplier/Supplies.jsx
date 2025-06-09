import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import axios from "axios";
const mockSuppliers = [
  { supplier_id: 1, name: "MediSupply Co." },
  { supplier_id: 2, name: "HealthCorp" },
];
const mockProducts = [
  { product_id: 1, name: "Paracetamol" },
  { product_id: 2, name: "Amoxicillin" },
];
const AddSupplyForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    qty: "",
    price: "",
    expire_date: "",
    supplier_id: "",
    product_id: "",
    manage_by: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setSuppliers(mockSuppliers);
    setProducts(mockProducts);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.qty || formData.qty <= 0) {
      errors.qty = t("supplyform.errorQty");
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = t("supplyform.errorPrice");
    }
    if (!formData.expire_date) {
      errors.expire_date = t("supplyform.errorExpireDate");
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.expire_date < today) {
        errors.expire_date = t("supplyform.errorExpireDatePast");
      }
    }
    if (!formData.supplier_id) {
      errors.supplier_id = t("supplyform.errorSupplier");
    }
    if (!formData.product_id) {
      errors.product_id = t("supplyform.errorProduct");
    }
    if (!formData.manage_by) {
      errors.manage_by = t("supplyform.errorManageBy");
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post("/api/supplies", formData);
      navigate("/supplierlist");
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormErrors({ general: t("supplyform.errorSubmit") });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {t("supplyform.title")}
          </h1>
          <button
            onClick={() => navigate("/supplierlist")}
            className="flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            <FaArrowLeft className="mr-2" />
            {t("supplyform.back")}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.qty")}
                </label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
                {formErrors.qty && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.qty}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.price")}
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
                {formErrors.price && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.expire_date")}
                </label>
                <input
                  type="date"
                  name="expire_date"
                  value={formData.expire_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                />
                {formErrors.expire_date && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.expire_date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.supplier_id")}
                </label>
                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                >
                  <option value="">{t("supplyform.selectSupplier")}</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.supplier_id}
                      value={supplier.supplier_id}
                    >
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {formErrors.supplier_id && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.supplier_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.product_id")}
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  required
                >
                  <option value="">{t("supplyform.selectProduct")}</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {formErrors.product_id && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.product_id}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("supplyform.supply_date")}
                </label>
                <input
                  type="text"
                  value={new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}
                  disabled
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200 opacity-50"
                />
              </div>
            </div>
            {formErrors.general && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-4">
                {formErrors.general}
              </p>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => navigate("/supplierlist")}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                {t("supplyform.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500 flex items-center"
              >
                <FaSave className="mr-2" />
                {t("supplyform.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplyForm;
