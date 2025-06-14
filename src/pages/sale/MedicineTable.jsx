import React, { useState } from "react";

const MedicineTable = ({
  products,
  handleAddToCartClick,
  displayPrice,
  currency = "៛",
}) => {
  // State to track qty and price for each medicine
  const [medicineInputs, setMedicineInputs] = useState(
    products.reduce(
      (acc, medicine) => ({
        ...acc,
        [medicine.id]: { qty: 1, price: medicine.price },
      }),
      {}
    )
  );

  // Handle quantity change
  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1); // Ensure qty is at least 1
    setMedicineInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty },
    }));
  };

  // Handle price change
  const handlePriceChange = (id, value) => {
    const price = Math.max(0, parseFloat(value) || 0); // Ensure price is non-negative
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
      price, // Override default price with user-entered price
    });
    // Optional: Reset inputs after adding to cart
    setMedicineInputs((prev) => ({
      ...prev,
      [medicine.id]: { qty: 1, price: medicine.price },
    }));
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
            ID
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
            Name
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
            Price (៛)
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
            Quantity
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
            Image
          </th>
          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
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
            <td className="border border-gray-300 dark:border-gray-600 p-2">
              {medicine.id}
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2">
              {medicine.name}
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2">
              <input
                type="text"
                step="100" // Use step of 100 for KHR (no decimals typically)
                min="0"
                value={
                  medicineInputs[medicine.id]?.price ||
                  displayPrice(medicine.price)
                }
                onChange={(e) => handlePriceChange(medicine.id, e.target.value)}
                className="w-24 p-1 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
                className="w-16 p-1 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                aria-label={`Quantity for ${medicine.name}`}
              />
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2">
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
                "Invalid Image"
              )}
            </td>

            <td className="border border-gray-300 dark:border-gray-600 p-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
                onClick={() => handleAddToCart(medicine)}
                aria-label={`Add ${medicine.name} to cart`}
              >
                Add to Cart
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicineTable;
