import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";

const API_URL = "http://127.0.0.1:8000/api/login";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      if (response.data.token) {
        const userData = {
          name: response.data.user?.name || "User",
          email: response.data.user?.email || email,
          profile_picture: response.data.user?.profile_picture || "",
          role: response.data.user?.role || "Pharmacist",
          contact: response.data.user?.contact || "",
          join_date:
            response.data.user?.join_date ||
            new Date().toISOString().split("T")[0],
        };
        login(userData, response.data.token);
        alert(t("login.success"));
        window.location.href = "/";
      } else {
        throw new Error(t("login.noToken"));
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      setError(error.response?.data?.message || t("login.invalidCredentials"));
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-md flex flex-col md:flex-row w-full max-w-4xl p-6">
        <div className="flex flex-col justify-center md:w-1/2 p-4 text-center md:text-left">
          <h1 className="font-bold text-2xl md:text-3xl mb-3 font-header text-emerald-500 dark:text-emerald-400">
            {t("login.welcome")} <br /> Panharith Pharmacy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {t("login.description")}
          </p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-4">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-lg font-semibold">
                {t("login.signIn")}
              </p>
            </div>
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                {t("login.email")}
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-200 dark:bg-gray-700 px-4 py-2 mt-2 shadow-md focus:shadow-none rounded-md focus:outline-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                {t("login.password")}
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-200 dark:bg-gray-700 px-4 py-2 mt-2 rounded-md shadow-md focus:shadow-none focus:outline-emerald-500 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 dark:bg-emerald-600 text-white rounded-md shadow-lg active:shadow-none px-6 py-2 hover:bg-emerald-600 dark:hover:bg-emerald-500 transition duration-300"
            >
              {t("login.signIn")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
