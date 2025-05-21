import React, { useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Search, Sun, Moon, Globe } from "lucide-react";

const Client = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  const languageOptions = [
    { value: "en", label: t("client.languages.en"), iconPath: "/icon_en.jpg" },
    { value: "km", label: t("client.languages.km"), iconPath: "/icon_kh.jpg" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    console.log("Searching for:", e.target.value);
  };

  return (
    <section
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white font-khmer"
          : "bg-gray-100 text-gray-900 font-khmer"
      } min-h-screen`}
    >
      {/* Top Bar */}
      <header
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md sticky top-0 z-10`}
      >
        <div className="max-w-7xl font-khmer sticky -z-20 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          {/* Logo and Pharmacy Name */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src="/logo.png"
              width="66px"
              alt={t("client.pharmacyName")}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold ">{t("client.pharmacyName")}</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 font-khmer">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t("client.searchPlaceholder")}
                onChange={handleSearch}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-label={t("client.searchPlaceholder")}
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="hover:text-emerald-500">
              {t("client.nav.products")}
            </div>
            <div className="hover:text-emerald-500 cursor-pointer">
              {t("client.nav.services")}
            </div>
            <div className="hover:text-emerald-500 cursor-pointer">
              {t("client.nav.contact")}
            </div>
            <div className="hover:text-emerald-500 cursor-pointer">
              {t("client.nav.partner")}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={
                theme === "dark" ? t("client.lightMode") : t("client.darkMode")
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center space-x-2 p-2 me-10 rounded-md ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
                aria-label={t("client.selectLanguage")}
              >
                <Globe size={20} />
                <span>
                  {
                    languageOptions.find((lang) => lang.value === language)
                      ?.label
                  }
                </span>
              </button>
              {isLangOpen && (
                <ul
                  className={`absolute  z-20 mt-2 w-32 rounded-md shadow-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } border ${
                    theme === "dark" ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  {languageOptions.map((lang) => (
                    <li
                      key={lang.value}
                      onClick={() => {
                        changeLanguage(lang.value);
                        setIsLangOpen(false);
                      }}
                      className={`flex items-center px-3  py-2 text-sm cursor-pointer ${
                        language === lang.value
                          ? "bg-emerald-100 dark:bg-emerald-700"
                          : "hover:bg-emerald-50 dark:hover:bg-gray-700"
                      } ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <img
                        src={lang.iconPath}
                        alt={lang.label}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      {lang.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-emerald-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("client.hero.title")}
          </h2>
          <p className="text-lg mb-6">{t("client.hero.description")}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t("client.features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`p-6 rounded-lg shadow-md ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } text-center`}
            >
              <h3 className="text-xl font-semibold mb-2">
                {t("client.features.refill.title")}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                {t("client.features.refill.description")}
              </p>
              <Link
                to="/refill"
                className={`px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white`}
              >
                {t("client.features.refill.button")}
              </Link>
            </div>
            <div
              className={`p-6 rounded-lg shadow-md ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } text-center`}
            >
              <h3 className="text-xl font-semibold mb-2">
                {t("client.features.consult.title")}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                {t("client.features.consult.description")}
              </p>
              <Link
                to="/consult"
                className={`px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white`}
              >
                {t("client.features.consult.button")}
              </Link>
            </div>
            <div
              className={`p-6 rounded-lg shadow-md ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } text-center`}
            >
              <h3 className="text-xl font-semibold mb-2">
                {t("client.features.delivery.title")}
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                {t("client.features.delivery.description")}
              </p>
              <Link
                to="/delivery"
                className={`px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white`}
              >
                {t("client.features.delivery.button")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section
        className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} py-16`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t("client.products.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: t("client.products.painRelief"),
                price: "$5.99",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XZ5TagwviNMjOEqJUt9qK4z-NAH2AOyRDg&s",
              },
              {
                id: 2,
                name: t("client.products.vitamins"),
                price: "$12.99",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD9QjN9kEb9Sqm2xIGYj3SyLB2-lilSrFuRQ&s",
              },
              {
                id: 3,
                name: t("client.products.firstAid"),
                price: "$8.49",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XZ5TagwviNMjOEqJUt9qK4z-NAH2AOyRDg&s",
              },
              {
                id: 4,
                name: t("client.products.skincare"),
                price: "$15.99",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XZ5TagwviNMjOEqJUt9qK4z-NAH2AOyRDg&s",
              },
            ].map((product) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg shadow-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {product.price}
                </p>
                <button
                  onClick={() => console.log(`Added ${product.name} to cart`)}
                  className={`mt-4 w-full px-4 py-2 rounded-md ${
                    theme === "dark"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  } text-white`}
                >
                  {t("client.products.addToCart")}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className={`px-6 py-3 rounded-md ${
                theme === "dark"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } text-white font-semibold`}
            >
              {t("client.products.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-gray-900"
        } text-white py-8`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("client.footer.about")}
              </h3>
              <p className="text-gray-400">{t("client.footer.aboutText")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("client.footer.links")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    {t("client.nav.products")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    {t("client.nav.services")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    {t("client.nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("client.footer.contact")}
              </h3>
              <p className="text-gray-400">{t("client.footer.address")}</p>
              <p className="text-gray-400">{t("client.footer.phone")}</p>
              <p className="text-gray-400">{t("client.footer.email")}</p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>{t("client.footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Client;
