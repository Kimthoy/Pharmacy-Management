import React, { useState } from "react";

// Utility to format number to Khmer-style price with commas
const formatPriceKHR = (num) => {
  if (num == null) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Utility to parse formatted price string back to number
const parsePriceKHR = (str) => {
  if (!str) return 0;
  // Remove commas and parse float
  return parseFloat(str.replace(/,/g, "")) || 0;
};

const MedicineTable = ({ products, handleAddToCartClick, currency = "៛" }) => {
  // State to track qty and price for each medicine (price stored as number)
  const [medicineInputs, setMedicineInputs] = useState(
    products.reduce(
      (acc, medicine) => ({
        ...acc,
        [medicine.id]: { qty: 1, price: medicine.price },
      }),
      {}
    )
  );

  // Handle quantity change (same as before)
  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setMedicineInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty },
    }));
  };

  // Handle price change with Khmer price formatting logic
  const handlePriceChange = (id, value) => {
    // Remove all characters except digits and commas (user may type commas)
    const cleanedValue = value.replace(/[^\d,]/g, "");
    const price = parsePriceKHR(cleanedValue); // parse string to number

    setMedicineInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], price },
    }));
  };

  // Handle Add to Cart with custom qty and price
  const handleAddToCart = (medicine) => {
    const { qty, price } = medicineInputs[medicine.id];
    handleAddToCartClick({
      ...medicine,
      quantity: qty,
      price, // send numeric price
      currency: "KHR", // added for conversion handling
    });
    // Reset inputs after adding to cart
    setMedicineInputs((prev) => ({
      ...prev,
      [medicine.id]: { qty: 1, price: medicine.price },
    }));
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            ID
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            Name
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            Price ({currency})
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            Quantity
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            Image
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left dark:text-gray-300">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((medicine) => (
          <tr
            key={medicine.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300">
              {medicine.id}
            </td>
            <td className="border  border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300">
              {medicine.name}
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300">
              <input
                type="text"
                value={formatPriceKHR(medicineInputs[medicine.id]?.price)}
                onChange={(e) => handlePriceChange(medicine.id, e.target.value)}
                className="w-24 p-1 focus:font-semibold text-center border focus:w-28 focus:h-12 text-md rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                aria-label={`Price for ${medicine.name} in KHR`}
              />
              <span className="ml-2">{currency}</span>
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2">
              <input
                type="number"
                min="1"
                value={medicineInputs[medicine.id]?.qty || 1}
                onChange={(e) => handleQtyChange(medicine.id, e.target.value)}
                className="w-16 p-1 border focus:font-semibold focus:w-28 text-center focus:h-12 text-md rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                aria-label={`Quantity for ${medicine.name}`}
              />
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300 ">
              {medicine.image.startsWith("http") ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-12 h-auto"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/50")
                  }
                />
              ) : (
                "No Image"
              )}
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2">
              <button
                className="bg-blue-600 active:shadow-none transition-all text-white px-4 hover:shadow-md hover:shadow-slate-500 shadow py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
                onClick={() => handleAddToCart(medicine)}
                aria-label={`Add ${medicine.name} to cart`}
              >
                បន្ថែម
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicineTable;
