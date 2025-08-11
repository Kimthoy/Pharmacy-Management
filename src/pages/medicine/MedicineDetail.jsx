import { useTranslation } from "../../hooks/useTranslation";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMedicineById } from "../api/medicineService";

const MedicineDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    () => {
      const fetchMedicine = async () => {
        try {
          const data = await getMedicineById(id);
          setMedicine(data);
        } catch (err) {
          setError("Error loading medicine.");
        } finally {
          setLoading(false);
        }
      };
      fetchMedicine();
    },
    [id],
    t
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        {t("medicinedetail.Loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        {t("medicinedetail.MedicineNotFound")}
      </div>
    );
  }

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
                {t("medicinedetail.Barcode")}:
              </span>{" "}
              {medicine.barcode || "-"}
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailName")}:
              </span>{" "}
              {medicine.medicine_name || "-"}
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.Price")}:
              </span>{" "}
              {medicine.price ? `$${medicine.price}` : "-"}
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetailWeight")}:
              </span>{" "}
              {medicine.weight || "-"}
            </p>
            <p className="col-span-2">
              <span className="font-semibold">
                {t("medicinedetail.MedicineDetail")}:
              </span>{" "}
              {medicine.medicine_detail || "-"}
            </p>
            <p className="col-span-2">
              <span className="font-semibold">
                {t("medicinedetail.Manufacturer")}:
              </span>{" "}
              {medicine.manufacturer || "-"}
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.Origin")}:
              </span>{" "}
              {medicine.origin || "-"}
            </p>
            <p>
              <span className="font-semibold">
                {t("medicinedetail.Purchase")}:
              </span>{" "}
              {medicine.purchase || "-"}
            </p>
            <div className="col-span-2 flex justify-center mt-4">
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.medicine_name}
                  className="max-h-48 rounded"
                />
              ) : (
                <p>{t("medicinedetail.NoImage")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500"
            onClick={() => navigate(-1)}
          >
            {t("medicinedetail.MedicineDetailMedicineList")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
