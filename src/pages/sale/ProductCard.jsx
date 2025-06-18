import { motion } from "framer-motion";

const ProductCard = ({ product, handleAddToCartClick, displayPrice }) => {
  const formatKhmerCurrency = (amount) => {
    return new Intl.NumberFormat("km-KH", {
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const exchangeRate = 4100;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }} // Shrinks slightly when clicked
      whileHover={{ scale: 1.05 }} // Grows slightly on hover
      className="bg-white rounded-lg shadow-lg p-1 w-56 text-center transition cursor-pointer"
    >
      <div onClick={() => handleAddToCartClick(product)}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) =>
            (e.target.src =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8DwHwAFBQIA/rB/WQAAAABJRU5ErkJggg==")
          }
          className="w-full h-40 object-contain mb-2 rounded mx-auto transition-all"
        />

        <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600">
          $ {displayPrice(product.price).toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm">
          ៛ {formatKhmerCurrency(product.price * exchangeRate)}
        </p>
      </div>
      <button className="mb-2 hover:text-md mt-4 text-emerald-500 hover:underline">
        តាមដានស្តុក
      </button>
    </motion.div>
  );
};

export default ProductCard;
