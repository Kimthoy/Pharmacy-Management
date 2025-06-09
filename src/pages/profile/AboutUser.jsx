import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { FaEdit, FaSave, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";

const USER_DATA = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Pharmacist",
  contact: "+1234567890",
  join_date: "2023-01-15",
  profile_picture: "user_icon.png",
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "+1234567891",
  relationshipStatus: "Married",
  description: "Experienced pharmacist with a passion for patient care.",
};

const AboutUser = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentPage, setCurrentPage] = useState("home");
  const [randomContent, setRandomContent] = useState("");

  const [formData, setFormData] = useState({
    name: USER_DATA.name,
    email: USER_DATA.email,
    contact: USER_DATA.contact,
    emergencyContactName: USER_DATA.emergencyContactName,
    emergencyContactPhone: USER_DATA.emergencyContactPhone,
    relationshipStatus: USER_DATA.relationshipStatus,
    description: USER_DATA.description,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const relatedContent = {
    home: [
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.home")}</h2>
        <p className="text-gray-400 text-xs">
          {t("profile.welcomeMessage", { name: USER_DATA.name })}
        </p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.home")}</h2>
        <p className="text-gray-400 text-xs">
          {t("profile.roleInfo", { role: USER_DATA.role })}
        </p>
      </div>,
    ],
    paymentMethods: [
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.paymentMethods")}
        </h2>
        <p className="text-gray-400 text-xs">{t("profile.noPaymentMethods")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.paymentMethods")}
        </h2>
        <p className="text-gray-400 text-xs">{t("profile.addPaymentMethod")}</p>
      </div>,
    ],
    passwords: [
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.passwords")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.passwordsSecure")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.passwords")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.checkCompromised")}</p>
      </div>,
    ],
    personalInfo: [
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.personalInfo")}
        </h2>
        <p className="text-gray-400 text-xs">
          {t("profile.emailInfo", { email: USER_DATA.email })}
        </p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.personalInfo")}
        </h2>
        <p className="text-gray-400 text-xs">
          {t("profile.contactInfo", { contact: USER_DATA.contact })}
        </p>
      </div>,
    ],
    showMore: [
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.showMore")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.exploreFeatures")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.showMore")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.advancedSettings")}</p>
      </div>,
    ],
    shoppingDeals: [
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.shoppingDeals")}
        </h2>
        <p className="text-gray-400 text-xs">{t("profile.noDeals")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.shoppingDeals")}
        </h2>
        <p className="text-gray-400 text-xs">{t("profile.latestOffers")}</p>
      </div>,
    ],
    donation: [
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.donation")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.supportCause")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.donation")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.noDonations")}</p>
      </div>,
    ],
    security: [
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.security")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.twoFactorEnabled")}</p>
      </div>,
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("profile.security")}</h2>
        <p className="text-gray-400 text-xs">{t("profile.reviewSecurity")}</p>
      </div>,
    ],
    settings: [],
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsEditing(false);
    setActiveStep(0);
    if (page !== "settings" && relatedContent[page].length > 0) {
      const randomIndex = Math.floor(
        Math.random() * relatedContent[page].length
      );
      setRandomContent(relatedContent[page][randomIndex]);
    } else {
      setRandomContent("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("profile.nameRequired");
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = t("profile.invalidEmail");
    if (!formData.contact.match(/^\+?\d{10,12}$/))
      newErrors.contact = t("profile.invalidContact");
    if (formData.emergencyContactName && !formData.emergencyContactName.trim())
      newErrors.emergencyContactName = t(
        "profile.emergencyContactNameRequired"
      );
    if (
      formData.emergencyContactPhone &&
      !formData.emergencyContactPhone.match(/^\+?\d{10,12}$/)
    )
      newErrors.emergencyContactPhone = t(
        "profile.invalidEmergencyContactPhone"
      );
    if (
      formData.relationshipStatus &&
      !["Single", "Married", "Other"].includes(formData.relationshipStatus)
    )
      newErrors.relationshipStatus = t("profile.invalidRelationshipStatus");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      USER_DATA.name = formData.name;
      USER_DATA.email = formData.email;
      USER_DATA.contact = formData.contact;
      USER_DATA.emergencyContactName = formData.emergencyContactName;
      USER_DATA.emergencyContactPhone = formData.emergencyContactPhone;
      USER_DATA.relationshipStatus = formData.relationshipStatus;
      USER_DATA.description = formData.description;
      setIsEditing(false);
      setActiveStep(0);
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    setFormData({
      name: USER_DATA.name,
      email: USER_DATA.email,
      contact: USER_DATA.contact,
      emergencyContactName: USER_DATA.emergencyContactName,
      emergencyContactPhone: USER_DATA.emergencyContactPhone,
      relationshipStatus: USER_DATA.relationshipStatus,
      description: USER_DATA.description,
    });
    setErrors({});
    setIsEditing(false);
    setActiveStep(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const steps = [
    {
      label: t("profile.steps.basicInfo"),
      content: (
        <>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.namePlaceholder")}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.emailPlaceholder")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </>
      ),
    },
    {
      label: t("profile.steps.contactInfo"),
      content: (
        <>
          <div>
            <label
              htmlFor="contact"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.contact")}
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.contactPlaceholder")}
              disabled={loading}
            />
            {errors.contact && (
              <p className="text-red-400 text-xs mt-1">{errors.contact}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="emergencyContactName"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.emergencyContactName")}
            </label>
            <input
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.emergencyContactNamePlaceholder")}
              disabled={loading}
            />
            {errors.emergencyContactName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.emergencyContactName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="emergencyContactPhone"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.emergencyContactPhone")}
            </label>
            <input
              type="text"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.emergencyContactPhonePlaceholder")}
              disabled={loading}
            />
            {errors.emergencyContactPhone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.emergencyContactPhone}
              </p>
            )}
          </div>
        </>
      ),
    },
    {
      label: t("profile.steps.additionalInfo"),
      content: (
        <>
          <div>
            <label
              htmlFor="relationshipStatus"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.relationshipStatus")}
            </label>
            <select
              id="relationshipStatus"
              name="relationshipStatus"
              value={formData.relationshipStatus}
              onChange={handleInputChange}
              className={`w-full border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              disabled={loading}
            >
              <option value="">
                {t("profile.relationshipStatusPlaceholder")}
              </option>
              <option value="Single">
                {t("profile.relationshipStatusOptions.single")}
              </option>
              <option value="Married">
                {t("profile.relationshipStatusOptions.married")}
              </option>
              <option value="Other">
                {t("profile.relationshipStatusOptions.other")}
              </option>
            </select>
            {errors.relationshipStatus && (
              <p className="text-red-400 text-xs mt-1">
                {errors.relationshipStatus}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 dark:text-gray-400 font-medium text-xs mb-1"
            >
              {t("profile.description")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full h-24 border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              placeholder={t("profile.descriptionPlaceholder")}
              disabled={loading}
            ></textarea>
          </div>
        </>
      ),
    },
  ];

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } text-${theme === "dark" ? "white" : "black"}`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-200"
        } p-4`}
      >
        <ul className="space-y-2">
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("home")}
              className="mr-2 flex justify-center align-middle"
            >
              <RiProfileFill className="w-4 h-4 me-3" />
              {t("profile.home")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("paymentMethods")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">💳</span>
              {t("profile.paymentMethods")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("passwords")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">🔑</span>
              {t("profile.passwords")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("personalInfo")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">ℹ️</span>
              {t("profile.personalInfo")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("showMore")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">▶️</span>
              {t("profile.showMore")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("shoppingDeals")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">🛒</span>
              {t("profile.shoppingDeals")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("donation")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">❤️</span>
              {t("profile.donation")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("security")}
              className="mr-2 flex justify-center align-middle"
            >
              <MdSecurity className="w-4 h-4 me-3" />
              {t("profile.security")}
            </button>
          </li>
          <li
            className={`flex items-center p-2 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
            } rounded`}
          >
            <button
              onClick={() => handlePageChange("settings")}
              className="mr-2 flex justify-center align-middle"
            >
              <span className="mr-2">⚙️</span>
              {t("profile.settings")}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {t(`profile.${currentPage}`)}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`text-xs ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } px-3 py-2 rounded ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              } transition`}
              aria-label={
                theme === "light"
                  ? t("profile.switchToDark")
                  : t("profile.switchToLight")
              }
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>

        {currentPage === "settings" ? (
          !isEditing ? (
            <div
              className={`bg-${
                theme === "dark" ? "gray-800" : "white"
              } p-6 rounded-lg shadow-lg`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={USER_DATA.profile_picture}
                    alt={t("profile.profilePictureAlt")}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.name")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.name}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.email")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.email}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.role")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.role}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.contact")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.contact}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.joinDate")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.join_date}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.emergencyContactName")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.emergencyContactName || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.emergencyContactPhone")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.emergencyContactPhone || "-"}
                      </p>
                    </div>
                    <div>
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.relationshipStatus")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.relationshipStatus || "-"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } text-xs`}
                      >
                        {t("profile.description")}
                      </label>
                      <p
                        className={
                          theme === "dark" ? "text-white" : "text-black"
                        }
                      >
                        {USER_DATA.description || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`mt-6 flex items-center px-4 py-2 ${
                      theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"
                    } text-white rounded text-xs hover:${
                      theme === "dark" ? "bg-emerald-600" : "bg-emerald-700"
                    } transition disabled:opacity-50`}
                    onClick={() => setIsEditing(true)}
                    aria-label={t("profile.editProfile")}
                    disabled={loading}
                  >
                    <FaEdit className="mr-2" />
                    {t("profile.editProfile")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`bg-${
                theme === "dark" ? "gray-800" : "white"
              } p-6 rounded-lg shadow-lg`}
            >
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {t("profile.configureSettings")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div
                  className={`bg-${
                    theme === "dark" ? "gray-700" : "gray-100"
                  } p-4 rounded text-center`}
                >
                  <h3 className="text-sm font-medium mb-2">
                    {t("profile.basicSettings")}
                  </h3>
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    {t("profile.updateDetails")}
                  </p>
                  <button
                    className={`mt-4 w-full ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-400"
                    } text-white px-3 py-1 rounded text-xs ${
                      theme === "dark"
                        ? "hover:bg-gray-500"
                        : "hover:bg-gray-500"
                    } transition`}
                    onClick={() => setActiveStep(0)}
                    disabled={activeStep === 0 || loading}
                  >
                    {t("profile.manage")}
                  </button>
                  <button
                    className={`mt-2 w-full ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } text-xs hover:underline`}
                    onClick={() => setActiveStep(2)}
                    disabled={loading}
                  >
                    {t("profile.skip")}
                  </button>
                </div>
                <div
                  className={`bg-${
                    theme === "dark" ? "gray-700" : "gray-100"
                  } p-4 rounded text-center`}
                >
                  <h3 className="text-sm font-medium mb-2">
                    {t("profile.contactSettings")}
                  </h3>
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    {t("profile.manageContact")}
                  </p>
                  <button
                    className={`mt-4 w-full ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-400"
                    } text-white px-3 py-1 rounded text-xs ${
                      theme === "dark"
                        ? "hover:bg-gray-500"
                        : "hover:bg-gray-500"
                    } transition`}
                    onClick={() => setActiveStep(1)}
                    disabled={activeStep === 1 || loading}
                  >
                    {t("profile.add")}
                  </button>
                  <button
                    className={`mt-2 w-full ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } text-xs hover:underline`}
                    onClick={() => setActiveStep(2)}
                    disabled={loading}
                  >
                    {t("profile.skip")}
                  </button>
                </div>
                <div
                  className={`bg-${
                    theme === "dark" ? "gray-700" : "gray-100"
                  } p-4 rounded text-center`}
                >
                  <h3 className="text-sm font-medium mb-2">
                    {t("profile.additionalSettings")}
                  </h3>
                  <p
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    {t("profile.reviewPreferences")}
                  </p>
                  <button
                    className={`mt-4 w-full ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-400"
                    } text-white px-3 py-1 rounded text-xs ${
                      theme === "dark"
                        ? "hover:bg-gray-500"
                        : "hover:bg-gray-500"
                    } transition`}
                    onClick={() => setActiveStep(2)}
                    disabled={activeStep === 2 || loading}
                  >
                    {t("profile.review")}
                  </button>
                  {activeStep === 2 && (
                    <span className="mt-2 inline-block text-green-400 text-xs">
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {t("profile.stepsComplete", {
                  current: activeStep + 1,
                  total: 3,
                })}
              </p>
              {activeStep < 2 && (
                <button
                  className={`bg-${
                    theme === "dark" ? "gray-600" : "gray-400"
                  } text-white px-4 py-2 rounded text-xs ${
                    theme === "dark" ? "hover:bg-gray-500" : "hover:bg-gray-500"
                  } transition`}
                  onClick={() => setActiveStep(2)}
                  disabled={loading}
                >
                  {t("profile.skipSetup")}
                </button>
              )}
              <div className="mt-6">{steps[activeStep].content}</div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                  className={`px-4 py-2 ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-400"
                  } text-white rounded text-xs ${
                    theme === "dark" ? "hover:bg-gray-500" : "hover:bg-gray-500"
                  } transition ${
                    activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={activeStep === 0 || loading}
                >
                  {t("profile.previous")}
                </button>
                {activeStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    className={`px-4 py-2 ${
                      theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"
                    } text-white rounded text-xs ${
                      theme === "dark"
                        ? "hover:bg-emerald-600"
                        : "hover:bg-emerald-700"
                    } transition disabled:opacity-50`}
                    disabled={loading}
                  >
                    {t("profile.next")}
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSave}
                    className={`flex items-center px-4 py-2 ${
                      theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"
                    } text-white rounded text-xs ${
                      theme === "dark"
                        ? "hover:bg-emerald-600"
                        : "hover:bg-emerald-700"
                    } transition disabled:opacity-50`}
                    disabled={loading}
                  >
                    <FaSave className="mr-2" />
                    {t("profile.save")}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className={`mt-4 flex items-center px-4 py-2 ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-400"
                    : "border-gray-300 text-gray-600"
                } rounded ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } transition disabled:opacity-50`}
                disabled={loading}
              >
                <FaTimes className="mr-2" />
                {t("profile.cancel")}
              </button>
            </div>
          )
        ) : (
          <div
            className={`bg-${
              theme === "dark" ? "gray-800" : "white"
            } p-6 rounded-lg shadow-lg`}
          >
            {randomContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUser;
