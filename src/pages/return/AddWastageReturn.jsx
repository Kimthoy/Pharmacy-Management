import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../hooks/useTranslation";
import { Sun, Moon } from "lucide-react";

const AddWastageReturn = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    purchaseId: "",
    productName: "",
    genericName: "",
    category: "tablet",
    invoiceNo: "",
    amount: "",
    reason: "wrong_medication",
    quantity: "",
    date: "",
    status: "Active",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && !/^\d*\.?\d*$/.test(value)) {
      return; 
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields = [
      "customer",
      "email",
      "purchaseId",
      "productName",
      "genericName",
      "invoiceNo",
      "amount",
      "quantity",
      "date",
      "description",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(t("addWastageReturn.errors.required"));
        return;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError(t("addWastageReturn.errors.invalidEmail"));
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError(t("addWastageReturn.errors.invalidAmount"));
      return;
    }
    if (parseInt(formData.quantity) <= 0) {
      setError(t("addWastageReturn.errors.invalidQuantity"));
      return;
    }
    try {
      console.log("Submitting wastage return:", formData);
      setSuccess(t("addWastageReturn.success"));
      setFormData({
        customer: "",
        email: "",
        purchaseId: "",
        productName: "",
        genericName: "",
        category: "tablet",
        invoiceNo: "",
        amount: "",
        reason: "wrong_medication",
        quantity: "",
        date: "",
        status: "Active",
        description: "",
      });
    } catch (err) {
      setError(t("addWastageReturn.errors.submit"));
    }
  };

  return (
    <div
      className={`p-4 mb-16 rounded-md sm:shadow-md w-full max-w-6xl mx-auto ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {t("addWastageReturn.title")}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("addWastageReturn.description")}
          </p>
        </div>
        
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="customer" className="mb-2">
              {t("addWastageReturn.customer")}
            </label>
            <input
              type="text"
              name="customer"
              id="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder={t("addWastageReturn.customerPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.customer")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2">
              {t("addWastageReturn.email")}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("addWastageReturn.emailPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.email")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="purchaseId" className="mb-2">
              {t("addWastageReturn.purchaseId")}
            </label>
            <input
              type="text"
              name="purchaseId"
              id="purchaseId"
              value={formData.purchaseId}
              onChange={handleChange}
              placeholder={t("addWastageReturn.purchaseIdPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.purchaseId")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="productName" className="mb-2">
              {t("addWastageReturn.productName")}
            </label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder={t("addWastageReturn.productNamePlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.productName")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="genericName" className="mb-2">
              {t("addWastageReturn.genericName")}
            </label>
            <input
              type="text"
              name="genericName"
              id="genericName"
              value={formData.genericName}
              onChange={handleChange}
              placeholder={t("addWastageReturn.genericNamePlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.genericName")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2">
              {t("addWastageReturn.category")}
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
              aria-label={t("addWastageReturn.category")}
            >
              <option value="tablet">
                {t("addWastageReturn.categories.tablet")}
              </option>
              <option value="syrup">
                {t("addWastageReturn.categories.syrup")}
              </option>
              <option value="vitamin">
                {t("addWastageReturn.categories.vitamin")}
              </option>
              <option value="inhaler">
                {t("addWastageReturn.categories.inhaler")}
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="invoiceNo" className="mb-2">
              {t("addWastageReturn.invoiceNo")}
            </label>
            <input
              type="text"
              name="invoiceNo"
              id="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              placeholder={t("addWastageReturn.invoiceNoPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.invoiceNo")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-2">
              {t("addWastageReturn.amount")}
            </label>
            <input
              type="text"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder={t("addWastageReturn.amountPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.amount")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="reason" className="mb-2">
              {t("addWastageReturn.reason")}
            </label>
            <select
              name="reason"
              id="reason"
              value={formData.reason}
              onChange={handleChange}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
              aria-label={t("addWastageReturn.reason")}
            >
              <option value="wrong_medication">
                WrongMedication
              </option>
              <option value="wrong_dispensing">
                WrongDispensing
              </option>
              <option value="subsidence_symptoms">
                SubsidenceSymptoms
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="quantity" className="mb-2">
              {t("addWastageReturn.quantity")}
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder={t("addWastageReturn.quantityPlaceholder")}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.quantity")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="mb-2">
              {t("addWastageReturn.date")}
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
              aria-label={t("addWastageReturn.date")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-2">
              {t("addWastageReturn.status")}
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className={`border px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
              aria-label={t("addWastageReturn.status")}
            >
              <option value="Active">
                {t("addWastageReturn.statuses.active")}
              </option>
              <option value="Inactive">
                {t("addWastageReturn.statuses.inactive")}
              </option>
            </select>
          </div>

          <div className="flex flex-col lg:col-span-3">
            <label htmlFor="description" className="mb-2">
              {t("addWastageReturn.descriptions")}
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("addWastageReturn.descriptionPlaceholder")}
              className={`border w-full sm:h-[200px]  px-2 text-md py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
              aria-label={t("addWastageReturn.descriptions")}
            ></textarea>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className={`px-6 py-3 rounded-md w-full md:w-auto shadow-md active:shadow-none ${
              theme === "dark"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-emerald-500 hover:bg-emerald-600"
            } text-white`}
          >
            {t("addWastageReturn.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWastageReturn;
