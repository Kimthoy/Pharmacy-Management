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
    <div className="w-full  mb-14 overflow-x-auto">
      <table className="sm:w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
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
        <tbody className="w-full">
          {products.map((medicine) => (
            <tr
              key={medicine.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td
                className="border max-w-[90px] sm:max-w-[200px] border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300  truncate whitespace-nowrap overflow-hidden text-ellipsis"
                title={medicine.name}
              >
                {medicine.name}
              </td>

              <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300 whitespace-nowrap">
                <input
                  type="text"
                  value={formatPriceKHR(medicineInputs[medicine.id]?.price)}
                  onChange={(e) =>
                    handlePriceChange(medicine.id, e.target.value)
                  }
                  className="w-24 p-1 focus:font-semibold text-center border  text-md rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
                  className="w-16 p-1 border focus:font-semibold  text-center  text-md rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  aria-label={`Quantity for ${medicine.name}`}
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2 dark:text-gray-300">
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
              <td className="border border-gray-300 dark:border-gray-600 sm:p-3">
                <button
                  className="bg-blue-600 active:shadow-none transition-all shadow-lg text-white sm:px-4 px-1 hover:shadow-md hover:shadow-slate-500  sm:py-2 py-1 sm:ml-3 ml-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
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
    </div>
  );
};

export default MedicineTable;
