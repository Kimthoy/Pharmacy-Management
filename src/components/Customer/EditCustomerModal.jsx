import { useState, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";

const EditCustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    item: "",
    quantity: "",
    amount: "",
    status: "active",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        item: customer.item || "",
        quantity: customer.quantity || "",
        amount: customer.amount || "",
        status: customer.status || "active",
      });
    }
  }, [customer]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Prevent gestures on iOS
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(customer.id, formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white  mb-16 dark:bg-gray-800 rounded-lg shadow-lg w-full sm:max-w-[600px] max-w-md max-h-[88vh] sm:overflow-visible overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {t("customerlist.EditCustomer")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Name")}
            </label>
            <input
              name="name"
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Phone")}
            </label>
            <input
              name="phone"
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Email")}
            </label>
            <input
              name="email"
              type="email"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Address")}
            </label>
            <input
              name="address"
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Item")}
            </label>
            <input
              name="item"
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.item}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Quantity")}
            </label>
            <input
              name="quantity"
              type="number"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("customerlist.Amount")}
            </label>
            <input
              name="amount"
              type="number"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end items-end gap-2 col-span-1 md:col-span-2 mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {t("customerlist.Update")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-600 dark:text-gray-300"
            >
              {t("customerlist.Cancel")}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default EditCustomerModal;
