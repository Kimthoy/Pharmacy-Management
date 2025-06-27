import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
import {
  UserCircle,
  Crown,
  AlertCircle,
  Clock,
  MessageCircle,
  Bell,
  Moon,
  LogOut,
  Sun,
} from "lucide-react";

const ProfileDashboard = () => {
  const { t } = useTranslation();
  // const { theme } = useTheme();
  const { theme, toggleTheme } = useTheme(true);
  const user = {
    name: "បញា​អុន", // បញ្ញា៉ឹន
    membership: "សាមាចាក​មាស", // សមាជិក មាស
    stats: {
      wallet: 0,
      alert: 0,
      clock: "13,09",
    },
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Go back to previous page
  };

  return (
    <div className="mb-10">
      <div className="fixed  bg-white sm:shadow-lg w-full h-11 top-0 left-0">
        <div
          className="flex hover:text-green-600 cursor-pointer"
          onClick={handleGoBack}
        >
          <TiArrowBack className=" ml-14 mt-2 w-7 h-7" />
          <h4 className=" mt-3">គណនី</h4>
        </div>
      </div>
      <div
        className={`flex-1 sm:p-6 mt-4 overflow-auto min-h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="bg-white mt-6 dark:bg-gray-800 rounded-lg shadow-md">
          <div className="bg-green-700 text-white p-6 rounded-t-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <UserCircle size={64} className="text-gray-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex justify-center items-center gap-2 mt-1 text-sm">
              <Crown className="w-4 h-4" />
              <span>{user.membership}</span>
            </div>
          </div>

          <div className="flex justify-around py-4 border-t border-gray-200 dark:border-gray-700 text-sm">
            <div className="text-center">
              <div className="font-semibold">{user.stats.wallet}</div>
            </div>
            <div className="text-center">
              <AlertCircle className="mx-auto w-4 h-4" />
              <div className="font-semibold">{user.stats.alert}</div>
            </div>
            <div className="text-center">
              <Clock className="mx-auto w-4 h-4" />
              <div className="font-semibold">{user.stats.clock}</div>
            </div>
          </div>
        </div>

        <div className="mt-6  mb-8">
          <ul className="  divide-gray-200 dark:divide-gray-700">
            <li className="w-full flex items-center bg-gray-200 mb-2 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <UserCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-500">Profile</span>
            </li>
            <li className="flex items-center bg-gray-200 mb-2 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-500">Message</span>
            </li>
            <li className="flex items-center bg-gray-200 mb-2 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Bell className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-500">Notifications</span>
            </li>
            <li
              onClick={toggleTheme}
              className="flex items-center bg-gray-200 mb-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <button
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                className="p-2  flex dark:text-green-500  text-green-600  dark:hover:bg-gray-700 transition "
              >
                {theme === "light"
                  ? [
                      <Moon
                        size={20}
                        className="w-5 h-5 text-green-600 mr-3"
                      />,
                      "Dark Mode",
                    ]
                  : [
                      <Sun size={20} className="w-5 h-5 text-green-600 mr-3" />,
                      "Light Mode",
                    ]}
              </button>
            </li>
            <li className="flex items-center bg-gray-200 mb-2 p-4 cursor-pointer sm:hover:bg-gray-100  dark:hover:bg-gray-700 rounded-md">
              <LogOut className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-500">Logout/Login</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
