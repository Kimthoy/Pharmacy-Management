import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";

const ProfileDashboard = React.lazy(() =>
  import("./pages/profile/ProfileDashboard")
);

const StandaloneApp = () => {
  const [langCode, setLangCode] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );
  const [selectedPage, setSelectedPage] = useState("ProfileDashboard");

  useEffect(() => {
    const savedPage =
      localStorage.getItem("selectedPage") || "ProfileDashboard";
    setSelectedPage(savedPage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPage", selectedPage);
  }, [selectedPage]);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex h-screen bg-white dark:bg-gray-900 font-khmer">
              {/* <Sidebar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
              /> */}
              <div className="flex-1 flex flex-col">
                {/* <TopBar
                  onLanguageChange={(lang) => {
                    setLangCode(lang);
                    localStorage.setItem("selectedLanguage", lang);
                  }}
                /> */}
                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      <Route
                        path="/profiledashboard"
                        element={<ProfileDashboard />}
                      />
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

export default StandaloneApp;
