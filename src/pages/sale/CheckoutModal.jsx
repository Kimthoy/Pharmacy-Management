import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CheckoutModal({
  isOpen,
  setIsOpen,
  totalPrice,
  totalQuantity,
  products = [],
  confirmOrder,
  currency = "USD",
  storeName = "ហាងរបស់អ្នក",
  logoUrl = null,
}) {
  const invoiceRef = useRef();

  const displayProducts =
    products && products.length > 0
      ? products
      : [
          { name: "Sample Product A", quantity: 2, price: 5.0 },
          { name: "Sample Product B", quantity: 1, price: 8.0 },
        ];

  const now = new Date().toLocaleString("km-KH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleDownloadPDF = async () => {
    const el = invoiceRef.current;
    if (!el) {
      alert("Invoice not ready!");
      return;
    }

    await new Promise((r) => setTimeout(r, 200));

    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${Date.now()}.pdf`);
  };

  const handleConfirm = async () => {
    if (confirmOrder) await confirmOrder();
    await handleDownloadPDF();
    setIsOpen(false);
  };

  const InvoiceTemplate = () => (
    <div
      ref={invoiceRef}
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "#fff",
        padding: "20px",
        fontFamily: "Khmer UI, Arial, sans-serif",
        border: "2px solid #ddd",
        marginTop: "20px",
      }}
    >
      {logoUrl && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img src={logoUrl} alt="Logo" style={{ width: "80px" }} />
        </div>
      )}
      <h2 style={{ textAlign: "center" }}>🏪 {storeName}</h2>
      <p style={{ textAlign: "center" }}>🕒 {now}</p>

      <hr style={{ border: "1px dashed #999", margin: "10px 0" }} />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>
              ផលិតផល
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>
              ចំនួន
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>
              តម្លៃ
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "6px" }}>
              សរុប
            </th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((item, i) => (
            <tr key={i}>
              <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>
                {item.name || "Unknown Product"}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>
                {item.quantity || 0}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>
                {Number(item.price || 0).toFixed(2)}{" "}
                {currency === "USD" ? "$" : "៛"}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>
                {Number(item.price * item.quantity || 0).toFixed(2)}{" "}
                {currency === "USD" ? "$" : "៛"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ border: "1px dashed #999", margin: "10px 0" }} />

      <div style={{ textAlign: "right", fontSize: "16px" }}>
        <p>
          <strong>ចំនួនទំនិញ:</strong> {totalQuantity || displayProducts.length}
        </p>
        <p>
          <strong>សរុបទាំងអស់:</strong>{" "}
          {totalPrice > 0
            ? Number(totalPrice).toFixed(2)
            : displayProducts
                .reduce(
                  (sum, p) =>
                    sum + Number(p.price || 0) * Number(p.quantity || 0),
                  0
                )
                .toFixed(2)}{" "}
          {currency === "USD" ? "$" : "៛"}
        </p>
      </div>

      <hr style={{ border: "1px dashed #999", margin: "10px 0" }} />

      <p style={{ textAlign: "center", fontStyle: "italic" }}>
        🙏 អរគុណសម្រាប់ការទិញទំនិញ!
      </p>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              បញ្ជាក់ការបញ្ជាទិញ
            </h2>

            <div className="text-center">
              <p className="mb-2 text-lg font-semibold">
                សរុប:{" "}
                <span className="text-emerald-600">
                  {totalPrice > 0
                    ? Number(totalPrice).toFixed(2)
                    : displayProducts
                        .reduce(
                          (sum, p) =>
                            sum +
                            Number(p.price || 0) * Number(p.quantity || 0),
                          0
                        )
                        .toFixed(2)}{" "}
                  {currency === "USD" ? "$" : "៛"}
                </span>
              </p>
              <p className="mb-2">
                ចំនួនទំនិញ:{" "}
                <strong>{totalQuantity || displayProducts.length}</strong>
              </p>
              <p className="text-sm text-gray-600">ពេលវេលា: {now}</p>
            </div>

            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
              >
                បោះបង់
              </button>
              <button
                onClick={handleConfirm}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                ✅ បញ្ជាក់ & ទាញយកវិក្កយបត្រ
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                ⬇️ ទាញយកវិក្កយបត្រ
              </button>
            </div>
          </div>

          <InvoiceTemplate />
        </div>
      )}
    </>
  );
}
