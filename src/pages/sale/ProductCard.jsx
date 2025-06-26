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
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md p-3 w-full text-center transition cursor-pointer h-full flex flex-col justify-between"
    >
      <div onClick={() => handleAddToCartClick(product)}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) =>
            (e.target.src =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8DwHwAFBQIA/rB/WQAAAABJRU5ErkJggg==")
          }
          className="w-full h-32 sm:h-40 object-contain mb-2 rounded transition-all"
        />

        <h3 className="text-sm font-semibold mb-1 truncate px-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm">
          $ {displayPrice(product.price).toFixed(2)}
        </p>
        <p className="text-gray-500 text-xs">
          ៛ {formatKhmerCurrency(product.price * exchangeRate)}
        </p>
      </div>

      <button className="mt-2 text-sm text-emerald-500 hover:underline">
        តាមដានស្តុក
      </button>
    </motion.div>
  );
};

export default ProductCard;
