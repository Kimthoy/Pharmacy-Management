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

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Configuration = lazy(() => import("./pages/Configuration"));
const MoneyMgt = lazy(() => import("./pages/MoneyMgt"));
const Notifications = lazy(() => import("./pages/Notifications"));
const User = lazy(() => import("./pages/User"));
const Customer = lazy(() => import("./pages/Customer"));
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

  // Simulate a loading delay
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
    // Add a delay on the initial load
    const loadContent = async () => {
      await simulateLoadingDelay(200); // 1-second delay
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
        />

        <div className="flex-1 flex flex-col">
          <TopBar />

          <div className="flex-1 p-4 bg-white">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/money-mgt" element={<MoneyMgt />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/list-of-medicine" element={<ListOfMedicine />} />
                <Route path="/medicine-group" element={<MedicineGroup />} />
                <Route path="/MedicineDetails" element={<MedicineDetails />} />
                <Route path="/User" element={<User />} />
                <Route path="/Customer" element={<Customer />} />
                {/* Redirect any invalid path to Dashboard */}
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
