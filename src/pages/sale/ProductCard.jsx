const ProductCard = ({ product, handleAddToCartClick, displayPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-1 w-56 text-center transition">
      <img
        src={product.image}
        alt={product.name}
        onClick={() => handleAddToCartClick(product)}
        onError={(e) =>
          (e.target.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8DwHwAFBQIA/rB/WQAAAABJRU5ErkJggg==")
        }
        className="w-full hover:scale-105 h-40 object-contain mb-2 rounded mx-auto cursor-pointer transition-all "
      />
      <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">
        {displayPrice(product.price).toFixed(2)} $
      </p>
      <button className="mb-2 text-emerald-500 hover:underline">
        តាមដានស្តុក​{" "}
      </button>
    </div>
  );
};

export default ProductCard;
