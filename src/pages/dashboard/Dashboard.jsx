import React, { useState, useEffect } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  UsersIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

import { getAllCustomer } from "../api/customerService";
import { useTranslation } from "../../hooks/useTranslation";
import SystemMonitor from "./SystemMonitor";
import StatsCard from "./StatsCard";
import InfoCard from "./InfoCard";
import { getAllMedicines } from "../api/medicineService";
import DashboardStatus from "./DashboardStatus";
import { getAllSupplier } from "../api/supplierService";
import { getAllStocks } from "../api/stockService";
import { getAllSale } from "../api/saleService";
import {
  getAllSupplyItems,
  getExpiringSoonItems,
} from "../api/supplyItemService";
import ExpiringSoonList from "./ExpiringSoonList";

// normalize any of: array | {data: array} | {data:{data:array}}
const asArray = (res) =>
  Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
    ? res.data.data
    : [];

const Dashboard = () => {
  const EXCHANGE_RATE = 4000;
  const { t } = useTranslation();

  // stats
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);

  // entities
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliersUpdatedAt, setSuppliersUpdatedAt] = useState(null);
  const [customersUpdatedAt, setCustomersUpdatedAt] = useState(null);

  // stock
  const [lowStockCount, setLowStockCount] = useState(0);

  // expiry
  const [expiringSoon, setExpiringSoon] = useState([]);

  // misc
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dashboardData = {
    recentActivities: [
      {
        id: 1,
        action: "Restocked Paracetamol",
        staff: "John Doe",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Processed Prescription #1234",
        staff: "Jane Smith",
        time: "3 hours ago",
      },
      {
        id: 3,
        action: "Added new supplier",
        staff: "Alice Brown",
        time: "5 hours ago",
      },
    ],
  };

  // --- Fetchers ---
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await getAllMedicines();
      setMedicines(asArray(res));
    } catch {
      setError("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getAllSupplier();
      setSuppliers(asArray(res));
      setSuppliersUpdatedAt(new Date().toISOString());
    } catch {
      setError("Failed to fetch supplier");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getAllCustomer();
      setCustomers(asArray(res));
      setCustomersUpdatedAt(new Date().toISOString());
    } catch {
      setError(t("customerlist.FetchError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await getAllStocks();
      const stocks = asArray(res);
      const lowStock = stocks.filter((item) => (item.quantity || 0) < 50);
      setLowStockCount(lowStock.length);
    } catch {
      // ignore
    }
  };

  const fetchSalesTotal = async () => {
    try {
      setLoading(true);
      const res = await getAllSale();
      const salesArray = asArray(res);
      const total = salesArray.reduce(
        (sum, sale) => sum + (parseFloat(sale.total_amount) || 0),
        0
      );
      setTotalSalesAmount(total);
    } catch (err) {
      setError(err?.message || "Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  // keep the call (preloading) but avoid unused vars/expressions
  const fetchExpiredMedicines = async () => {
    try {
      await getAllSupplyItems();
    } catch {
      // ignore
    }
  };

  const fetchExpiringData = async () => {
    try {
      const { expiringSoon: soon } = await getExpiringSoonItems();
      setExpiringSoon(Array.isArray(soon) ? soon : []);
    } catch {
      setExpiringSoon([]);
    }
  };

  // --- Effects ---
  useEffect(() => {
    fetchSuppliers();
    fetchMedicines();
    fetchCustomers();
    fetchStocks();
    fetchSalesTotal();
    fetchExpiredMedicines();
    fetchExpiringData();
  }, []);

  // --- Derived values ---
  const totalSupplier = suppliers.length;
  const totalCustomers = customers.length;
  const totalMedicines = medicines.length;

  const expiringSoonCountUI = Array.isArray(expiringSoon)
    ? expiringSoon.length
    : Number(expiringSoon || 0);

  const totalSalesInKHR = totalSalesAmount * EXCHANGE_RATE;

  // For InfoCard meta/details
  const topSuppliers = suppliers
    .slice(0, 3)
    .map((s) => s.company_name || s.name || s.supplier_name || "—");

  const newestCustomerName =
    customers?.[customers.length - 1]?.name ||
    customers?.[customers.length - 1]?.customer_name ||
    customers?.[customers.length - 1]?.full_name ||
    "—";

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6 mb-12">
      <header className="mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-200">
          {t("dashboard.title")}
        </h1>
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
          {t("dashboard.subtitle")}
        </p>

        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      </header>

      {/* Top stats */}
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue */}
        <StatsCard
          icon={CurrencyRupeeIcon}
          title={t("dashboard.stats.revenue")}
          subtitle={t("dashboard.topStats.revenue.subtitle")}
          value={`$ ${totalSalesAmount.toFixed(
            2
          )} | ៛ ${totalSalesInKHR.toLocaleString("km-KH")}`}
          valueTooltip={t("dashboard.topStats.revenue.tooltip")}
          bgColor="bg-yellow-600 dark:bg-yellow-900"
          textColor="text-white"
          borderColor="border-yellow-300 dark:border-yellow-700"
          description={t("dashboard.topStats.revenue.description")}
          badge={{ text: t("dashboard.topStats.revenue.badge"), tone: "green" }}
          changePercent={12.4} // replace with a real calc if available
          changeLabel={t("dashboard.topStats.revenue.changeLabel")}
          progress={68} // optional completion metric
          linkLabel={t("dashboard.topStats.revenue.link")}
          linkTo="/salereport"
        />

        {/* Medicines available */}
        <StatsCard
          icon={ClipboardDocumentListIcon}
          title={t("dashboard.stats.medicines_available")}
          subtitle={t("dashboard.topStats.medicines.subtitle")}
          value={totalMedicines}
          bgColor="bg-blue-600 dark:bg-blue-900"
          textColor="text-white"
          borderColor="border-blue-600 dark:border-blue-700"
          description={t("dashboard.topStats.medicines.description")}
          sparklineData={[120, 132, 140, 150, 158, 162, totalMedicines]}
          badge={{
            text: t("dashboard.topStats.medicines.badge"),
            tone: "blue",
          }}
          linkLabel={t("dashboard.topStats.medicines.link")}
          linkTo="/medicinelist"
        />

        {/* Expiring soon */}
        <StatsCard
          icon={ClockIcon}
          title={t("dashboard.stats.expiring_soon")}
          subtitle={t("dashboard.topStats.expiring.subtitle")}
          value={expiringSoonCountUI}
          bgColor="bg-purple-600 dark:bg-purple-900"
          textColor="text-white"
          borderColor="border-purple-600 dark:border-purple-700"
          description={t("dashboard.topStats.expiring.description")}
          sparklineData={[8, 12, 11, 9, 10, 13, expiringSoonCountUI]}
          badge={{
            text: t("dashboard.topStats.expiring.badge"),
            tone: "yellow",
          }}
          linkLabel={t("dashboard.topStats.expiring.link")}
          linkTo="/expiring"
        />

        {/* Low stock items */}
        <StatsCard
          icon={BellIcon}
          title={t("dashboard.stats.low_stock_items")}
          subtitle={t("dashboard.topStats.lowStock.subtitle")}
          value={lowStockCount}
          bgColor="bg-orange-600 dark:bg-orange-900"
          textColor="text-white"
          borderColor="border-orange-600 dark:border-orange-700"
          description={t("dashboard.topStats.lowStock.description")}
          sparklineData={[9, 8, 12, 7, 6, 5, lowStockCount]}
          badge={{ text: t("dashboard.topStats.lowStock.badge"), tone: "red" }}
          linkLabel={t("dashboard.topStats.lowStock.link")}
          linkTo="/stockreport"
        />
      </div>

      <DashboardStatus />

      {/* List of items expiring soon */}
      <ExpiringSoonList
        expiringSoonList={Array.isArray(expiringSoon) ? expiringSoon : []}
      />

      <SystemMonitor activities={dashboardData.recentActivities} />

      {/* Info cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={CiCircleInfo}
          title="Inventory Health"
          subtitle="Today’s snapshot"
          content={
            <span className="text-lg font-semibold">1,284 items in stock</span>
          }
          description="This card summarizes current inventory across all warehouses. Click the link to see the full breakdown by location and batch."
          stats={[
            { label: "Out of stock", value: 6 },
            { label: "Low stock (<10)", value: 24 },
            { label: "SKUs", value: 178 },
          ]}
          meta={[
            { label: "Top category", value: "Antibiotics" },
            { label: "Highest stock", value: "Paracetamol 500mg" },
          ]}
          badge={{ text: "Live", tone: "green" }}
          updatedAt={new Date().toISOString()}
          linkLabel={t("dashboard.info.suppliers.link") || "View all"}
          linkTo="/stockreport"
          footer={<span>Data source: Warehouse DB</span>}
        />

        <InfoCard
          icon={UserGroupIcon}
          title={t("dashboard.info.suppliers.title") || "Suppliers"}
          subtitle={
            t("dashboard.info.suppliers.subtitle") ||
            "Your vendor & manufacturer partners"
          }
          content={
            <strong>
              {(
                t("dashboard.info.suppliers.content") ||
                "Total suppliers: {count}"
              ).replace("{count}", totalSupplier)}
            </strong>
          }
          description={
            t("dashboard.info.suppliers.description") ||
            "Manage contact details, invoices and purchase history. Keep supplier info up to date to streamline procurement."
          }
          meta={[
            {
              label: t("dashboard.info.suppliers.meta.top") || "Top suppliers",
              value: topSuppliers.join(", ") || "—",
            },
          ]}
          badge={{ text: "Live", tone: "green" }}
          updatedAt={suppliersUpdatedAt}
          linkLabel={t("dashboard.info.suppliers.link") || "View all"}
          linkTo="/manufacturerlist"
          footer={
            <div className="flex gap-3">
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/add-supplier"
              >
                {t("dashboard.info.suppliers.quickAdd") || "Add supplier"}
              </Link>
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/purchasreport"
              >
                {t("dashboard.info.suppliers.quickPurchases") ||
                  "Purchase report"}
              </Link>
            </div>
          }
        />

        <InfoCard
          icon={UsersIcon}
          title={t("dashboard.info.customers.title") || "Customers"}
          subtitle={
            t("dashboard.info.customers.subtitle") || "People you serve"
          }
          content={
            <strong>
              {(
                t("dashboard.info.customers.content") ||
                "Total customers: {count}"
              ).replace("{count}", totalCustomers)}
            </strong>
          }
          description={
            t("dashboard.info.customers.description") ||
            "Track your customer base and their orders. Keep records complete to improve service quality."
          }
          meta={[
            {
              label: t("dashboard.info.customers.meta.latest") || "Most recent",
              value: newestCustomerName,
            },
          ]}
          badge={{ text: "Live", tone: "green" }}
          updatedAt={customersUpdatedAt}
          linkLabel={t("dashboard.info.customers.link") || "View all"}
          linkTo="/customerlist"
          footer={
            <div className="flex gap-3">
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/add-customer"
              >
                {t("dashboard.info.customers.quickAdd") || "Add customer"}
              </Link>
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/salereport"
              >
                {t("dashboard.info.customers.quickSales") || "Sales report"}
              </Link>
            </div>
          }
        />

        <InfoCard
          icon={ClipboardDocumentListIcon}
          title={t("dashboard.info.prescriptions.title", "Prescriptions")}
          subtitle={
            t("dashboard.info.prescriptions.subtitle") ||
            "Dispensing workflow status"
          }
          content={
            <>
              <strong>
                {t("dashboard.info.prescriptions.content.pending").replace(
                  "{count}",
                  12
                )}
              </strong>
              <br />
              <strong>
                {t("dashboard.info.prescriptions.content.processed").replace(
                  "{count}",
                  245
                )}
              </strong>
            </>
          }
          description={
            t("dashboard.info.prescriptions.description") ||
            "Monitor pending prescriptions and track processed ones to maintain fast turnaround times."
          }
          linkLabel={t("dashboard.info.suppliers.link") || "View all"}
          linkTo="/inventory"
        />
      </div>
    </div>
  );
};

export default Dashboard;
