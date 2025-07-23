import { useEffect, useState } from "react";
import { getAllStocks } from "../api/stockService";
import { useTranslation } from "../../hooks/useTranslation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const StockList = () => {
  const navigate = useNavigate();
  const [stocksData, setStocksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { t } = useTranslation();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stocksData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stocksData.length / itemsPerPage);
  const fetchStocks = async () => {
    try {
      const res = await getAllStocks();
      setStocksData(res.data); 
    } catch (error) {
      console.error("Failed to fetch stocks", error);
     
    }
  };
  useEffect(() => {
    fetchStocks();
  }, []);
  return (
    <div className="p-4 sm:mb-4 mb-20">
      <h2 className="text-xl font-bold mb-4">{t("stock-list.title")}</h2>
      <div
        className="sm:hidden flex  flex-col float-end  underline  text-md mb-4 text-green-600  cursor-pointer"
        onClick={() => navigate("/add-supply")}
      >
        <span>{t("stock-list.btnGotoSupply")}</span>
      </div>
      <table className="w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr className="bg-green-600 text-white">
            <th className="px-4 py-3 text-left">{t("stock-list.ID")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.Medicine")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.Qty")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.PriceIn")}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((stock) => (
              <tr
                key={stock.id}
                className="hover:bg-gray-50 even:bg-slate-200  dark:hover:bg-slate-800 border-b border-gray-200"
              >
                <td className="px-4 py-2">{stock.id}</td>
                <td className="px-4 py-2">
                  {stock.medicine?.medicine_name ||
                    stock.medicine?.name ||
                    "N/A"}
                </td>
                <td className="px-4 py-3">{stock.quantity}</td>
                <td className="px-4 py-2">${stock.price_in}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-20 text-gray-500">
                  { t("stock-list.NotFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {stocksData.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            {t("stock-list.btnPrev")}
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 shadow"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            {t("stock-list.btnNext")}
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default StockList;
