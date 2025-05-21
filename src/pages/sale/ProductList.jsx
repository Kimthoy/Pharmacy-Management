import React from "react";
import ProductCard from "./ProductCard";

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
    <div className="flex flex-1 flex-wrap justify-center gap-2">
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
  );
};

export default ProductList;
