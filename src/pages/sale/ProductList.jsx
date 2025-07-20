import React from "react";
import ProductCard from "./ProductCard";
import MedicineTable from "./MedicineTable"; // Import the MedicineTable component

const ProductList = ({
  products,

  handleAddToCartClick,
  displayPrice,
  currency,
  showCompoundMedicines,
}) => {
  const safeProducts = products || [];

  return (
    <div className="flex flex-1 flex-col justify-center ">
      {safeProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : showCompoundMedicines ? (
        <MedicineTable
          products={safeProducts}
          handleAddToCartClick={handleAddToCartClick}
          displayPrice={displayPrice}
          currency={currency}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full mb-24">
          {safeProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleAddToCartClick={handleAddToCartClick}
              displayPrice={displayPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
