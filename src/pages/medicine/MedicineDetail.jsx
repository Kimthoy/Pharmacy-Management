import { useTranslation } from "../../hooks/useTranslation";

const MedicineDetail = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6 mb-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {t("medicinedetail.MedicineDetails")}
        </h2>
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {t("medicinedetail.MedicineInformation")}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailName")}:
              </span>{" "}
              Zimax
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailWeight")}:
              </span>{" "}
              500mg
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailCategory")}:
              </span>{" "}
              Tablet
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailManufacturer")}:
              </span>{" "}
              Healthcare
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailExpireDate")}:
              </span>{" "}
              19/12/2020
            </p>
          </div>
          <p className="mt-2 flex items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {t("medicinedetail.MedicineDetailPopularity")}:
            </span>
            <span className="ml-2 text-yellow-500 dark:text-yellow-400">
              ★★★★★
            </span>
          </p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {t("medicinedetail.MedicineDetailStock")}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailStartingStock")}:
              </span>{" "}
              230 box
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailCurrentStock")}:
              </span>{" "}
              180 box
            </p>
            <p className="flex items-center">
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailStockStatus")}:
              </span>
              <span className="ml-2 px-2 py-1 text-white bg-green-500 dark:bg-green-600 rounded">
                Available
              </span>
            </p>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 dark:bg-green-600 h-4 rounded-full text-xs text-white text-center"
                style={{ width: "75%" }}
              >
                75%
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {t("medicinedetail.MedicineDetailEstimate")}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailManufacturePrice")}:
              </span>{" "}
              $50.00
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailSellingPrice")}:
              </span>{" "}
              $60.00
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailWholesalePrice")}:
              </span>{" "}
              $55.00
            </p>
          </div>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500"
            onClick={() => window.history.back()}
          >
            {t("medicinedetail.MedicineDetailMedicineList")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
