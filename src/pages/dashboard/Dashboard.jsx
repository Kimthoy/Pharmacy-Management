import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "../../hooks/useTranslation";
import SystemMonitor from "./SystemMonitor";
import QuickActions from "./QuickActions";
import StatsCard from "./StatsCard";
import InfoCard from "./InfoCard";

const Dashboard = () => {
  const { t } = useTranslation();

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

  const handleQuickAction = (action) => alert(`Initiated ${action}`);

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

      <SystemMonitor activities={dashboardData.recentActivities} />

      {/* <QuickActions onAction={handleQuickAction} /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
        <StatsCard
          icon={ShieldCheckIcon}
          title={t("dashboard.stats.inventory_status")}
          value={dashboardData.inventoryStatus}
          bgColor="bg-green-600 dark:bg-green-900"
          textColor="text-white dark:text-white"
          borderColor="border-green-300 dark:border-green-700"
        />
        <StatsCard
          icon={CurrencyRupeeIcon}
          title={t("dashboard.stats.revenue")}
          value={dashboardData.revenue}
          bgColor="bg-yellow-600 dark:bg-yellow-900"
          textColor="text-white dark:text-white"
          borderColor="border-yellow-300 dark:border-yellow-700"
        />
        <StatsCard
          icon={ClipboardDocumentListIcon}
          title={t("dashboard.stats.medicines_available")}
          value={dashboardData.medicinesAvailable}
          bgColor="bg-blue-600 dark:bg-blue-900"
          textColor="text-white dark:text-white"
          borderColor="border-blue-600 dark:border-blue-700"
        />
        <StatsCard
          icon={ExclamationTriangleIcon}
          title={t("dashboard.stats.medicine_shortage")}
          value={dashboardData.medicineShortage}
          bgColor="bg-red-500 dark:bg-red-900"
          textColor="text-white dark:text-white"
          borderColor="border-red-300 dark:border-red-700"
        />
        <StatsCard
          icon={ClockIcon}
          title={t("dashboard.stats.expiring_soon")}
          value={dashboardData.expiringSoon}
          bgColor="bg-purple-600 dark:bg-purple-900"
          textColor="text-white dark:text-white"
          borderColor="border-purple-600 dark:border-purple-700"
        />
        <StatsCard
          icon={BellIcon}
          title={t("dashboard.stats.low_stock_items")}
          value={dashboardData.lowStockItems}
          bgColor="bg-orange-600 dark:bg-orange-900"
          textColor="text-white dark:text-white text-lg"
          borderColor="border-orange-600 dark:border-orange-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Cog6ToothIcon}
          title={t("dashboard.info.medicine.title", "Medicine")}
          content={
            <strong>
              {t("dashboard.info.medicine.content").replace(
                "{count}",
                dashboardData.totalMedicines
              )}
            </strong>
          }
          linkLabel={t("dashboard.info.medicine.link", "View")}
          linkTo="/listofmedicine"
        />
        <InfoCard
          icon={ShoppingCartIcon}
          title={t("dashboard.info.sales_report.title")}
          content={
            <strong>
              {t("dashboard.info.sales_report.content").replace(
                "{count}",
                dashboardData.totalSales
              )}
            </strong>
          }
          linkLabel={t("dashboard.info.sales_report.link")}
          linkTo="/salereport"
        />
        <InfoCard
          icon={UserGroupIcon}
          title={t("dashboard.info.suppliers.title")}
          content={
            <strong>
              {t("dashboard.info.suppliers.content").replace(
                "{count}",
                dashboardData.totalSuppliers
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
                dashboardData.totalCustomers
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
