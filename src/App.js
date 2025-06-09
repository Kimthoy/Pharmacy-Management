import { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";


const SupplierList = lazy(() => import("./pages/supplier/SupplierList"));
const SupplierDetail = lazy(() => import("./pages/supplier/SupplierDetail"));
const Supplies = lazy(() => import("./pages/supplier/Supplies"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Client = lazy(() => import("./pages/auth/Client"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const SaleDashboard = lazy(() => import("./pages/sale/Sale"));
const CustomerList = lazy(() => import("./pages/customer/ListCustomer"));
const InsertCustomer = lazy(() => import("./pages/customer/InsertCustomer"));
const ManufacturerList = lazy(() =>
  import("./pages/manufacturer/ManufacturerList")
);
const AddManu = lazy(() => import("./pages/manufacturer/AddManufacturer"));
const SellReport = lazy(() => import("./pages/report/ReportSell"));
const StockReport = lazy(() => import("./pages/report/ReportStock"));
const PurchaseReport = lazy(() => import("./pages/report/ReportPurchase"));
const ExpensePage = lazy(() => import("./pages/finance/Expense"));
const IncomePage = lazy(() => import("./pages/finance/Income"));
const InvoiceDetailsPage = lazy(() => import("./pages/finance/InvoiceDetail"));
const InvoiceListPage = lazy(() => import("./pages/finance/InvoiceList"));
const AboutUser = lazy(() => import("./pages/profile/AboutUser"));
const Profile = lazy(() => import("./pages/profile/AboutUser"));
const AddMedicine = lazy(() => import("./pages/medicine/AddMedicine"));
const MedicineList = lazy(() => import("./pages/medicine/MedicineList"));
const MedicineDetail = lazy(() => import("./pages/medicine/MedicineDetail"));
const Category = lazy(() => import("./pages/medicine/Category"));
const Setting = lazy(() => import("./pages/setting/Setting"));
const AddWastageReturn = lazy(() => import("./pages/return/AddWastageReturn"));
const AddManufacturerReturn = lazy(() =>
  import("./pages/return/AddManufacturerReturn")
);
const ManufacturerReturnList = lazy(() =>
  import("./pages/return/ManufacturerReturnList")
);
const WastageReturnList = lazy(() =>
  import("./pages/return/WastageReturnList")
);
const StaffList = lazy(() => import("./pages/staff/ManageStaff"));
const ProtectedRoute = ({ children, allowedRoles = ["admin", "cashier"] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const userRole = user?.role?.toLowerCase() || "";
  const isSaleDashboard = location.pathname === "/saledashboard";
  if (userRole === "cashier" && !isSaleDashboard) {
    return <Navigate to="/saledashboard" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate to={userRole === "cashier" ? "/saledashboard" : "/"} replace />
    );
  }

  return children;
};
const AppLayout = ({
  children,
  selectedPage,
  setSelectedPage,
  onLanguageChange,
}) => {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || "";
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 font-khmer">
      {userRole !== "cashier" && (
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      )}
      <div
        className={`flex-1 flex flex-col ${
          userRole === "cashier" ? "w-full" : ""
        }`}
      >
        <TopBar onLanguageChange={onLanguageChange} />
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};
const App = () => {
  const [setLangCode] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );
  const [selectedPage, setSelectedPage] = useState(
    localStorage.getItem("selectedPage") || "Dashboard"
  );
  const [isLoading, setIsLoading] = useState(true);

  const simulateLoadingDelay = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  useEffect(() => {
    const loadContent = async () => {
      await simulateLoadingDelay(200);
      setIsLoading(false);
    };
    loadContent();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPage", selectedPage);
  }, [selectedPage]);

  const handleLanguageChange = (lang) => {
    setLangCode(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/client" element={<Client />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saledashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "cashier"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <SaleDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customerlist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <CustomerList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplierlist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <SupplierList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/suppies"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <Supplies />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/:supplier_id"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <SupplierDetail />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/insertcustomer"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <InsertCustomer />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manufacturerlist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <ManufacturerList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addmanu"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <AddManu />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/salereport"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <SellReport />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/purchasreport"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <PurchaseReport />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stockreport"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <StockReport />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expensepage"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <ExpensePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/incomepage"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <IncomePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoicedetail"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <InvoiceDetailsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoicelist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <InvoiceListPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aboutuser"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <AboutUser />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
              
                <Route
                  path="/addmedicinepage"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <AddMedicine />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listofmedicine"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <MedicineList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/medicinedetail"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <MedicineDetail />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categoies"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <Category />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settingpage"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <Setting />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addwastagereturn"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <AddWastageReturn />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addmanufacturerreturn"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <AddManufacturerReturn />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manufacturerreturnlist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <ManufacturerReturnList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wastagereturnlist"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <WastageReturnList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listofstaff"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AppLayout
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                        onLanguageChange={handleLanguageChange}
                      >
                        <StaffList />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
