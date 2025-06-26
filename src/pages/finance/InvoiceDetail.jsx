import { BsFillPrinterFill } from "react-icons/bs";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const InvoiceDetail = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const handlePrint = () => {
    window.print();
  };

  const invoice = {
    id: "66K5W3",
    date: "26 Jan, 2020",
    companyName: t("invoiceDetail.companyName"),
    companyAddress: t("invoiceDetail.companyAddress"),
    companyPhone: t("invoiceDetail.companyPhone"),
    subtotal: "$435.00",
    processingFee: "$10.00",
    tax: "$43.50",
    grandTotal: "$478.50",
    items: [
      {
        id: "24108054",
        description: "Zimax - Group of Azithromycin",
        price: "$40.00",
        qty: 5,
        amount: "$200.00",
      },
      {
        id: "24108054",
        description: "6 months premium support",
        price: "$25.00",
        qty: 1,
        amount: "$25.00",
      },
      {
        id: "23604094",
        description: "Oxidon - Group of Domperidon",
        price: "$131.25",
        qty: 1,
        amount: "$131.25",
      },
      {
        id: "23604094",
        description: "6 months premium support",
        price: "$78.75",
        qty: 1,
        amount: "$78.75",
      },
    ],
  };

  return (
    <div className="sm:p-6 mb-20 sm:bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <Link to="/invoicelist">
          <button className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg flex items-center space-x-1 dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition">
            <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />
            <span>{t("invoiceDetail.back")}</span>
          </button>
        </Link>
        <div className=" items-center  mt-4 md:mt-0">
          <button
            onClick={handlePrint}
            className="text-md sm:text-emerald-500  text-white sm:bg-white bg-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-lg flex items-center space-x-2 dark:hover:text-white sm:hover:text-white sm:hover:bg-emerald-500 dark:hover:bg-emerald-400 transition print:hidden"
          >
            <BsFillPrinterFill className="text-lg" />
            <span>{t("invoiceDetail.print")}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 sm:rounded-lg sm:shadow-md dark:shadow-gray-700 sm:border border-gray-200 dark:border-gray-600 invoice-print-area">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="sm:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
              {t("invoiceDetail.invoice")}
            </h1>
            <p className="text-md text-gray-400 dark:text-gray-300">
              {t("invoiceDetail.invoiceId")}: {invoice.id}
            </p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <h2 className="sm:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
              {invoice.companyName}
            </h2>
            <p className="text-md text-gray-400 dark:text-gray-300">
              {invoice.companyAddress}
            </p>
            <p className="text-md text-gray-400 dark:text-gray-300">
              {invoice.companyPhone}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {t("invoiceDetail.invoiceTo")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {invoice.companyName}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {invoice.companyAddress}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {invoice.companyPhone}
            </p>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {t("invoiceDetail.date")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{invoice.date}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 mb-8">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
              <th className="sm:flex hidden p-3 border border-gray-300 dark:border-gray-600">
                {t("invoiceDetail.tableHeaders.itemId")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoiceDetail.tableHeaders.description")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoiceDetail.tableHeaders.price")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoiceDetail.tableHeaders.qty")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoiceDetail.tableHeaders.amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={index}
                className="border border-gray-300 dark:border-gray-600 text-center"
              >
                <td className="sm:flex hidden p-3 border border-gray-300 dark:border-gray-600">
                  {item.id}
                </td>
                <td className="p-3 border border-gray-300 dark:border-gray-600">
                  {item.description}
                </td>
                <td className="p-3 border border-gray-300 dark:border-gray-600">
                  {item.price}
                </td>
                <td className="p-3 border border-gray-300 dark:border-gray-600">
                  {item.qty}
                </td>
                <td className="p-3 border border-gray-300 dark:border-gray-600">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-left md:text-right">
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {t("invoiceDetail.subtotal")}
            </span>
            <span className="ml-4 font-semibold dark:text-gray-300">
              {invoice.subtotal}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {t("invoiceDetail.processingFee")}
            </span>
            <span className="ml-4 font-semibold dark:text-gray-300">
              {invoice.processingFee}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {t("invoiceDetail.tax")}
            </span>
            <span className="ml-4 font-semibold dark:text-gray-300">
              {invoice.tax}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {t("invoiceDetail.grandTotal")}
            </span>
            <span className="ml-4 font-bold text-xl dark:text-gray-300">
              {invoice.grandTotal}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>{t("invoiceDetail.footerNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
