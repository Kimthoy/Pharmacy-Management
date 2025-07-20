import { Home, ClipboardList, ShoppingCart, Leaf, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineWarehouse } from "react-icons/md";

import { useTranslation } from "../../src/hooks/useTranslation";
const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0  left-0 right-0 z-50 bg-white shadow-inner border-t border-gray-200 flex justify-between items-center px-3 py-2 sm:hidden">
      {/* Home */}
      <div
        className="flex flex-col  items-center text-xs text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <Home size={22} />
        <span>{t("footers.home")}</span>
      </div>

      {/* Clipboard */}
      <div
        className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={() => navigate("/orders")}
      >
        <ClipboardList size={22} />
        <span>{t("footers.orders")}</span>
      </div>

      {/* Shopping Cart - center highlight */}
      <div
        className="flex flex-col items-center -mt-6"
        onClick={() => navigate("/cart")}
      >
        <div className="bg-green-600 text-white p-3 rounded-full shadow-lg">
          <ShoppingCart size={24} />
        </div>
        <span className="text-xs mt-1 text-green-700">
          {t("footers.foryou")}
        </span>
      </div>

      {/* Leaf */}
      <div
        className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={() => navigate("/herbs")}
      >
        <MdOutlineWarehouse size={22} />
        <span>{t("footers.search")}</span>
      </div>

      {/* Flame */}
      <div
        className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={() => navigate("/popular")}
      >
        <AiOutlineProduct size={22} />
        <span>{t("footers.popular")}</span>
      </div>
    </div>
  );
};

export default Footer;
