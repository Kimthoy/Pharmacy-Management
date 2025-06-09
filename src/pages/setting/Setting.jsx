import { useState } from "react";
import {
  FaCog,
  FaUsers,
  FaLock,
  FaShieldAlt,
  FaHistory,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
const Setting = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [registrationOption, setRegistrationOption] = useState("Enable");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [settings, setSettings] = useState({
    pharmacyName: "",
    pharmacyAddress: "",
    copyright: "",
    site: "",
    description: "",
  });
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("Pharmacist");
  const [members, setMembers] = useState([]);
  const handleAddMember = async () => {
    if (!selectedMember) return;
    try {
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/members",
        {
          name: selectedMember,
          role: selectedDesignation,
          email: "",
          joinedOn: "-",
        },
       
      );
      setMembers([...members, response.data]);
      setSelectedMember("");
    } catch (err) {
     
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://127.0.0.1:8000/api/settings",
        { ...settings, registrationOption, maintenanceMode: isMaintenance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      alert(t("settings.updateSuccess"));
    } catch (err) {
    
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("settings.general.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
              {t("settings.general.description")}
            </p>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-[4px] p-6 border border-gray-200 dark:border-gray-600">
              <form onSubmit={handleSettingsSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.pharmacyName")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.pharmacyNameHint")}
                  </span>
                  <input
                    type="text"
                    name="pharmacyName"
                    value={settings.pharmacyName}
                    onChange={handleSettingsChange}
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.pharmacyAddress")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.pharmacyAddressHint")}
                  </span>
                  <input
                    type="text"
                    name="pharmacyAddress"
                    value={settings.pharmacyAddress}
                    onChange={handleSettingsChange}
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.copyright")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.copyrightHint")}
                  </span>
                  <input
                    type="text"
                    name="copyright"
                    value={settings.copyright}
                    onChange={handleSettingsChange}
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.allowRegistration")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.allowRegistrationHint")}
                  </span>
                  <div className="flex mt-3 space-x-6">
                    {["Enable", "Disable", "On Request"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => setRegistrationOption(option)}
                      >
                        <input
                          type="radio"
                          id={option.toLowerCase()}
                          name="registration"
                          value={option}
                          checked={registrationOption === option}
                          onChange={() => setRegistrationOption(option)}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            registrationOption === option
                              ? "border-emerald-500"
                              : "border-gray-400 dark:border-gray-600"
                          }`}
                        >
                          {registrationOption === option && (
                            <div className="w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                          )}
                        </div>
                        <label
                          htmlFor={option.toLowerCase()}
                          className={`cursor-pointer text-xs ${
                            registrationOption === option
                              ? "text-emerald-500 dark:text-emerald-400 font-semibold"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {t(
                            `settings.general.registrationOptions.${option.toLowerCase()}`
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.mainSite")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.mainSiteHint")}
                  </span>
                  <input
                    type="text"
                    name="site"
                    value={settings.site}
                    onChange={handleSettingsChange}
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.description")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.descriptionHint")}
                  </span>
                  <textarea
                    name="description"
                    value={settings.description}
                    onChange={handleSettingsChange}
                    className="w-full h-40 border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.general.maintenanceMode")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.general.maintenanceModeHint")}
                  </span>
                  <div className="flex items-center mt-3">
                    <button
                      className={`relative w-14 h-7 rounded-full transition duration-300 focus:outline-none shadow-inner ${
                        isMaintenance
                          ? "bg-emerald-500"
                          : "bg-gray-400 dark:bg-gray-600"
                      }`}
                      onClick={() => setIsMaintenance(!isMaintenance)}
                      aria-label={
                        isMaintenance
                          ? t("settings.general.disableMaintenance")
                          : t("settings.general.enableMaintenance")
                      }
                    >
                      <div
                        className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isMaintenance ? "translate-x-7" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                    <span className="text-gray-600 dark:text-gray-300 ml-3 text-xs">
                      {isMaintenance
                        ? t("settings.general.online")
                        : t("settings.general.offline")}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-emerald-500 dark:bg-emerald-400 text-white px-4 py-2 rounded-[4px] text-xs shadow-md hover:bg-emerald-600 dark:hover:bg-emerald-500 transition active:shadow-none"
                  >
                    {t("settings.general.update")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case "Members":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("settings.members.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs">
              {t("settings.members.description")}
            </p>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-[4px] border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 text-xs">
                    {t("settings.members.selectMember")}
                  </label>
                  <select
                    class
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    <option value="">
                      {t("settings.members.selectMemberPlaceholder")}
                    </option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 text-xs">
                    {t("settings.members.selectDesignation")}
                  </label>
                  <select
                    className="w-full border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                  >
                    <option value="Pharmacist">
                      {t("settings.members.designations.pharmacist")}
                    </option>
                    <option value="Manager">
                      {t("settings.members.designations.manager")}
                    </option>
                    <option value="Assistant">
                      {t("settings.members.designations.assistant")}
                    </option>
                  </select>
                </div>
              </div>
              <button
                className="bg-emerald-500 dark:bg-emerald-400 text-white px-4 py-2 rounded-[4px] text-xs hover:bg-emerald-600 dark:hover:bg-emerald-500 transition"
                onClick={handleAddMember}
              >
                {t("settings.members.addSelected")}
              </button>
              <table className="w-full mt-6 border border-gray-300 dark:border-gray-600 rounded-[4px]">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs">
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      {t("settings.members.tableHeaders.name")}
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      {t("settings.members.tableHeaders.email")}
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      {t("settings.members.tableHeaders.role")}
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      {t("settings.members.tableHeaders.joinedOn")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <td className="p-2">{member.name}</td>
                      <td className="p-2">{member.email}</td>
                      <td className="p-2">{member.role}</td>
                      <td className="p-2">{member.joinedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "E-mail":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("settings.email.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
              {t("settings.email.description")}
            </p>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-[4px] p-6 border border-gray-200 dark:border-gray-600">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.email.email")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.email.emailHint")}
                  </span>
                  <input
                    type="email"
                    placeholder="info@softnio.com"
                    className="w-full border bg-white  border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium text-xs">
                    {t("settings.email.password")}
                  </label>
                  <span className="italic text-xs text-gray-400 dark:text-gray-300">
                    {t("settings.email.passwordHint")}
                  </span>
                  <input
                    type="password"
                    className="w-full border   border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-emerald-500 dark:bg-emerald-400 text-white px-4 py-2 rounded-[4px] text-xs shadow-md hover:bg-emerald-600 dark:hover:bg-emerald-500 transition active:shadow-none"
                  >
                    {t("settings.email.update")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case "Security":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("settings.security.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
              {t("settings.security.description")}
            </p>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-[4px] p-6 border border-gray-200 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                {t("settings.security.unavailable")}
              </p>
            </div>
          </div>
        );
      case "Account activity":
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("settings.activity.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
              {t("settings.activity.description")}
            </p>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-[4px] p-6 border border-gray-200 dark:border-gray-600">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-[4px]">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs">
                    <th className="p-3 text-left border border-gray-300 dark:border-gray-600">
                      {t("settings.activity.tableHeaders.browser")}
                    </th>
                    <th className="p-3 text-left border border-gray-300 dark:border-gray-600">
                      {t("settings.activity.tableHeaders.ip")}
                    </th>
                    <th className="p-3 text-left border border-gray-300 dark:border-gray-600">
                      {t("settings.activity.tableHeaders.time")}
                    </th>
                    <th className="p-3 text-left border border-gray-300 dark:border-gray-600">
                      {t("settings.activity.tableHeaders.activity")}
                    </th>
                    <th className="p-3 text-left border border-gray-300 dark:border-gray-600">
                      {t("settings.activity.tableHeaders.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {activityLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                    >
                      <td className="p-3 text-gray-700 dark:text-gray-200">
                        {log.browser}
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-200">
                        {log.ip}
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-200">
                        {log.time}
                      </td>
                      <td
                        className={`p-3 font-semibold text-xs ${
                          log.activity === "Deleted"
                            ? "text-red-500 dark:text-red-400"
                            : log.activity === "Updated"
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-blue-500 dark:text-blue-400"
                        }`}
                      >
                        {t(
                          `settings.activity.activities.${log.activity.toLowerCase()}`
                        )}
                      </td>
                      <td
                        className="p-3 text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300"
                        onClick={() => handleDeleteClick(log.id)}
                        aria-label={t("settings.activity.delete")}
                      >
                        ×
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
              {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-[4px] shadow-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {t("settings.activity.confirmDelete")}
                    </p>
                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        className="bg-red-500 dark:bg-red-400 text-white px-4 py-2 rounded-[4px] text-xs hover:bg-red-600 dark:hover:bg-red-500 transition"
                        // onClick={confirmDelete}
                      >
                        {t("settings.activity.yesDelete")}
                      </button>
                      <button
                        className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-[4px] text-xs hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                        onClick={() => setShowPopup(false)}
                      >
                        {t("settings.activity.cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-emerald-500 dark:text-emerald-400">
            {t("settings.title")}
          </h1>
          <p className="text-gray-400 dark:text-gray-300 text-xs font-normal">
            {t("settings.description")}
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] mt-4 md:mt-0 dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
          aria-label={
            theme === "light"
              ? t("settings.switchToDark")
              : t("settings.switchToLight")
          }
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg p-4 rounded-[4px] border border-gray-200 dark:border-gray-600">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t("settings.sidebar.title")}
          </h2>
          <p className="mb-6 text-xs text-gray-400 dark:text-gray-300">
            {t("settings.sidebar.description")}
          </p>
          <ul className="space-y-6">
            {[
              {
                tab: "General",
                icon: <FaCog />,
                label: t("settings.sidebar.general"),
              },
              {
                tab: "Members",
                icon: <FaUsers />,
                label: t("settings.sidebar.members"),
              },
              {
                tab: "E-mail",
                icon: <FaLock />,
                label: t("settings.sidebar.email"),
              },
              {
                tab: "Security",
                icon: <FaShieldAlt />,
                label: t("settings.sidebar.security"),
              },
              {
                tab: "Account activity",
                icon: <FaHistory />,
                label: t("settings.sidebar.activity"),
              },
            ].map(({ tab, icon, label }) => (
              <li
                key={tab}
                className={`flex items-center space-x-3 cursor-pointer text-xs ${
                  activeTab === tab
                    ? "text-emerald-500 dark:text-emerald-400 font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {icon}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Setting;
