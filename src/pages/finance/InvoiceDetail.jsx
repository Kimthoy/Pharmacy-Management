import React from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { useTranslation } from "../../hooks/useTranslation";

const InvoiceDetail = () => {
  const { t } = useTranslation();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Link to="/invoicelist">
        <button className="rounded-md px-2 flex justify-center py-1 outline outline-green-500">
          <MdOutlineKeyboardDoubleArrowLeft className="mt-1 text-lg" />{" "}
          {t("invoiceDetail.back")}
        </button>
      </Link>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className=" text-green-600 px-4 py-2 rounded-md shadow-md hover:bg-green-200 transition print:hidden"
        >
          <BsFillPrinterFill className="text-2xl" />
        </button>
      </div>

      {/* Invoice Content */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 invoice-print-area">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">
              {t("invoiceDetail.invoice")}
            </h1>
            <p className="text-sm text-gray-400">
              {t("invoiceDetail.invoiceId")}: 66K5W3
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-700">
              {t("invoiceDetail.companyName")}
            </h2>
            <p className="text-sm text-gray-400">
              {t("invoiceDetail.companyAddress")}
            </p>
            <p className="text-sm text-gray-400">
              {t("invoiceDetail.companyPhone")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {t("invoiceDetail.invoiceTo")}
            </h3>
            <p className="text-gray-600">
              {t("invoiceDetail.companyName")}
            </p>
            <p className="text-gray-600">
              {t("invoiceDetail.companyAddress")}
            </p>
           
            <p className="text-gray-600">
              {t("invoiceDetail.companyPhone")}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {t("invoiceDetail.date")}
            </h3>
            <p className="text-gray-600">26 Jan, 2020</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-gray-700 mb-8">
          <thead>
            <tr className="bg-gray-200 text-gray-500 text-center">
              <th className="p-3 border">
                {t("invoiceDetail.tableHeaders.itemId")}
              </th>
              <th className="p-3 border">
                {t("invoiceDetail.tableHeaders.description")}
              </th>
              <th className="p-3 border">
                {t("invoiceDetail.tableHeaders.price")}
              </th>
              <th className="p-3 border">
                {t("invoiceDetail.tableHeaders.qty")}
              </th>
              <th className="p-3 border">
                {t("invoiceDetail.tableHeaders.amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border text-center">
              <td className="p-3 border">24108054</td>
              <td className="p-3 border">Zimax - Group of Azithromycin</td>
              <td className="p-3 border">$40.00</td>
              <td className="p-3 border">5</td>
              <td className="p-3 border">$200.00</td>
            </tr>
            <tr className="border text-center">
              <td className="p-3 border">24108054</td>
              <td className="p-3 border">6 months premium support</td>
              <td className="p-3 border">$25.00</td>
              <td className="p-3 border">1</td>
              <td className="p-3 border">$25.00</td>
            </tr>
            <tr className="border text-center">
              <td className="p-3 border">23604094</td>
              <td className="p-3 border">Oxidon - Group of Domperidon</td>
              <td className="p-3 border">$131.25</td>
              <td className="p-3 border">1</td>
              <td className="p-3 border">$131.25</td>
            </tr>
            <tr className="border text-center">
              <td className="p-3 border">23604094</td>
              <td className="p-3 border">6 months premium support</td>
              <td className="p-3 border">$78.75</td>
              <td className="p-3 border">1</td>
              <td className="p-3 border">$78.75</td>
            </tr>
          </tbody>
        </table>

        <div className="text-right">
          <div className="mb-2">
            <span className="text-gray-600">{t("invoiceDetail.subtotal")}</span>
            <span className="ml-4 font-semibold">$435.00</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600">
              {t("invoiceDetail.processingFee")}
            </span>
            <span className="ml-4 font-semibold">$10.00</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600">{t("invoiceDetail.tax")}</span>
            <span className="ml-4 font-semibold">$43.50</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600">
              {t("invoiceDetail.grandTotal")}
            </span>
            <span className="ml-4 font-bold text-xl">$478.50</span>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>{t("invoiceDetail.footerNote")}</p>
        </div>
      </div>
    </div>
  );
};
export default InvoiceDetail;
