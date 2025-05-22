import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import axios from "axios";

const RetailSaleModal = ({ isOpen, setIsOpen, products, addToCart }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ product_id: "", qty: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_id) {
      newErrors.product_id = t("retailSale.errorProductRequired");
    }
    if (!formData.qty || formData.qty <= 0) {
      newErrors.qty = t("retailSale.errorQtyInvalid");
    } else {
      const selectedProduct = products.find(
        (p) => p.id === parseInt(formData.product_id)
      );
      if (
        selectedProduct &&
        selectedProduct.qty &&
        formData.qty > selectedProduct.qty
      ) {
        newErrors.qty = t("retailSale.errorQtyExceedsStock");
      }
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const selectedProduct = products.find(
        (p) => p.id === parseInt(formData.product_id)
      );
      if (!selectedProduct) {
        setErrors({ general: t("retailSale.errorProductNotFound") });
        return;
      }
      console.log(
        "Submitting for product_id:",
        formData.product_id,
        "Product:",
        selectedProduct
      );
      // Update supplies table
      const supplyId = selectedProduct.supply_id || formData.product_id; // Fallback to product_id if supply_id not provided
      const response = await axios.patch(`/api/supplies/${supplyId}`, {
        qty: -parseInt(formData.qty),
      });
      console.log("API response:", response.data);
      // Add to cart only if API call succeeds
      addToCart({
        ...selectedProduct,
        quantity: parseInt(formData.qty),
      });
      setFormData({ product_id: "", qty: "" });
      setIsOpen(false);
    } catch (err) {
      console.error("Error updating supplies:", err);
      if (err.response?.status === 404) {
        setErrors({ general: t("retailSale.errorProductNotFound") });
      } else {
        setErrors({ general: t("retailSale.errorSubmit") });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full font-khmer">
        <h2
          className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200"
          aria-label={t("retailSale.title")}
        >
          {t("retailSale.title")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("retailSale.product")}
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200"
              aria-label={t("retailSale.product")}
              required
            >
              <option value="">{t("retailSale.selectProduct")}</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({t("retailSale.price")}: $
                  {product.price.toFixed(2)})
                </option>
              ))}
            </select>
            {errors.product_id && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.product_id}
              </p>
            )}
          </div>
          <div class="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("retailSale.qty")}
            </label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200"
              placeholder={t("retailSale.qtyPlaceholder")}
              aria-label={t("retailSale.qty")}
              required
            />
            {errors.qty && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.qty}
              </p>
            )}
          </div>
          {errors.general && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">
              {errors.general}
            </p>
          )}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ product_id: "", qty: "" });
                setErrors({});
                setIsOpen(false);
              }}
              className="flex-1 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition duration-200"
              aria-label={t("retailSale.cancel")}
            >
              {t("retailSale.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-500 dark:bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label={t("retailSale.submit")}
            >
              {t("retailSale.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RetailSaleModal;
