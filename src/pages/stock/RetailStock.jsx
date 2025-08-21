import React, { useEffect, useState } from "react";
import { getRetailStocks } from "../api/retailStockService";
import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const USE_CENTS = true; // set false if API returns decimal price already

const RetailStockManager = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
  });
  const { t } = useTranslation();
  const perPage = 15;

  const fetchRetailStocks = async (page = 1) => {
    try {
      const res = await getRetailStocks({ page, perPage }); // service maps to { data, meta }
      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta || { current_page: 1, last_page: 1, per_page: perPage });
      setMessage("");
    } catch (err) {
      setRows([]);
      setMessage(err?.message || "Failed to load retail stock data.");
    }
  };

  useEffect(() => {
    fetchRetailStocks(1);
  }, []);

  // Helpers
  const formatNumber = (v) =>
    typeof v === "number" ? new Intl.NumberFormat().format(v) : v;

  const formatPrice = (p) => {
    if (p == null) return "—";
    const num = Number(p);
    if (Number.isNaN(num)) return "—";
    const value = USE_CENTS ? num / 100 : num;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const goToPage = (p) => {
    const last = meta?.last_page || 1;
    if (p >= 1 && p <= last) fetchRetailStocks(p);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("retail-stock.RetailStockManager")}
      </h1>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      <table className="w-full border mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">{t("retail-stock.Medicine")}</th>
            <th className="border p-2">{t("retail-stock.Quantity")}</th>
            <th className="border p-2">{t("retail-stock.Tablet")}</th>
            <th className="border p-2">{t("retail-stock.Capsule")}</th>
            <th className="border p-2">{t("retail-stock.Pricebox")}</th>
            {/* <th className="border p-2">
              {t("retail-stock.UpdatedBy") || "Updated By"}
            </th> */}
            <th className="border p-2">
              {t("retail-stock.UpdatedAt") || "Updated At"}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => {
              // Safely extract fields
              const medicineName =
                item.medicine && typeof item.medicine === "object"
                  ? item.medicine.medicine_name
                  : item.medicine || "Unknown";

              const qty = Number(item.quantity ?? 0);
              const tablet = Number(item.tablet ?? 0);
              const capsule = Number(item.capsule ?? 0);
              const price = item.price;

              const userName =
                item.user && typeof item.user === "object"
                  ? item.user.name
                  : item.user || "—";

              const updatedAt = item.updated_at || "—";

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <Link
                      to="/stocklist"
                      state={{ highlightedRetailStock: item.id }}
                      className="text-blue-600 hover:underline"
                    >
                      {medicineName}
                    </Link>
                  </td>
                  <td className="border p-2">{formatNumber(qty)}</td>
                  <td className="border p-2">{formatNumber(tablet)}</td>
                  <td className="border p-2">{formatNumber(capsule)}</td>
                  <td className="border p-2">{formatPrice(price)}</td>
                  {/* <td className="border p-2">{userName}</td> */}
                  <td className="border p-2">
                    {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                {t("retail-stock.NotFound")} .
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Simple pagination */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => goToPage((meta.current_page || 1) - 1)}
          disabled={(meta.current_page || 1) <= 1}
        >
          {t("retail-stock.Prev")}
        </button>
        <div className="text-sm">
          {t("retail-stock.Page")} {meta.current_page || 1}{" "}
          {t("retail-stock.of") || "of"} {meta.last_page || 1}
        </div>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => goToPage((meta.current_page || 1) + 1)}
          disabled={(meta.current_page || 1) >= (meta.last_page || 1)}
        >
          {t("retail-stock.Next")}
        </button>
      </div>
    </div>
  );
};

export default RetailStockManager;
