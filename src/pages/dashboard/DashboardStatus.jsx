import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getAllSale } from "../api/saleService";
import { getAllStocks } from "../api/stockService";
import { getAllSupply } from "../api/suppliesService";
import { useTranslation } from "../../hooks/useTranslation";
import { Link } from "react-router-dom";

const DashboardStatus = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]); // kept for future use
  const [purchaseChartData, setPurchaseChartData] = useState([]);
  const [popularSales, setPopularSales] = useState([]);

  const EXCHANGE_RATE = 4100; // remove if you already define this at a higher level

  const [ppSortBy, setPpSortBy] = useState("quantity"); // "quantity" | "amount"
  const [ppSortDir, setPpSortDir] = useState("desc"); // "asc" | "desc"
  const [ppCurrency, setPpCurrency] = useState("USD"); // "USD" | "KHR"
  const [ppTopN, setPpTopN] = useState(5); // 5 | 10 | 20
  const [ppRange, setPpRange] = useState("all"); // "7d" | "30d" | "90d" | "all"
  const formatAmount = (usd) =>
    ppCurrency === "USD"
      ? `$${Number(usd || 0).toFixed(2)}`
      : `៛${Math.round(Number(usd || 0) * EXCHANGE_RATE).toLocaleString(
          "km-KH"
        )}`;

  // Apply sorting, then limit to Top N
  const processedPopular = Array.isArray(popularSales)
    ? [...popularSales].sort((a, b) => {
        const av =
          ppSortBy === "quantity" ? a.quantity || 0 : a.totalAmount || 0;
        const bv =
          ppSortBy === "quantity" ? b.quantity || 0 : b.totalAmount || 0;
        return ppSortDir === "asc" ? av - bv : bv - av;
      })
    : [];

  const viewPopular = processedPopular.slice(0, ppTopN);

  // Build a localized description line using placeholders
  const descLine = (
    t("dashboard-status.PopularProductsDescLong") ||
    "Showing top {topN} items in {currency} for {range}. Use the options to change sort and filters."
  )
    .replace("{topN}", String(ppTopN))
    .replace(
      "{currency}",
      t(`dashboard-status.Currency.${ppCurrency}`) || ppCurrency
    )
    .replace("{range}", t(`dashboard-status.Range.${ppRange}`) || ppRange);
  const totalQtyVisible = viewPopular.reduce(
    (s, r) => s + (r.quantity || 0),
    0
  );
  const totalAmountVisibleUSD = viewPopular.reduce(
    (s, r) => s + (r.totalAmount || 0),
    0
  );

  const [showDetails, setShowDetails] = useState({
    stock: false,
    sales: false,
    purchase: false,
  });

  const COLORS = [
    "#34d399",
    "#f87171",
    "#fbbf24",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#38bdf8",
    "#fb923c",
  ];

  // --------- helpers ----------
  const pct = (value, total, digits = 1) =>
    total > 0 ? ((value / total) * 100).toFixed(digits) : "0.0";

  const makeTooltip =
    (total) =>
    ({ active, payload }) => {
      if (!active || !payload?.length) return null;
      const item = payload[0]?.payload;
      if (!item) return null;
      const percent = pct(item.value, total);
      return (
        <div className="rounded-md border bg-white px-3 py-2 text-sm shadow">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium">
              {item.name || t("dashboard-status.Unknown") || "Unknown"}
            </span>
          </div>
          <div className="mt-1 text-gray-600">
            {t("dashboard-status.Value") || "Value"}: <b>{item.value}</b>
            {" • "}
            {t("dashboard-status.Percent") || "Percent"}: <b>{percent}%</b>
          </div>
        </div>
      );
    };

  const renderDetailList = (data, total) => {
    if (!data?.length) {
      return (
        <div className="text-sm text-gray-500">
          {t("dashboard-status.NoData") || "No data to display."}
        </div>
      );
    }
    return (
      <div className="mt-3 text-sm space-y-2 max-h-56 overflow-y-auto rounded-xl p-3 bg-yellow-50 shadow-inner">
        {[...data]
          .sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0))
          .map((d, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center hover:scale-[1.01] transition"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: d.color ?? "#CBD5E1" }}
                />
                <span className="text-gray-700">
                  {d.name || t("dashboard-status.Unknown") || "Unknown"}
                </span>
              </span>
              <span className="text-gray-700">
                {d.value}{" "}
                <span className="text-gray-500">• {pct(d.value, total)}%</span>
              </span>
            </div>
          ))}
      </div>
    );
  };

  // --------- data fetchers ----------
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getAllStocks();
        const stocks = Array.isArray(response?.data) ? response.data : [];
        const mapped = stocks.map((item, idx) => ({
          name:
            item.medicine?.medicine_name ||
            t("dashboard-status.Unknown") ||
            "Unknown",
          value: item.quantity || item.available_stock || 0,
          color: COLORS[idx % COLORS.length],
        }));
        setStockData(mapped);
      } catch (err) {
        setError(
          t("dashboard-status.StockError") || "Failed to load stock report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllSale();
        const salesArray = Array.isArray(response)
          ? response
          : response?.data || [];
        const flattenedSales =
          salesArray.flatMap(
            (sale) =>
              sale.sale_items?.map((item) => ({
                name:
                  item.medicine_name ||
                  t("dashboard-status.Unknown") ||
                  "Unknown",
                value: item.quantity || 0,
              })) || []
          ) || [];

        const aggregated = Object.values(
          flattenedSales.reduce((acc, curr) => {
            if (!acc[curr.name]) acc[curr.name] = { ...curr };
            else acc[curr.name].value += curr.value;
            return acc;
          }, {})
        );

        const mappedSales = aggregated.map((item, idx) => ({
          ...item,
          color: COLORS[idx % COLORS.length],
        }));

        setSalesData(mappedSales);
      } catch (err) {
        setError(
          err?.message ||
            t("dashboard-status.SalesError") ||
            "Failed to fetch sales"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const supplies = await getAllSupply();
        if (!Array.isArray(supplies)) {
          setPurchaseData([]);
          setPurchaseChartData([]);
          return;
        }

        const flattened = supplies.flatMap((supply) =>
          (supply.supply_items || []).map((item) => ({
            id: `${supply.id}-${item.id}`,
            supplier:
              supply.supplier?.company_name ||
              t("dashboard-status.UnknownSupplier") ||
              "Unknown Supplier",
            invoice_id: supply.invoice_id || "N/A",
            purchase_date: supply.invoice_date || new Date().toISOString(),
            medicine_name:
              item.medicine?.medicine_name ||
              t("dashboard-status.UnknownMedicine") ||
              "Unknown Medicine",
            quantity: item.supply_quantity || 0,
            unit_price: parseFloat(item.unit_price || 0),
            total_cost:
              (item.supply_quantity || 0) * parseFloat(item.unit_price || 0),
          }))
        );

        setPurchaseData(flattened);

        const aggregated = Object.values(
          flattened.reduce((acc, curr) => {
            const key = curr.medicine_name;
            if (!acc[key]) acc[key] = { name: key, value: 0 };
            acc[key].value += curr.quantity; // or total_cost if you prefer
            return acc;
          }, {})
        );

        const coloredData = aggregated.map((item, idx) => ({
          ...item,
          color: COLORS[idx % COLORS.length],
        }));

        setPurchaseChartData(coloredData);
      } catch (err) {
        setError(
          t("dashboard-status.PurchaseError") ||
            "Failed to load purchase report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchPopularSales = async () => {
      try {
        const response = await getAllSale();
        const salesArray = Array.isArray(response)
          ? response
          : response?.data || [];
        const allSaleItems = salesArray.flatMap(
          (sale) => sale.sale_items || []
        );
        const aggregated = allSaleItems.reduce((acc, item) => {
          const medicineName =
            item.medicine_name ||
            t("dashboard-status.UnknownMedicine") ||
            "Unknown Medicine";
          const quantity = item.quantity || 0;
          const totalAmount = quantity * (item.unit_price || 0);
          if (!acc[medicineName])
            acc[medicineName] = {
              name: medicineName,
              quantity: 0,
              totalAmount: 0,
            };
          acc[medicineName].quantity += quantity;
          acc[medicineName].totalAmount += totalAmount;
          return acc;
        }, {});
        const sorted = Object.values(aggregated).sort(
          (a, b) => b.quantity - a.quantity
        );
        setPopularSales(sorted.slice(0, 5));
      } catch {
        // ignore
      }
    };
    fetchPopularSales();
  }, []);

  const totalSales = salesData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalStock = stockData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalPurchase = purchaseChartData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  // ------- chart renderer with richer tooltip -------
  const renderDonut = (data, total) => (
    <div className="relative flex justify-center items-center w-full max-w-[250px] mx-auto">
      <ResponsiveContainer width="100%" height={200} className="z-20">
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={entry.color || COLORS[idx % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={makeTooltip(total)} />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute z-10 bg-transparent p-3 rounded-lg font-bold text-lg sm:text-xl
                   text-gray-700 dark:text-gray-200"
        aria-label={t("dashboard-status.Total") || "Total"}
        title={t("dashboard-status.Total") || "Total"}
      >
        {total}
      </div>
    </div>
  );

  return (
    <div className="p-1 sm:p-0 mb-5 bg-white dark:bg-gray-900 min-h-screen sm:w-full w-[400px]">
      {error && (
        <div className="mx-1 mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700">
          {error}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Stock */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.StockStatus") || "Stock Status"}
          </h3>
          <p className="mt-1 text-center text-md text-gray-500">
            {t("dashboard-status.StockStatusDesc") ||
              "Distribution of current stock quantity by medicine."}
          </p>

          {renderDonut(stockData, totalStock)}

          {/* Details toggle */}
          <div className="mt-2 flex justify-center">
            <button
              className="text-md px-2 py-1 rounded border dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowDetails((s) => ({ ...s, stock: !s.stock }))}
            >
              {showDetails.stock
                ? t("dashboard-status.HideDetails") || "Hide details"
                : t("dashboard-status.ShowDetails") || "Show details"}
            </button>
          </div>
          {showDetails.stock && renderDetailList(stockData, totalStock)}

          <div className="m-4 text-center">
            <Link
              to="/stockreport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotostockreport") || "Go to stock report"}
            </Link>
          </div>
        </div>

        {/* Sales */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.SalesStatus") || "Sales Status"}
          </h3>
          <p className="mt-1 text-center text-md text-gray-500">
            {t("dashboard-status.SalesStatusDesc") ||
              "Total sold items distribution by medicine."}
          </p>

          {renderDonut(salesData, totalSales)}

          <div className="mt-2 flex justify-center">
            <button
              className="text-md px-2 py-1 rounded border dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowDetails((s) => ({ ...s, sales: !s.sales }))}
            >
              {showDetails.sales
                ? t("dashboard-status.HideDetails") || "Hide details"
                : t("dashboard-status.ShowDetails") || "Show details"}
            </button>
          </div>
          {showDetails.sales && renderDetailList(salesData, totalSales)}

          <div className="m-4 text-center">
            <Link
              to="/salereport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotosalereport") || "Go to sale report"}
            </Link>
          </div>
        </div>

        {/* Purchase */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.PurchaseStatus") || "Purchase Status"}
          </h3>
          <p className="mt-1 text-center text-md text-gray-500">
            {t("dashboard-status.PurchaseStatusDesc") ||
              "Quantity of purchased items by medicine."}
          </p>

          {renderDonut(purchaseChartData, totalPurchase)}

          <div className="mt-2 flex justify-center">
            <button
              className="text-md px-2 py-1 rounded border hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-gray-700"
              onClick={() =>
                setShowDetails((s) => ({ ...s, purchase: !s.purchase }))
              }
            >
              {showDetails.purchase
                ? t("dashboard-status.HideDetails") || "Hide details"
                : t("dashboard-status.ShowDetails") || "Show details"}
            </button>
          </div>
          {showDetails.purchase &&
            renderDetailList(purchaseChartData, totalPurchase)}

          <div className="m-4 text-center">
            <Link
              to="/purchasreport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotopurchasereport") ||
                "Go to purchase report"}
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="px-4 pt-3 text-lg mb-5 sm:text-lg font-semibold text-black dark:text-gray-200">
          {t("dashboard-status.PopularProducts") || "Popular Products"}
        </h3>

        {/* Description + Options */}
        <div className="px-4 pb-3">
          <p className="text-md dark:text-slate-200 text-gray-500 mb-2">
            {descLine}
          </p>

          {/* Options toolbar */}
          <div className="flex flex-wrap items-center gap-2 text-md">
            {/* Sort by */}
            <label className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-slate-200">
                {t("dashboard-status.Options.SortBy") || "Sort by"}
              </span>
              <select
                className="border rounded dark:text-slate-200 px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                value={ppSortBy}
                onChange={(e) => setPpSortBy(e.target.value)}
              >
                <option value="quantity">
                  {t("dashboard-status.Sort.Quantity") || "Quantity sold"}
                </option>
                <option value="amount">
                  {t("dashboard-status.Sort.Amount") || "Total amount"}
                </option>
              </select>
            </label>

            {/* Order */}
            <label className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-slate-200">
                {t("dashboard-status.Options.Order") || "Order"}
              </span>
              <select
                className="border rounded dark:text-slate-200 px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                value={ppSortDir}
                onChange={(e) => setPpSortDir(e.target.value)}
              >
                <option value="desc">
                  {t("dashboard-status.OrderDir.Desc") || "Descending"}
                </option>
                <option value="asc">
                  {t("dashboard-status.OrderDir.Asc") || "Ascending"}
                </option>
              </select>
            </label>

            {/* Currency */}
            <label className="flex items-center gap-1">
              <span className="dark:text-slate-200 text-gray-500">
                {t("dashboard-status.Options.Currency") || "Currency"}
              </span>
              <select
                className="border rounded dark:text-slate-200 px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                value={ppCurrency}
                onChange={(e) => setPpCurrency(e.target.value)}
              >
                <option value="USD">
                  {t("dashboard-status.Currency.USD") || "USD"}
                </option>
                <option value="KHR">
                  {t("dashboard-status.Currency.KHR") || "KHR"}
                </option>
              </select>
            </label>

            {/* Top N */}
            <label className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-slate-200">
                {t("dashboard-status.Options.TopN") || "Top"}
              </span>
              <select
                className="border rounded px-2 py-1 dark:text-slate-200 dark:bg-gray-900 dark:border-gray-700"
                value={ppTopN}
                onChange={(e) => setPpTopN(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>

            {/* Range (UI only unless you wire it to your fetcher) */}
            <label className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-slate-200">
                {t("dashboard-status.Options.Range") || "Range"}
              </span>
              <select
                className="border rounded dark:text-slate-200 px-2 py-1 dark:bg-gray-900 dark:border-gray-700"
                value={ppRange}
                onChange={(e) => setPpRange(e.target.value)}
              >
                <option value="7d">
                  {t("dashboard-status.Range.7d") || "Last 7 days"}
                </option>
                <option value="30d">
                  {t("dashboard-status.Range.30d") || "Last 30 days"}
                </option>
                <option value="90d">
                  {t("dashboard-status.Range.90d") || "Last 90 days"}
                </option>
                <option value="all">
                  {t("dashboard-status.Range.all") || "All time"}
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center sm:text-md">
            <thead className="bg-green-600 dark:bg-gray-700 text-white dark:text-gray-200">
              <tr>
                <th className="p-3">
                  {t("dashboard-status.Medicine") || "Medicine"}
                </th>
                <th className="p-3">
                  {t("dashboard-status.QuantitySold") || "Quantity Sold"}
                </th>
                <th className="p-3">
                  {t("dashboard-status.TotalAmount") || "Total Amount"}
                </th>
              </tr>
            </thead>
            <tbody>
              {viewPopular.length ? (
                viewPopular.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-300 dark:border-gray-700"
                  >
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {row.name}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {row.quantity}
                    </td>
                    <td className="p-3 text-green-500">
                      {formatAmount(row.totalAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-gray-500">
                    {t("dashboard-status.NoPopularData") ||
                      "No sales data available."}
                  </td>
                </tr>
              )}
            </tbody>

            {viewPopular.length > 0 && (
              <tfoot>
                <tr>
                  <td className="p-3 text-right font-semibold dark:text-slate-200">
                    {t("dashboard-status.Total") || "Total"}:
                  </td>
                  <td className="p-3 font-semibold dark:text-slate-200">
                    {totalQtyVisible}
                  </td>
                  <td className="p-3 font-semibold dark:text-slate-200">
                    {formatAmount(totalAmountVisibleUSD)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatus;
