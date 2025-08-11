import React, { useEffect, useState } from "react";
import { getRetailStocks } from "../api/retailStockService";
import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
const RetailStockManager = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const { t } = useTranslation();
  const perPage = 15;

  const fetchRetailStocks = async (page = 1) => {
    try {
      const res = await getRetailStocks({ page, perPage });
      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta || { current_page: 1, last_page: 1 });
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
  const getBoxPivot = (units = []) => {
    const box = units?.find(
      (u) => (u?.unit_name || "").toLowerCase() === "box"
    );
    return box?.pivot || null; // { strips_per_box, tablets_per_box, ... }
  };

  const formatNumber = (v) =>
    typeof v === "number" ? new Intl.NumberFormat().format(v) : v;

  const goToPage = (p) => {
    if (p >= 1 && p <= (meta.last_page || 1)) {
      fetchRetailStocks(p);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {" "}
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
            <th className="border p-2"> {t("retail-stock.Medicine")}</th>
            <th className="border p-2"> {t("retail-stock.Category")}</th>
            <th className="border p-2"> {t("retail-stock.Units")}</th>
            <th className="border p-2"> {t("retail-stock.Transferredbox")}</th>
            <th className="border p-2"> {t("retail-stock.Tabletbox")}</th>
            <th className="border p-2"> {t("retail-stock.Capsuletablet")}</th>
            <th className="border p-2"> {t("retail-stock.Capsulebox")}</th>
            <th className="border p-2"> {t("retail-stock.Pricebox")}</th>
            <th className="border p-2"> {t("retail-stock.TransferDate")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => {
              // From RetailStockResource: { medicine, category, units: [...], quantity, price_out, transfer_date, ... }
              const units = item.units || [];
              const boxPivot = getBoxPivot(units); // may be null if no Box unit
              const qty = Number(item.quantity || 0);
              const stripsPerBox = boxPivot?.strips_per_box ?? null;
              const tabletsPerBox = boxPivot?.tablets_per_box ?? null;
              const totalTablets =
                tabletsPerBox != null ? qty * Number(tabletsPerBox) : null;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <Link
                      to="/stocklist"
                      state={{ highlightedRetailStock: item.stock_id }}
                      className="text-blue-500 hover:underline"
                    >
                      {item.medicine || "Unknown"}
                    </Link>
                  </td>
                  <td className="border p-2">
                    {item.category || "No Category"}
                  </td>
                  <td className="border p-2">
                    {units.length
                      ? units.map((u) => u.unit_name).join(" → ")
                      : "No Unit"}
                  </td>
                  <td className="border p-2">{formatNumber(qty)}</td>
                  <td className="border p-2">
                    {stripsPerBox != null ? formatNumber(stripsPerBox) : "N/A"}
                  </td>
                  <td className="border p-2">
                    {tabletsPerBox != null
                      ? formatNumber(tabletsPerBox)
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {totalTablets != null ? formatNumber(totalTablets) : "N/A"}
                  </td>
                  <td className="border p-2">
                    {item.price_out != null
                      ? `$${formatNumber(item.price_out)}`
                      : "—"}
                  </td>
                  <td className="border p-2">{item.transfer_date || "—"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-gray-500 py-4">
                {t("retail-stock.NotFound")} .
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Simple pagination (optional) */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => goToPage((meta.current_page || 1) - 1)}
          disabled={(meta.current_page || 1) <= 1}
        >
          {t("retail-stock.Prev")}
        </button>
        <div className="text-sm">
          {t("retail-stock.Page")} {meta.current_page || 1} of{" "}
          {meta.last_page || 1}
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
