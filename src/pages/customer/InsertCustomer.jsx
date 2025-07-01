import { useState, useCallback } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { createCustomer } from "../api/customerService";
const AddCustomer = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    item: "",
    quantity: "",
    amount: "",
  });
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!customer.quantity || parseInt(customer.quantity) < 0) {
        setError("Please enter the quantity of product !  ");
        setIsLoading(false);
        return;
      }

      try {
        const payload = {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          item: customer.item,
          quantity: parseInt(customer.quantity) || 0,
          amount: parseFloat(customer.amount) || 0,
        };

        console.log("Sending payload:", payload);
        await createCustomer(payload);
        setSuccess("Customer is create successfully !");
        setCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
          item: "",
          quantity: "",
          amount: "",
        });
      } catch (err) {
        console.error("Full error:", err);
        const errorMessage = err?.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [customer]
  );


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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor=" "
              className="mb-2 text-gray-700 dark:text-gray-300"
            >
              {t("add-customer.Name")}
            </label>
            <input
              type="text"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              name="name"
              value={customer.name}
              onChange={handleCustomerChange}
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
              value={customer.phone}
              onChange={handleCustomerChange}
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
              type="email"
              placeholder={t("add-customer.EmailPlaceholder")}
              name="email"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={customer.email}
              onChange={handleCustomerChange}
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
              value={customer.address}
              onChange={handleCustomerChange}
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
              value={customer.item}
              onChange={handleCustomerChange}
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
              type="number"
              name="quantity"
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={customer.quantity}
              onChange={handleCustomerChange}
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
              type="number"
              name="amount"
              value={customer.amount}
              onChange={handleCustomerChange}
              className="border border-gray-400 dark:border-gray-600 px-2 text-md py-2 rounded-[4px] font-light focus:outline-green-400 focus:border-green-700 focus:placeholder:text-green-400 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            />
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
