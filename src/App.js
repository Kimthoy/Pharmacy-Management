import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Register from "./pages/auth/Register";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

const Login = lazy(() => import("./pages/auth/Login"));
const CustomerList = lazy(() => import("./pages/customer/ListCustomer"));
const CustomerLedger = lazy(() => import("./pages/customer/CustomerLedger"));
const InsertCustomer = lazy(() => import("./pages/customer/InsertCustomer"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ManufacturerList = lazy(() =>
  import("./pages/manufacturer/ManufacturerList")
);
const AddManu = lazy(() => import("./pages/manufacturer/AddManufacturer"));
const ManuLedger = lazy(() =>
  import("./pages/manufacturer/ManufacturerLedger")
);
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
const MedicineDetail = lazy(() => import("./pages/medicine/MedicineDetail"));
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
const Client = lazy(() => import("./pages/auth/Client"));

const App = () => {
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
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex h-screen bg-white dark:bg-gray-900 font-khmer">
              <Sidebar
                setSelectedPage={setSelectedPage}
                selectedPage={selectedPage}
              />
              <div className="flex-1 flex flex-col">
                <TopBar
                  onLanguageChange={(lang) => {
                    setLangCode(lang);
                    localStorage.setItem("selectedLanguage", lang);
                  }}
                />
                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      <Route
                        path="/"
                        element={<Dashboard langCode={langCode} />}
                      />
                      <Route path="/customerlist" element={<CustomerList />} />
                      <Route
                        path="/customerledger"
                        element={<CustomerLedger />}
                      />
                      <Route
                        path="/insertcustomer"
                        element={<InsertCustomer />}
                      />
                      <Route
                        path="/manufacturerlist"
                        element={<ManufacturerList />}
                      />
                      <Route path="/addmanu" element={<AddManu />} />
                      <Route path="/manuledger" element={<ManuLedger />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/salereport" element={<SellReport />} />
                      <Route
                        path="/purchasreport"
                        element={<PurchaseReport />}
                      />
                      <Route path="/stockreport" element={<StockReport />} />
                      <Route path="/expensepage" element={<ExpensePage />} />
                      <Route path="/incomepage" element={<IncomePage />} />
                      <Route
                        path="/invoicedetail"
                        element={<InvoiceDetailsPage />}
                      />
                      <Route
                        path="/invoicelist"
                        element={<InvoiceListPage />}
                      />
                      <Route path="/aboutuser" element={<AboutUser />} />
                      <Route
                        path="/addmedicinepage"
                        element={<AddMedicine />}
                      />
                      <Route
                        path="/listofmedicine"
                        element={<MedicineList />}
                      />
                      <Route
                        path="/medicinedetail"
                        element={<MedicineDetail />}
                      />
                      <Route path="/settingpage" element={<Setting />} />
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
                      <Route path="/client" element={<Client />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
              </div>
            </div>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
