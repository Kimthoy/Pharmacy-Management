import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";

const Sidebar = lazy(() => import("./components/Sidebar"));
const TopBar = lazy(() => import("./components/TopBar"));
const Footer = lazy(() => import("./components/Footer"));

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

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
        />

        <div className="flex-1 flex flex-col">
          <TopBar />

          <div className="flex-1 p-4">
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
                <Route path="/User" element={<User />}></Route>
                <Route path="/Customer" element={<Customer />}></Route>
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
