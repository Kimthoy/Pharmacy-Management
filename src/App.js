// App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Configuration from "./pages/Configuration";
import MoneyMgt from "./pages/MoneyMgt";
// Import other pages here...

import "./index.css";
import Notifications from "./pages/Notifications";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard"); // Default page is Dashboard

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Inventory":
        return <Inventory />;
      case "Configuration":
        return <Configuration />;
      case "MoneyMgt":
        return <MoneyMgt />;
      case "Notifications":
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 p-4">{renderPage()}</div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
