import { useEffect, useState, useCallback } from "react";
import { getAllStocks } from "../api/stockService";
import { useTranslation } from "../../hooks/useTranslation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import retailStockService from "../api/retailStockService";
import { useNavigate, useLocation } from "react-router-dom";

const AUTO_REFRESH_MS = 0; // set >0 to enable polling

const StockList = () => {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [transferQty, setTransferQty] = useState("");
  const [price, setPrice] = useState(""); // <- price (not price_out)
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const highlightedRetailStock = location.state?.highlightedRetailStock || null;
  const navigate = useNavigate();

  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState(null);

  const itemsPerPage = 7;
  const { t } = useTranslation();

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllStocks();
      setStocksData(res.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to load stocks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    const onFocus = () => fetchStocks();
    const onOnline = () => fetchStocks();
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, [fetchStocks]);

  useEffect(() => {
    if (!AUTO_REFRESH_MS) return;
    const id = setInterval(fetchStocks, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchStocks]);

  const totalStock = stocksData.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalStockLeng = stocksData.length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stocksData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stocksData.length / itemsPerPage);

  const handleOpenTransfer = (stock) => {
    setSelectedStock(stock);
    setTransferQty("");
    setPrice("");
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async () => {
    if (!selectedStock) return;

    const available = Number(selectedStock.quantity || 0);
    const qty = Number(transferQty);
    const p = Number(price);

    if (!qty || qty <= 0)
      return toast.error("Quantity must be greater than 0.");
    if (!Number.isInteger(qty))
      return toast.error("Quantity must be an integer.");
    if (qty > available)
      return toast.error(`Cannot transfer more than available (${available}).`);
    if (Number.isNaN(p) || p < 0)
      return toast.error("Retail price is invalid.");

    try {
      setSubmitting(true);
      await retailStockService.createRetailStock({
        stock_id: selectedStock.id,
        medicine_id: selectedStock.id,
        quantity: qty,
        price: p,
        tablet: selectedStock.medicine?.tablet ?? 0, // ✅ default to 0
        capsule: selectedStock.medicine?.capsule ?? 0, // ✅ default to 0
      });

      // Optimistic UI: decrease the row quantity
      setStocksData((prev) =>
        prev.map((s) =>
          s.id === selectedStock.id
            ? { ...s, quantity: (s.quantity || 0) - qty }
            : s
        )
      );

      toast.success("Retail stock transferred successfully.");
      setTransferModalOpen(false);

      // Hard refresh to be sure
      fetchStocks();
    } catch (err) {
      toast.error(err?.message || "Transfer failed.");
      console.error("Retail transfer failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (highlightedRetailStock) {
      setHighlightedId(highlightedRetailStock);
      const el = document.querySelector(
        `[data-retailstock="${highlightedRetailStock}"]`
      );
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      const timeout = setTimeout(() => setHighlightedId(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [highlightedRetailStock]);

  return (
    <div className="p-4 sm:mb-4 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t("stock-list.title")}</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchStocks}
            disabled={loading}
            className={`px-3 py-2 rounded ${
              loading ? "bg-gray-300" : "bg-blue-600 text-white"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="hidden sm:flex underline text-green-600"
            onClick={() => navigate("/add-supply")}
          >
            {t("stock-list.btnGotoSupply")}
          </button>
        </div>
      </div>

      <div className="bg-green-300 text-gray-600 w-full px-4 py-2 rounded-lg">
        <div>
          {t("stock-list.TotalofStocksquantity")} : {totalStock}
          {t("stock-list.totalofquantity")}
        </div>
        <div>
          {t("stock-list.Typestock")} : {totalStockLeng}
          {t("stock-list.typeoftotal")}
        </div>
      </div>

      <table className="w-full border border-gray-300 rounded overflow-hidden mt-3">
        <thead className="bg-gray-100">
          <tr className="bg-green-600 text-white">
            <th className="px-4 py-3 text-left">{t("stock-list.ID")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.Medicine")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.Qty")}</th>
            <th className="px-4 py-2 text-left">{t("stock-list.PriceIn")}</th>
            <th className="px-4 py-2 text-left">
              {t("stock-list.Action") || "Action"}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((stock) => {
              const isHighlighted = highlightedId === stock.id;
              return (
                <tr
                  key={stock.id}
                  data-retailstock={stock.id}
                  className={`border hover:bg-slate-300 transition duration-300 ${
                    isHighlighted ? "bg-yellow-100 text-black" : ""
                  }`}
                >
                  <td className="px-4 py-2">{stock.id}</td>
                  <td className="px-4 py-2">
                    {stock.medicine?.medicine_name ||
                      stock.medicine?.name ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-3">{stock.quantity}</td>
                  <td className="px-4 py-2">${stock.price_in}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => handleOpenTransfer(stock)}
                    >
                      {t("stock-list.btnMoveToRetail") || "Move to Retail"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-20 text-gray-500">
                {loading ? "Loading..." : t("stock-list.NotFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {stocksData.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            {t("stock-list.btnNext")}
          </button>
        </div>
      )}

      {/* Transfer modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {t("stock-list.modalTitle") || "Transfer Stock to Retail"}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("stock-list.Quantity")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={selectedStock?.quantity}
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() =>
                    setTransferQty(String(selectedStock?.quantity || 0))
                  }
                  className="px-3 py-2 border rounded hover:bg-gray-50"
                  disabled={submitting || (selectedStock?.quantity || 0) <= 0}
                >
                  Max
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t("stock-list.Available") || "Available"}:{" "}
                <b>{selectedStock?.quantity ?? 0}</b>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("stock-list.RetailPrice")}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTransferModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                disabled={submitting}
              >
                {t("stock-list.btnCancel") || "Cancel"}
              </button>
              <button
                onClick={handleTransferSubmit}
                className={`text-white px-4 py-2 rounded ${
                  submitting
                    ? "bg-green-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={submitting}
              >
                {submitting
                  ? t("stock-list.Transferring") || "Transferring..."
                  : t("stock-list.btnConfirmTransfer") || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default StockList;
