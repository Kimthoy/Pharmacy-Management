import React, { useState } from "react";
import ProductCard from "./ProductCard";
import MedicineTable from "./MedicineTable";

const ProductList = ({
  products,

  handleAddToCartClick,
  displayPrice,
  currency,
  showCompoundMedicines,
  closeCart,
  forceHideCart,
}) => {
  const safeProducts = products || [];
  const [editing, setEditing] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isCartOpen, setisCartOpen] = useState(false);
  return (
    <div className="flex flex-1 flex-col sm:w-full w-[300]  justify-center ">
      {safeProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : showCompoundMedicines ? (
        <MedicineTable
          products={safeProducts}
          handleAddToCartClick={handleAddToCartClick}
          displayPrice={displayPrice}
          currency={currency}
          onEdit={(pkg) => setEditing(pkg)}
          closeCart={() => setCartOpen(false)}
          isOpen={isCartOpen}
          // setIsOpen={setCartOpen}
          setIsOpen={closeCart} // alias ok
          setForceHideCart={forceHideCart} // alias ok
        />
      ) : (
        <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 gap-4 w-full mb-12">
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
