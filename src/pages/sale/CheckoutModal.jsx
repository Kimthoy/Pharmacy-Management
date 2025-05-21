import React from "react";

const CheckoutModal = ({
  isOpen,
  setIsOpen,
  totalPrice,
  totalQuantity,
  currency,
  confirmOrder,
}) => {
  if (!isOpen) return null;

  const safeTotalPrice = totalPrice || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4" aria-label="បញ្ជាក់ការបញ្ជាទិញ">
          បញ្ជាក់ការបញ្ជាទិញ
        </h2>
        <p className="mb-2">
          សរុប: {safeTotalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"} (
          {totalQuantity || 0} ផលិតផល)
        </p>
       
        <p className="text-sm text-gray-600">
          ពេលវេលា: 12:44 PM +07, ថ្ងៃអង្គារ, 20 ឧសភា 2025
        </p>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            aria-label="បោះបង់"
          >
            បោះបង់
          </button>
          <button
            onClick={confirmOrder}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            aria-label="បញ្ជាក់ការបញ្ជាទិញ"
          >
            បញ្ជាក់
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
