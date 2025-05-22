import { useParams, Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { FaArrowLeft } from "react-icons/fa";
import { suppliers } from "../../data/suppliers";

const SupplierDetail = () => {
  const { t } = useTranslation();
  const { supplier_id } = useParams();

  const supplier = suppliers.find(
    (s) => s.supplier_id === parseInt(supplier_id, 10)
  );

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t("supplierdetail.notFound")}
          </h2>
          <Link
            to="/supplierlist"
            className="mt-4 flex items-center px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500"
          >
            <FaArrowLeft className="mr-2" />
            {t("supplierdetail.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {t("supplierdetail.title")}
            {">>"}
            {supplier.name}
          </h1>
          <Link
            to="/supplierlist"
            className="mt-4 flex items-center px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500"
          >
            <FaArrowLeft className="mr-2" />
            {t("supplierdetail.back")}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {t("supplierdetail.details")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.name")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.contactInfo")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.contact_info}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.email")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.phone")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.phone}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.address")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.address}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("supplierdetail.createdAt")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {supplier.created_at}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
