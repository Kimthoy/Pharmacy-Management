// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Corrected path

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 font-khmer">
      <h1 className="text-3xl font-bold mb-4">
        សូមស្វាគមន៍មកកាន់ប្រព័ន្ធឱសថស្ថាន
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        ពេលវេលា: {new Date().toLocaleTimeString("en-US", { hour12: true })} +07,
        ថ្ងៃពុធ, 21 ឧសភា 2025
      </p>
      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/saledashboard"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            ចូលទៅទំព័រអ្នកគិតលុយ
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            ចាកចេញ
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          ចូលគណនី
        </Link>
      )}
    </div>
  );
};

export default HomePage;
