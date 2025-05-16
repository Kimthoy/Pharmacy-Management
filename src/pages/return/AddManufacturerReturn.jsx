import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../hooks/useTranslation";
import { Sun, Moon } from "lucide-react";

const AddManufacturerReturn = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [amount, setAmount] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    // Regex to allow only double (floating-point) numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md w-full max-w-6xl mx-auto ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {t("addManufacturerReturn.title")}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("addManufacturerReturn.description")}
          </p>
        </div>
      </div>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="company" className="mb-2">
              {t("addManufacturerReturn.company")}
            </label>
            <input
              type="text"
              name="company"
              id="company"
              placeholder={t("addManufacturerReturn.companyPlaceholder")}
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2">
              {t("addManufacturerReturn.email")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("addManufacturerReturn.emailPlaceholder")}
              name="email"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2">
              {t("addManufacturerReturn.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              placeholder={t("addManufacturerReturn.phonePlaceholder")}
              name="phone"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="productname" className="mb-2">
              {t("addManufacturerReturn.productName")}
            </label>
            <input
              type="text"
              id="productname"
              placeholder={t("addManufacturerReturn.productNamePlaceholder")}
              name="productname"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="genericname" className="mb-2">
              {t("addManufacturerReturn.genericName")}
            </label>
            <input
              type="text"
              id="genericname"
              placeholder={t("addManufacturerReturn.genericNamePlaceholder")}
              name="genericname"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2">
              {t("addManufacturerReturn.category")}
            </label>
            <select
              id="category"
              name="category"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
            >
              <option value="tablet">
                {t("addManufacturerReturn.categories.tablet")}
              </option>
              <option value="syrub">
                {t("addManufacturerReturn.categories.syrub")}
              </option>
              <option value="vitamin">
                {t("addManufacturerReturn.categories.vitamin")}
              </option>
              <option value="inhealer">
                {t("addManufacturerReturn.categories.inhealer")}
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="invoiceno" className="mb-2">
              {t("addManufacturerReturn.invoiceNo")}
            </label>
            <input
              type="text"
              id="invoiceno"
              name="invoiceno"
              placeholder={t("addManufacturerReturn.invoiceNoPlaceholder")}
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-2">
              {t("addManufacturerReturn.amount")}
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleChange}
              placeholder={t("addManufacturerReturn.amountPlaceholder")}
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="reason" className="mb-2">
              {t("addManufacturerReturn.reason")}
            </label>
            <select
              id="reason"
              name="reason"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
            >
              <option value="wrong_medication">
                {t("addManufacturerReturn.reasons.wrongMedication")}
              </option>
              <option value="wrong_dispensing">
                {t("addManufacturerReturn.reasons.wrongDispensing")}
              </option>
              <option value="subsidence_symptoms">
                {t("addManufacturerReturn.reasons.subsidenceSymptoms")}
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="quantity" className="mb-2">
              {t("addManufacturerReturn.quantity")}
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder={t("addManufacturerReturn.quantityPlaceholder")}
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="mb-2">
              {t("addManufacturerReturn.date")}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-2">
              {t("addManufacturerReturn.status")}
            </label>
            <select
              id="status"
              name="status"
              className={`border px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-400 text-gray-900"
              }`}
              required
            >
              <option value="active">
                {t("addManufacturerReturn.statuses.active")}
              </option>
              <option value="inactive">
                {t("addManufacturerReturn.statuses.inactive")}
              </option>
            </select>
          </div>

          <div className="flex flex-col lg:col-span-3">
            <label htmlFor="description" className="mb-2">
              {t("addManufacturerReturn.descriptions")}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder={t("addManufacturerReturn.descriptionPlaceholder")}
              className={`border w-full h-[200px] px-2 text-sm py-2 rounded-[4px] font-light focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
              }`}
              required
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
            {t("addManufacturerReturn.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddManufacturerReturn;
