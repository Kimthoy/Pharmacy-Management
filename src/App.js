import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Report from "./pages/Report";
import DailyIncome from "./pages/subIcome/DailyIncome";
import MonthlyIncome from "./pages/subIcome/MonthlyIcome";
const Login = lazy(() => import("./pages/auth/Login"));
const CustomerList = lazy(() => import("./pages/customer/ListCustomer"));
const CustomerLedger = lazy(() => import("./pages/customer/CustomerLedger"));
const InsertCustomer = lazy(() => import("./pages/customer/InsertCustomer"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Expense = lazy(() => import("./pages/subIcome/Expense"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Configuration = lazy(() => import("./pages/Configuration"));
const MoneyMgt = lazy(() => import("./pages/MoneyMgt"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ListOfMedicine = lazy(() =>
  import("./pages/subItemInventory/ListOfMedicine")
);
const MedicineGroup = lazy(() =>
  import("./pages/subItemInventory/MedicineGroup")
);
const MedicineDetails = lazy(() =>
  import("./pages/subItemInventory/medicineDetail/MedicineDetails")
);

const App = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  const simulateLoadingDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage") || "Dashboard";
    setSelectedPage(savedPage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPage", selectedPage);
  }, [selectedPage]);

  useEffect(() => {
    const loadContent = async () => {
      await simulateLoadingDelay(200);
      setIsLoading(false);
    };
    loadContent();
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  ) : (
    <Router>
      <div className="flex h-screen bg-slate-100">
        <Sidebar
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
        />

        <div className="flex-1 flex flex-col">
          <TopBar />

          <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/notifications" element={<Notifications />} />

                <Route path="/inventory" element={<Inventory />} />
                <Route path="/list-of-medicine" element={<ListOfMedicine />} />
                <Route path="/medicine-group" element={<MedicineGroup />} />
                <Route path="/MedicineDetails" element={<MedicineDetails />} />
                <Route path="/Report" element={<Report />} />

                <Route path="/expense" element={<Expense />} />
                <Route path="/money-mgt" element={<MoneyMgt />} />
                <Route path="/DailyIncome" element={<DailyIncome />} />
                <Route path="/MonthlyIncome" element={<MonthlyIncome />} />

                <Route path="/customerlist" element={<CustomerList />} />
                <Route path="/customerledger" element={<CustomerLedger />} />
                <Route path="/insertcustomer" element={<InsertCustomer />} />

                <Route path="/login" element={<Login />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>

          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
