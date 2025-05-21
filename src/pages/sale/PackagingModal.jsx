import React from "react";

const PackagingModal = ({
  isOpen,
  setIsOpen,
  product,
  selectedPackaging,
  setSelectedPackaging,
  handleAddToCartWithPackaging,
  quantities,
  setQuantities,
  setToast,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4" aria-label="ជ្រើសរើសកញ្ចប់">
          ជ្រើសរើសកញ្ចប់សម្រាប់ {product.name}
        </h2>
        <select
          value={selectedPackaging}
          onChange={(e) => setSelectedPackaging(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="ជ្រើសរើសកញ្ចប់"
        >
          <option value="Box">Box</option>
          <option value="Bottle">Bottle</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
            aria-label="បោះបង់"
          >
            បោះបង់
          </button>
          <button
            onClick={() => {
              handleAddToCartWithPackaging(product, selectedPackaging);
              setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
            }}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            aria-label="បន្ថែមទៅកន្ត្រក"
          >
            បន្ថែម
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagingModal;
