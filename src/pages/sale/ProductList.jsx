import React from "react";
import ProductCard from "./ProductCard";
import MedicineTable from "./MedicineTable"; // Import the MedicineTable component

const ProductList = ({
  products,
  cart,
  handleAddToCartClick,
  displayPrice,
  currency,
  showCompoundMedicines,
}) => {
  const safeProducts = products || [];

  return (
    <div className="flex flex-1 flex-col justify-center gap-2">
      {showCompoundMedicines ? (
        <MedicineTable
          products={safeProducts}
          handleAddToCartClick={handleAddToCartClick}
          displayPrice={displayPrice}
          currency={currency}
        />
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {safeProducts.map((product) => (
            <ProductCard
              key={product.id}
              cart={cart}
              product={product}
              handleAddToCartClick={handleAddToCartClick}
              displayPrice={displayPrice}
              currency={currency}
              showCompoundMedicines={showCompoundMedicines}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
