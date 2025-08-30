import React, { useState, useEffect } from "react";

import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  UsersIcon,
  Cog6ToothIcon,
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
import { getAllSupplyItems } from "../api/supplyItemService";
import { getExpiringSoonItems } from "../api/supplyItemService";
import ExpiringSoonList from "./ExpiringSoonList";

const Dashboard = () => {
  const EXCHANGE_RATE = 4000;
  //medicine filters
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);

  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [expiredList, setExpiredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [meta, setMeta] = useState({});
  const [error, setError] = useState(null);
  // const [totalSupplier, setTotalSupplier] = useState(0);
  //customer
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  //filtre low of stock
  const [lowStockCount, setLowStockCount] = useState(0);
  const [stocksData, setStocksData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  //sale track amount
  const [salesData, setSalesData] = useState([]);
  //track product expire
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [alreadyExpired, setAlreadyExpired] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  const dashboardData = {
    inventoryStatus: "Good",
    revenue: "៛34,235,000",
    medicinesAvailable: 298,
    medicineShortage: 1,
    totalMedicines: 298,
    totalSales: 70856,
    totalSuppliers: 4,
    totalCustomers: 845,
    pendingPrescriptions: 12,
    processedPrescriptions: 245,
    expiringSoon: 5,
    lowStockItems: 3,
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
  //get medicine
  const fetchMedicines = async () => {
    try {
      const { data, meta } = await getAllMedicines();
      setMedicines(data);
      setMeta(meta);
    } catch (err) {
      setError("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };
  //get supplier
  const fetchSuppliers = async () => {
    try {
      const response = await getAllSupplier();

      const suppliers = Array.isArray(response.data) ? response.data : [];

      setSuppliers(suppliers);

      const totalSupplier = suppliers.length;
    } catch (err) {
      setError("Failed to fetch supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);
  const totalSupplier = suppliers.reduce(
    (sum, suppliers) => sum + suppliers.id,
    0
  );
  useEffect(() => {
    fetchMedicines();
  }, []);
  const totalSalesInKHR = totalSalesAmount * EXCHANGE_RATE;
  const formattedKHR = totalSalesInKHR.toLocaleString("km-KH");
  //total medicine
  const totalMedicines = medicines.reduce(
    (sum, medicine) => sum + (medicine.id || "N/A"),
    0
  );
  //get customer
  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await getAllCustomer();

      const customersArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setCustomers(customersArray);

      setTotalCustomers(customersArray.length);
    } catch (err) {
      setError(t("customerlist.FetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await getAllStocks();
      const stocks = Array.isArray(res.data) ? res.data : [];

      setStocksData(stocks);

      const lowStock = stocks.filter((item) => (item.quantity || 0) < 50);
      setLowStockData(lowStock);

      setLowStockCount(lowStock.length);
    } catch (error) {}
  };
  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllSale();
        const salesArray = Array.isArray(response)
          ? response
          : response?.data || [];

        const total = salesArray.reduce(
          (sum, sale) => sum + (parseFloat(sale.total_amount) || 0),
          0
        );
        setTotalSalesAmount(total);
      } catch (err) {
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);
  const fetchExpiredMedicines = async () => {
    try {
      const response = await getAllSupplyItems();
      const today = new Date();

      const expiredItems = (
        Array.isArray(response) ? response : response?.data || []
      ).filter((item) => {
        if (!item.expire_date) return false;
        return new Date(item.expire_date) < today;
      });

      setExpiredList(expiredItems);
    } catch (err) {
      setExpiredList([]);
    }
  };
  useEffect(() => {
    fetchExpiredMedicines();
  }, []);
  useEffect(() => {
    const fetchExpiringSoon = async () => {
      try {
        const items = await getAllSupplyItems(); // fetch all supply items

        const today = new Date();
        const next120Days = new Date();
        next120Days.setDate(today.getDate() + 120);

        const expiringSoonItems = items.filter((item) => {
          if (!item.expire_date) return false;
          const expDate = new Date(item.expire_date);
          return expDate >= today && expDate <= next120Days;
        });

        setExpiringSoon(expiringSoonItems.length);
      } catch (err) {}
    };

    fetchExpiringSoon();
  }, []);
  useEffect(() => {
    const fetchExpiringData = async () => {
      try {
        const { expiringSoon, alreadyExpired } = await getExpiringSoonItems();

        setExpiringSoon(expiringSoon); // store the array, not just count
        setAlreadyExpired(alreadyExpired);
      } catch (err) {
        setExpiringSoon([]);
        setAlreadyExpired([]);
      }
    };

    fetchExpiringData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6 mb-12">
      <header className="mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-200">
          {t("dashboard.title")}
        </h1>
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
          {t("dashboard.subtitle")}
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
        <StatsCard
          icon={CurrencyRupeeIcon}
          title={t("dashboard.stats.revenue")}
          value={`$ ${totalSalesAmount.toFixed(2)} | ៛ ${(
            totalSalesAmount * 4000
          ).toLocaleString("km-KH")}`}
          bgColor="bg-yellow-600 dark:bg-yellow-900"
          textColor="text-white dark:text-white"
          borderColor="border-yellow-300 dark:border-yellow-700"
        />
        <StatsCard
          icon={ClipboardDocumentListIcon}
          title={t("dashboard.stats.medicines_available")}
          value={totalMedicines}
          bgColor="bg-blue-600 dark:bg-blue-900"
          textColor="text-white dark:text-white"
          borderColor="border-blue-600 dark:border-blue-700"
        />

        <StatsCard
          icon={ClockIcon}
          title={t("dashboard.stats.expiring_soon")}
          value={expiringSoon}
          bgColor="bg-purple-600 dark:bg-purple-900"
          textColor="text-white dark:text-white"
          borderColor="border-purple-600 dark:border-purple-700"
        />
        <StatsCard
          icon={BellIcon}
          title={t("dashboard.stats.low_stock_items")}
          value={lowStockCount}
          bgColor="bg-orange-600 dark:bg-orange-900"
          textColor="text-white dark:text-white text-lg"
          borderColor="border-orange-600 dark:border-orange-700"
        />
      </div>
      <DashboardStatus />

      <ExpiringSoonList expiringSoonList={expiringSoon} />

      <SystemMonitor activities={dashboardData.recentActivities} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Cog6ToothIcon}
          title={t("dashboard.info.medicine.title", "Medicine")}
          content={
            <strong>
              {t("dashboard.info.medicine.content").replace(
                "{count}",
                totalMedicines
              )}
            </strong>
          }
          linkLabel={t("dashboard.info.medicine.link", "View")}
          linkTo="/listofmedicine"
        />

        <InfoCard
          icon={UserGroupIcon}
          title={t("dashboard.info.suppliers.title")}
          content={
            <strong>
              {t("dashboard.info.suppliers.content").replace(
                "{count}",
                totalSupplier
              )}
            </strong>
          }
          linkLabel={t("dashboard.info.suppliers.link")}
          linkTo="/manufacturerlist"
        />
        <InfoCard
          icon={UsersIcon}
          title={t("dashboard.info.customers.title")}
          content={
            <strong>
              {t("dashboard.info.customers.content").replace(
                "{count}",
                totalCustomers
              )}
            </strong>
          }
          linkLabel={t("dashboard.info.customers.link")}
          linkTo="/customerlist"
        />
        <InfoCard
          icon={ClipboardDocumentListIcon}
          title={t("dashboard.info.prescriptions.title", "Prescriptions")}
          content={
            <>
              <strong>
                {t("dashboard.info.prescriptions.content.pending").replace(
                  "{count}",
                  dashboardData.pendingPrescriptions
                )}
              </strong>
              <br />
              <strong>
                {t("dashboard.info.prescriptions.content.processed").replace(
                  "{count}",
                  dashboardData.processedPrescriptions
                )}
              </strong>
            </>
          }
          linkLabel={t("dashboard.info.prescriptions.link", "View")}
          linkTo="/inventory"
        />
      </div>
    </div>
  );
};

export default Dashboard;
