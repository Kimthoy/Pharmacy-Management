import React, { Suspense, lazy, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const ProfileDashboard = lazy(() => import("./pages/profile/ProfileDashboard"));

const ActivityPage = lazy(() => import("./pages/profile/ActivityPage"));
const AddSupply = lazy(() => import("./pages/stock/AddSupply"));

const Login = lazy(() => import("./pages/auth/Login"));
const CustomerList = lazy(() => import("./pages/customer/ListCustomer"));
const InsertCustomer = lazy(() => import("./pages/customer/InsertCustomer"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ManufacturerList = lazy(() =>
  import("./pages/manufacturer/ManufacturerList")
);
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
const Setting = lazy(() => import("./pages/setting/Setting"));
const AddWastageReturn = lazy(() => import("./pages/return/AddWastageReturn"));
const SaleDashboard = lazy(() => import("./pages/sale/Sale"));
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
const Profile = lazy(() => import("./pages/profile/AboutUser"));
const StockList = lazy(() => import("./pages/stock/StockList"));
const MessagePage = lazy(() => import("./pages/setting/Message"));
const NotificationPage = lazy(() => import("./pages/setting/Notification"));
const Unit = lazy(() => import("./pages/medicine/Unit"));
const SampleStock = lazy(() => import("./pages/sample/InventoryDashboard"));
const AddStock = lazy(() => import("./pages/sample/InventoryForm"));
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
    <div className="flex items-center  justify-center  h-screen bg-white dark:bg-gray-900">
      <Loader />
    </div>
  ) : (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <div className="flex font-battambang h-screen  font-notoserifkhmer  bg-white dark:bg-gray-900">
            {location.pathname !== "/profiledashboard" && (
              <Sidebar
                setSelectedPage={setSelectedPage}
                selectedPage={selectedPage}
              />
            )}
            <div className="flex-1  flex-col flex">
              {location.pathname !== "/profiledashboard" && (
                <TopBar
                  onLanguageChange={(lang) => {
                    setLangCode(lang);
                    localStorage.setItem("selectedLanguage", lang);
                  }}
                />
              )}

              <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Dashboard langCode={langCode} />}
                    />
                    <Route path="/customerlist" element={<CustomerList />} />

                    <Route
                      path="/insertcustomer"
                      element={<InsertCustomer />}
                    />
                    <Route
                      path="/manufacturerlist"
                      element={<ManufacturerList />}
                    />
                    <Route path="/supplies" element={<Supplies />} />
                    <Route path="/supplyitems" element={<SupplyItems />} />
                    <Route path="/reports" element={<SalesReport />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/salereport" element={<SellReport />} />
                    <Route path="/purchasreport" element={<PurchaseReport />} />
                    <Route path="/stockreport" element={<StockReport />} />
                    <Route path="/expensepage" element={<ExpensePage />} />
                    <Route path="/incomepage" element={<IncomePage />} />
                    <Route path="/stocklist" element={<StockList />} />
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
                    <Route
                      path="/medicinedetail"
                      element={<MedicineDetail />}
                    />
                    <Route path="/categoies" element={<Category />} />
                    <Route path="/units" element={<Unit />} />
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/message" element={<MessagePage />} />
                    <Route
                      path="/notification"
                      element={<NotificationPage />}
                    />
                    <Route
                      path="/profiledashboard"
                      element={<ProfileDashboard />}
                    />

                    <Route path="/saledashboard" element={<SaleDashboard />} />
                    <Route path="/samplestock" element={<SampleStock />} />
                    <Route path="/addstock" element={<AddStock />} />
                    <Route path="/add-supply" element={<AddSupply />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
