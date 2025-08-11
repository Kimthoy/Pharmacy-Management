import { useState } from "react";
import axios from "axios";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
const Register = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    is_active: false,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t("register.errors.nameRequired");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("register.errors.invalidEmail");
    }
    if (formData.password.length < 6) {
      newErrors.password = t("register.errors.passwordTooShort");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.passwordsDoNotMatch");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("register.errors.phoneRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      toast.error(t("register.errors.general")); // optional
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
        is_active: formData.is_active,
      });

      setSuccessMessage(t("register.success"));
      toast.success(t("register.success"));

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        is_active: false,
      });
    } catch (error) {
      const msg = error.response?.data?.message || t("register.errors.general");
      setErrors({ general: msg });
      toast.error(msg);
    }
  };

  return (
    <section
      className={`flex justify-center items-center sm:mb-14   min-h-screen font-khmer ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } px-4`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md rounded-md flex flex-col md:flex-row w-full max-w-4xl p-6`}
      >
        <div className="flex flex-col justify-center md:w-1/2 p-4 text-center md:text-left">
          <h1
            className={`font-bold text-2xl md:text-3xl mb-3 font-header ${
              theme === "dark" ? "text-emerald-400" : "text-green-500"
            }`}
          >
            {t("register.Welcomes")} <br /> Panharith Pharmacy
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } text-sm md:text-base`}
          >
            {t("register.Pleaseenter")}
          </p>
        </div>

        <div className="flex flex-col justify-center md:w-1/2 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p
              className={`${
                theme === "dark" ? "text-emerald-400" : "text-green-600"
              } text-lg font-semibold`}
            >
              {t("register.signUp")}
            </p>

            {successMessage && (
              <p
                className={`${
                  theme === "dark" ? "text-emerald-300" : "text-green-600"
                } text-sm`}
                role="alert"
              >
                {successMessage}
              </p>
            )}
            {errors.general && (
              <p
                className={`${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                } text-sm`}
                role="alert"
              >
                {errors.general}
              </p>
            )}

            <div>
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.name")}
              </label>
              <input
                type="text"
                name="name"
                required
                autoComplete="off"
                placeholder={t("register.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-200 text-gray-900"
                } px-4 py-2 mt-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } text-xs mt-1`}
                  id="name-error"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.email")}
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                placeholder={t("register.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-200 text-gray-900"
                } px-4 py-2 mt-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } text-xs mt-1`}
                  id="email-error"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.phone")}
              </label>
              <input
                type="text"
                name="phone"
                required
                autoComplete="off"
                placeholder={t("register.phonePlaceholder")}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-200 text-gray-900"
                } px-4 py-2 mt-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } text-xs mt-1`}
                  id="phone-error"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.password")}
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder={t("register.passwordPlaceholder")}
                value={formData.password}
                onChange={handleChange}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-200 text-gray-900"
                } px-4 py-2 mt-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password && (
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } text-xs mt-1`}
                  id="password-error"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder={t("register.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-200 text-gray-900"
                } px-4 py-2 mt-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
              />
              {errors.confirmPassword && (
                <p
                  className={`${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  } text-xs mt-1`}
                  id="confirmPassword-error"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <label
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("register.activeAccount")}
              </label>
            </div>

            <button
              type="submit"
              className={`w-full ${
                theme === "dark"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-green-500 hover:bg-green-600"
              } text-white rounded-md shadow-lg px-6 py-2 transition duration-300`}
            >
              {t("register.signUp")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
