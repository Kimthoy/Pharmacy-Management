
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="text-center text-gray-700 dark:text-gray-200">
        <h1 className="text-4xl font-bold mb-4">404 - {t("error.pageNotFound")}</h1>
        <p className="text-sm mb-6">{t("error.pageNotFoundDesc")}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-emerald-500 border border-emerald-500 px-4 py-2 rounded hover:bg-emerald-500 hover:text-white transition"
        >
          {t("error.backToDashboard")}
        </button>
      </div>
    </div>
  );
};

export default NotFound;

