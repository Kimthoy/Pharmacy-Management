import React, { useEffect, useState } from "react";
import { getAllSale } from "../api/saleService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = React.useRef();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await getAllSale();
        if (Array.isArray(data)) {
          setSales(data);
        } else if (Array.isArray(data.sales)) {
          setSales(data.sales);
        } else if (Array.isArray(data.data)) {
          setSales(data.data);
        } else {
         
          setSales([]);
        }
      } catch (err) {
       
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // ✅ Always ensure sales is an array
  const safeSales = Array.isArray(sales) ? sales : [];

  // ✅ Safely calculate totalRevenue
  const totalRevenue = safeSales.reduce((sum, sale) => {
    const amount = parseFloat(sale.total_amount) || 0; // convert string/null → number
    return sum + amount;
  }, 0);

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`sales-report-${Date.now()}.pdf`);
  };

  if (loading) return <p className="p-6">Loading sales report...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Sales Report</h1>

      <div className="mb-4 flex justify-between">
        <div>
          <p>
            Total Transactions: <strong>{safeSales.length}</strong>
          </p>
          <p>
            Total Revenue:{" "}
            <strong>
              $
              {Number.isFinite(totalRevenue) ? totalRevenue.toFixed(2) : "0.00"}
            </strong>
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇ Download PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-white p-4 rounded shadow">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Invoice #</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Payment</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {safeSales.map((sale) => {
              const amount = parseFloat(sale.total_amount) || 0;
              return (
                <tr key={sale.id}>
                  <td className="border p-2">{sale.id}</td>
                  <td className="border p-2">
                    {new Date(sale.sale_date).toLocaleString("km-KH")}
                  </td>
                  <td className="border p-2">{sale.payment_method || "N/A"}</td>
                  <td className="border p-2">${amount.toFixed(2)}</td>
                  <td className="border p-2">{sale.items?.length || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
