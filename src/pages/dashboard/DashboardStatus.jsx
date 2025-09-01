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
  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseChartData, setPurchaseChartData] = useState([]);
  const [popularSales, setPopularSales] = useState([]);
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

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getAllStocks();
        const stocks = Array.isArray(response.data) ? response.data : [];
        const mapped = stocks.map((item, idx) => ({
          name: item.medicine?.medicine_name,
          value: item.quantity || item.available_stock || 0,
          color: COLORS[idx % COLORS.length],
        }));

        setStockData(mapped);
      } catch (err) {
        setError("Failed to load stock report");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllSale();
        const salesArray = Array.isArray(response)
          ? response
          : response?.data || [];
        const flattenedSales = salesArray.flatMap(
          (sale) =>
            sale.sale_items?.map((item) => ({
              name: item.medicine_name || "Unknown",
              value: item.quantity || 0,
            })) || []
        );
        const aggregatedSales = Object.values(
          flattenedSales.reduce((acc, curr) => {
            if (!acc[curr.name]) {
              acc[curr.name] = { ...curr };
            } else {
              acc[curr.name].value += curr.value;
            }
            return acc;
          }, {})
        );
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
        const mappedSales = aggregatedSales.map((item, idx) => ({
          ...item,
          color: COLORS[idx % COLORS.length],
        }));

        setSalesData(mappedSales);
      } catch (err) {
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);
  const totalSales = salesData.reduce((sum, item) => sum + item.value, 0);

  const totalStock = stockData.reduce((sum, item) => sum + item.value, 0);

  const attentionRequired = [
    {
      client: "Kaspersky Management Console",
      totalComputers: 9,
      computerStatus: "Critical 1",
      deploymentStatus: "Unmanaged 6",
      protectionStatus: "Unprotected 1",
      databaseStatus: "More than a week ago 2",
    },
  ];
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const supplies = await getAllSupply();
        if (!Array.isArray(supplies)) {
          setPurchaseData([]);
          return;
        }

        const flattened = supplies.flatMap((supply) => {
          if (!supply.supply_items || supply.supply_items.length === 0) {
            return [];
          }

          return supply.supply_items.map((item) => ({
            id: `${supply.id}-${item.id}`,
            supplier: supply.supplier?.company_name || "Unknown Supplier",
            invoice_id: supply.invoice_id || "N/A",
            purchase_date: supply.invoice_date || new Date().toISOString(),
            medicine_name: item.medicine?.medicine_name || "Unknown Medicine",
            quantity: item.supply_quantity || 0,
            unit_price: parseFloat(item.unit_price || 0),
            total_cost:
              (item.supply_quantity || 0) * parseFloat(item.unit_price || 0),
          }));
        });
        setPurchaseData(flattened);
        const aggregated = Object.values(
          flattened.reduce((acc, curr) => {
            const key = curr.medicine_name;
            if (!acc[key]) {
              acc[key] = { name: key, value: 0 };
            }
            acc[key].value += curr.quantity; // or total_cost if you prefer
            return acc;
          }, {})
        );

        const COLORS = [
          "#34d399",
          "#60a5fa",
          "#f87171",
          "#fbbf24",
          "#a78bfa",
          "#f472b6",
          "#38bdf8",
          "#fb923c",
        ];
        const coloredData = aggregated.map((item, idx) => ({
          ...item,
          color: COLORS[idx % COLORS.length],
        }));

        setPurchaseChartData(coloredData);
      } catch (err) {
        setError("Failed to load purchase report");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, []);
  const totalPurchase = purchaseChartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

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
          const medicineName = item.medicine_name || "Unknown Medicine";
          const quantity = item.quantity || 0;
          const totalAmount = quantity * (item.unit_price || 0);

          if (!acc[medicineName]) {
            acc[medicineName] = {
              name: medicineName,
              quantity: 0,
              totalAmount: 0,
            };
          }

          acc[medicineName].quantity += quantity;
          acc[medicineName].totalAmount += totalAmount;

          return acc;
        }, {});

        const sorted = Object.values(aggregated).sort(
          (a, b) => b.quantity - a.quantity
        );

        setPopularSales(sorted.slice(0, 5));
      } catch (error) {}
    };

    fetchPopularSales();
  }, []);

  const renderDonut = (data, centerLabel) => (
    <div className="relative flex justify-center items-center w-full max-w-[250px] mx-auto">
      <ResponsiveContainer width="100%" height={200} className={`z-20 `}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute z-10 bg-transparent   shadow-lg p-3 rounded-lg font-bold text-lg sm:text-xl text-gray-700 dark:text-gray-200">
        {centerLabel}
      </div>
    </div>
  );

  return (
    <div className="p-1 sm:p-0 mb-5 bg-white dark:bg-gray-900 min-h-screen sm:w-full w-[400px]">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Stock */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.StockStatus")}
          </h3>
          {renderDonut(stockData, totalStock)}
          <div className="mt-3 text-sm sm:text-md space-y-2 overflow-y-scroll h-56 dark:shadow-none shadow-lg p-3 rounded-xl shadow-green-100 bg-yellow-50">
            {stockData.map((d, idx) => (
              <div
                key={idx}
                className="flex hover:scale-105 hover:cursor-pointer transition-all justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2 dark:text-slate-600">
                  <span
                    className=" w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span className="dark:text-slate-600">{d.value}</span>
              </div>
            ))}
          </div>
          <div className="m-4 text-center">
            <Link
              to="/stockreport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotostockreport")}
            </Link>
          </div>
        </div>

        {/* Sales */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.SalesStatus")}
          </h3>
          {renderDonut(salesData, totalSales)}
          <div className="mt-3 text-sm sm:text-md space-y-2 overflow-y-scroll h-56 dark:shadow-none shadow-lg p-3 rounded-xl shadow-green-100 bg-yellow-50">
            {salesData.map((d, idx) => (
              <div
                key={idx}
                className="flex hover:scale-105 hover:cursor-pointer transition-all justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2 dark:text-slate-600">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span className="dark:text-slate-600">{d.value}</span>
              </div>
            ))}
          </div>
          <div className="m-4 text-center">
            <Link
              to="/salereport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotosalereport")}
            </Link>
          </div>
        </div>

        {/* Purchase */}
        <div className="z-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("dashboard-status.PurchaseStatus")}
          </h3>
          {renderDonut(purchaseChartData, totalPurchase)}
          <div className="mt-3 text-sm sm:text-md space-y-2  overflow-y-scroll h-56 dark:shadow-none  shadow-lg p-3 rounded-xl shadow-green-100 bg-yellow-50">
            {purchaseChartData.map((d, idx) => (
              <div
                key={idx}
                className="flex hover:scale-105 hover:cursor-pointer transition-all justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2 dark:text-slate-600">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span className="dark:text-slate-600">{d.value}</span>
              </div>
            ))}
          </div>
          <div className="m-4 text-center">
            <Link
              to="/purchasreport"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t("dashboard-status.Gotopurchasereport")}
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 className="px-4 py-3 text-base sm:text-lg font-semibold text-black dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
          {t("dashboard-status.PopularProducts")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center sm:text-md">
            <thead className="bg-green-600 dark:bg-gray-700 text-white dark:text-gray-200">
              <tr>
                <th className="p-3 ">{t("dashboard-status.Medicine")}</th>
                <th className="p-3 ">{t("dashboard-status.QuantitySold")}</th>
                <th className="p-3 ">{t("dashboard-status.TotalAmount")}</th>
              </tr>
            </thead>
            <tbody>
              {popularSales.map((row, idx) => (
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
                    ${row.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatus;
