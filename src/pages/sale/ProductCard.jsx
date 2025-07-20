import { motion } from "framer-motion";
import { FaRegHeart } from "react-icons/fa"; // Wishlist icon
import { HiMiniShoppingCart } from "react-icons/hi2"; // Add to cart icon

const ProductCard = ({ product, handleAddToCartClick, displayPrice }) => {
  const formatKhmerCurrency = (amount) => {
    return new Intl.NumberFormat("km-KH", {
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const exchangeRate = 4100;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className="relative dark:bg-gray-800 rounded-lg shadow-lg p-3 w-full cursor-pointer h-full flex flex-col justify-between"
    >
      <div onClick={() => handleAddToCartClick(product)}>
        {/* Image Wrapper with hover popup */}
        <div className="relative group">
          <img
            src={product.image}
            alt={product.product_name}
            className="w-full h-32 sm:h-40 object-contain mb-2 rounded transition-all"
          />

          {/* Hover overlay only on the image */}
          <div className="absolute inset-0 bg-black/20 text-white text-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
            Click add to cart
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-md px-4 font-semibold mb-1 truncate text-gray-800 dark:text-white">
          {product.medicine_name}
        </h3>

        {/* Price in USD */}
        <p className="font-semibold text-green-600 px-4 dark:text-gray-300 text-lg">
          $ {displayPrice(product.price || product.price_in || 0).toFixed(2)}
        </p>

        {/* Price in Khmer Riel */}
        <span className="text-gray-400 px-4 dark:text-gray-400 text-md">
          ៛ {formatKhmerCurrency((product.price || 0) * exchangeRate)}
        </span>
      </div>
    </motion.div>
  );
};

export default ProductCard;
