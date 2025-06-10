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
// import { useState } from "react";
import SystemMonitor from "./SystemMonitor";
import QuickActions from "./QuickActions";
import StatsCard from "./StatsCard";
import InfoCard from "./InfoCard";

const Dashboard = () => {
  const dashboardData = {
    inventoryStatus: "Good",
    revenue: "Rs. 8,55,875",
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
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-200">
          Pharmacy Dashboard
        </h1>
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
          Overview of pharmacy operations and metrics
        </p>
      </header>

      <SystemMonitor activities={dashboardData.recentActivities} />

      <QuickActions onAction={handleQuickAction} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={ShieldCheckIcon}
          title="Inventory Status"
          value={dashboardData.inventoryStatus}
          bgColor="bg-green-100 dark:bg-green-900"
          textColor="text-green-800 dark:text-green-300"
          borderColor="border-green-300 dark:border-green-700"
        />
        <StatsCard
          icon={CurrencyRupeeIcon}
          title="Revenue · Jan 2022"
          value={dashboardData.revenue}
          bgColor="bg-yellow-100 dark:bg-yellow-900"
          textColor="text-yellow-800 dark:text-yellow-300"
          borderColor="border-yellow-300 dark:border-yellow-700"
        />
        <StatsCard
          icon={ClipboardDocumentListIcon}
          title="Medicines Available"
          value={dashboardData.medicinesAvailable}
          bgColor="bg-blue-100 dark:bg-blue-900"
          textColor="text-blue-500 dark:text-blue-300"
          borderColor="border-blue-300 dark:border-blue-700"
        />
        <StatsCard
          icon={ExclamationTriangleIcon}
          title="Medicine Shortage"
          value={dashboardData.medicineShortage}
          bgColor="bg-red-100 dark:bg-red-900"
          textColor="text-red-800 dark:text-red-300"
          borderColor="border-red-300 dark:border-red-700"
        />
        <StatsCard
          icon={ClockIcon}
          title="Expiring Soon"
          value={dashboardData.expiringSoon}
          bgColor="bg-purple-100 dark:bg-purple-900"
          textColor="text-purple-800 dark:text-purple-300"
          borderColor="border-purple-300 dark:border-purple-700"
        />
        <StatsCard
          icon={BellIcon}
          title="Low Stock Items"
          value={dashboardData.lowStockItems}
          bgColor="bg-orange-100 dark:bg-orange-900"
          textColor="text-orange-800 dark:text-orange-300"
          borderColor="border-orange-300 dark:border-orange-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Cog6ToothIcon}
          title="Medicine"
          content={
            <strong>{dashboardData.totalMedicines} total medicines</strong>
          }
          linkLabel="View"
          linkTo="/listofmedicine"
        />
        <InfoCard
          icon={ShoppingCartIcon}
          title="Sales Report"
          content={<strong>{dashboardData.totalSales} total sales</strong>}
          linkLabel="View"
          linkTo="/salereport"
        />

        <InfoCard
          icon={UserGroupIcon}
          title="Suppliers"
          content={
            <strong>{dashboardData.totalSuppliers} total suppliers</strong>
          }
          linkLabel="View"
          linkTo="/manufacturerlist"
        />
        <InfoCard
          icon={UsersIcon}
          title="Customers"
          content={
            <strong>{dashboardData.totalCustomers} total customers</strong>
          }
          linkLabel="View"
          linkTo="/customerlist"
        />
        <InfoCard
          icon={ClipboardDocumentListIcon}
          title="Prescriptions"
          content={
            <>
              <strong>{dashboardData.pendingPrescriptions}</strong> Pending
              <br />
              <strong>{dashboardData.processedPrescriptions}</strong> Processed
            </>
          }
          linkLabel="View"
          linkTo="/inventory"
        />
      </div>
    </div>
  );
};

export default Dashboard;
