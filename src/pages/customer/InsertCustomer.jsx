import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

const AddCustomer = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className=" mb-20  bg-white dark:bg-gray-900 rounded-md  dark:shadow-gray-800 w-full max-w-6xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("add-customer.AddCustomer")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("add-customer.AddCustomerDesc")}
          </p>
        </div>
      </div>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Name")}
            </label>
            <input
              type="text"
              name="name"
              placeholder={t("add-customer.NamePlaceholder")}
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Phone")}
            </label>
            <input
              type="text"
              placeholder={t("add-customer.PhonePlaceholder")}
              name="phone"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Email")}
            </label>
            <input
              type="text"
              placeholder={t("add-customer.EmailPlaceholder")}
              name="email"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="address"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Address")}
            </label>
            <input
              type="text"
              placeholder={t("add-customer.AddressPlaceholder")}
              name="address"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus纲绿-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="item"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.PurchasedItem")}
            </label>
            <input
              type="text"
              placeholder={t("add-customer.PurchasedItemPlaceholder")}
              name="item"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="quantity"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.PurchasedQuantity")}
            </label>
            <input
              type="text"
              name="quantity"
              placeholder={t("add-customer.PurchasedQuantityPlaceholder")}
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="amount"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Amount")}
            </label>
            <input
              type="text"
              name="amount"
              value={amount}
              onChange={handleChange}
              placeholder={t("add-customer.AmountPlaceholder")}
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Status")}
            </label>
            <select
              name="status"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 dark:bg-gray-700 dark:text-gray-200"
              required
            >
              <option value="active">{t("add-customer.StatusActive")}</option>
              <option value="inactive">
                {t("add-customer.StatusInactive")}
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="customer_detail"
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.CustomerDetails")}
            </label>
            <textarea
              placeholder={t("add-customer.CustomerDetailsPlaceholder")}
              name="customer_detail"
              required
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            ></textarea>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-md w-full md:w-auto shadow-md active:shadow-none hover:bg-green-600 dark:hover:bg-green-500"
          >
            {t("add-customer.ButtonAddCustomer")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
