// src/App.jsx
import React, { Suspense, lazy, useState, useEffect, useContext } from "react";
import { useLocation, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./context/ThemeContext";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Register from "./pages/auth/Register";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Lazy pages
const ProfileDashboard = lazy(() => import("./pages/profile/ProfileDashboard"));
const SettingPage = lazy(() => import("./pages/setting/SettingsPage"));
const SettingPageForm = lazy(() =>
  import("./pages/setting/SystemSettingsForm")
);
const ExpireSoon = lazy(() => import("./pages/dashboard/ExpiringSoonList"));
const AddSupply = lazy(() => import("./pages/stock/AddSupply"));
const Login = lazy(() => import("./pages/auth/Login"));
const CustomerList = lazy(() => import("./pages/customer/ListCustomer"));
const InsertCustomer = lazy(() => import("./pages/customer/InsertCustomer"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Supplies = lazy(() => import("./pages/manufacturer/Supply"));
const SupplyItems = lazy(() => import("./pages/manufacturer/SupplyItem"));
const SalesReport = lazy(() => import("./pages/sale/SalesReport"));
const SellReport = lazy(() => import("./pages/report/ReportSell"));
const StockReport = lazy(() => import("./pages/report/ReportStock"));
const PurchaseReport = lazy(() => import("./pages/report/ReportPurchase"));
const ExpensePage = lazy(() => import("./pages/finance/Expense"));
const IncomePage = lazy(() => import("./pages/finance/Income"));
const InvoiceDetailsPage = lazy(() => import("./pages/finance/InvoiceDetail"));
const InvoiceListPage = lazy(() => import("./pages/finance/InvoiceList"));
const AboutUser = lazy(() => import("./pages/profile/AboutUser"));
const AddMedicine = lazy(() => import("./pages/medicine/AddMedicine"));
const MedicineList = lazy(() => import("./pages/medicine/MedicineList"));
const Category = lazy(() => import("./pages/medicine/Category"));
const MedicineDetail = lazy(() => import("./pages/medicine/MedicineDetail"));
const AddWastageReturn = lazy(() => import("./pages/return/AddWastageReturn"));
const SaleDashboard = lazy(() => import("./pages/sale/Sale"));
const RetailStock = lazy(() => import("./pages/stock/RetailStock"));
const RetailMedicine = lazy(() => import("./pages/retail/RetailProduct"));
const AddManufacturerReturn = lazy(() =>
  import("./pages/return/AddManufacturerReturn")
);
const ManufacturerList = lazy(() =>
  import("./pages/manufacturer/ManufacturerList")
);
const ManufacturerReturnList = lazy(() =>
  import("./pages/return/ManufacturerReturnList")
);
const WastageReturnList = lazy(() =>
  import("./pages/return/WastageReturnList")
);
const StaffList = lazy(() => import("./pages/staff/ManageStaff"));
const ReturnsTable = lazy(() => import("./pages/return/ReturnsTable"));
const Profile = lazy(() => import("./pages/profile/AboutUser"));
const StockList = lazy(() => import("./pages/stock/StockList"));
const Unit = lazy(() => import("./pages/medicine/Unit"));
const SampleStock = lazy(() => import("./pages/sample/InventoryDashboard"));
const AddStock = lazy(() => import("./pages/sample/InventoryForm"));
const SaleRetail = lazy(() => import("./pages/retail/SaleRetail"));

function RequireAuth() {
  const { token } = useContext(AuthContext);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/" replace /> : children;
}

/** Wrapper rendered INSIDE providers so it can read AuthContext */
function ChromeWrapper({ children, selectedPage, setSelectedPage }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // hide all chrome on these routes (matches your previous behavior)
  const HIDE_CHROME_ROUTES = ["/login", "/register", "/profiledashboard"];
  const hideChrome = HIDE_CHROME_ROUTES.includes(location.pathname);

  // hide ONLY the Sidebar if user is cashier
  const isCashier = user?.role === "cashier";
  const hideSidebar = hideChrome || isCashier;

  return (
    <div className="flex h-screen font-notoserifkhmer bg-white dark:bg-gray-900">
      {!hideSidebar && (
        <Sidebar
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
        />
      )}
      <div className="flex-1 flex-col flex">
        {!hideChrome && (
          <TopBar
            onLanguageChange={(lang) => {
              localStorage.setItem("selectedLanguage", lang);
            }}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
          {children}
        </div>

        {!hideChrome && <Footer />}
        <ToastContainer position="top-left" autoClose={1000} />
      </div>
    </div>
  );
}

const App = () => {
  const location = useLocation();
  const [langCode, setLangCode] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );
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
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <Loader />
    </div>
  ) : (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <ChromeWrapper
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          >
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public */}
                <Route
                  path="/login"
                  element={
                    <PublicOnly>
                      <Login />
                    </PublicOnly>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnly>
                      <Register />
                    </PublicOnly>
                  }
                />

                {/* Protected */}
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<Dashboard langCode={langCode} />} />
                  <Route path="/customerlist" element={<CustomerList />} />
                  <Route path="/insertcustomer" element={<InsertCustomer />} />
                  <Route
                    path="/manufacturerlist"
                    element={<ManufacturerList />}
                  />
                  <Route path="/supplies" element={<Supplies />} />
                  <Route path="/setting-page" element={<SettingPage />} />
                  <Route
                    path="/setting-page-form"
                    element={<SettingPageForm />}
                  />
                  <Route path="/supplyitems" element={<SupplyItems />} />
                  <Route path="/reports" element={<SalesReport />} />
                  <Route path="/salereport" element={<SellReport />} />
                  <Route path="/purchasreport" element={<PurchaseReport />} />
                  <Route path="/stockreport" element={<StockReport />} />
                  <Route path="/expensepage" element={<ExpensePage />} />
                  <Route path="/incomepage" element={<IncomePage />} />
                  <Route path="/stocklist" element={<StockList />} />
                  <Route path="/sale-retail" element={<SaleRetail />} />
                  <Route path="/retail-product" element={<RetailMedicine />} />
                  <Route
                    path="/invoicedetail"
                    element={<InvoiceDetailsPage />}
                  />
                  <Route path="/invoicelist" element={<InvoiceListPage />} />
                  <Route path="/aboutuser" element={<AboutUser />} />
                  <Route
                    path="/addmedicinepage/:id?"
                    element={<AddMedicine />}
                  />
                  <Route path="/listofmedicine" element={<MedicineList />} />
                  <Route path="/returns-table" element={<ReturnsTable />} />
                  <Route
                    path="/medicinedetail/:id"
                    element={<MedicineDetail />}
                  />
                  <Route path="/categoies" element={<Category />} />
                  <Route path="/units" element={<Unit />} />
                  <Route
                    path="/manufacturerreturnlist"
                    element={<ManufacturerReturnList />}
                  />
                  <Route
                    path="/addwastagereturn"
                    element={<AddWastageReturn />}
                  />
                  <Route
                    path="/addmanufacturerreturn"
                    element={<AddManufacturerReturn />}
                  />
                  <Route
                    path="/wastagereturnlist"
                    element={<WastageReturnList />}
                  />
                  <Route path="/listofstaff" element={<StaffList />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/expire-soon" element={<ExpireSoon />} />
                  <Route
                    path="/profiledashboard"
                    element={<ProfileDashboard />}
                  />

                  {/* Your sale page (Sidebar will auto-hide for cashiers) */}
                  <Route path="/saledashboard" element={<SaleDashboard />} />

                  <Route path="/samplestock" element={<SampleStock />} />
                  <Route path="/addstock" element={<AddStock />} />
                  <Route path="/retailstock" element={<RetailStock />} />
                  <Route path="/add-supply" element={<AddSupply />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<AuthAwareRedirect />} />
              </Routes>
            </Suspense>
          </ChromeWrapper>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

function AuthAwareRedirect() {
  const { token } = useContext(AuthContext);
  return <Navigate to={token ? "/" : "/login"} replace />;
}

export default App;
