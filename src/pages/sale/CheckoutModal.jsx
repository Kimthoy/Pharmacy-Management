import React, { useRef } from "react";

const CheckoutModal = ({
  isOpen,
  setIsOpen,
  totalPrice,
  totalQuantity,
  currency,
  confirmOrder,
}) => {
  // ✅ Always call hooks first
  const invoiceRef = useRef();

  const safeTotalPrice = totalPrice || 0;

  // ✅ Khmer localized date/time
  const now = new Date().toLocaleString("km-KH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // ✅ Print Invoice
  const handlePrintInvoice = () => {
    const invoiceContent = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>វិក្កយបត្រ (Invoice)</title>
          <style>
            body { 
              font-family: 'Khmer UI', Arial, sans-serif; 
              padding: 20px; 
              text-align: center; 
            }
            h2 { margin-bottom: 10px; }
            .summary { 
              margin-top: 15px; 
              font-size: 16px; 
            }
            .line {
              border-top: 1px dashed #999;
              margin: 10px 0;
            }
            .thanks {
              margin-top: 20px;
              font-size: 14px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ✅ Confirm Order → Close Modal → Print Invoice
  const handleConfirm = () => {
    if (confirmOrder) confirmOrder(); // trigger parent logic if needed
    setIsOpen(false);
    setTimeout(() => handlePrintInvoice(), 300);
  };

  // ✅ Early return AFTER hooks are called
  if (!isOpen)
    return (
      <div style={{ display: "none" }}>
        {/* Hidden invoice for printing */}
        <div ref={invoiceRef}>
          <h2>🏪 វិក្កយបត្រ</h2>
          <p>🕒 {now}</p>
          <div className="line"></div>
          <div className="summary">
            <p>
              ចំនួនផលិតផល: <strong>{totalQuantity || 0}</strong>
            </p>
            <p>
              សរុបទាំងអស់:{" "}
              <strong>
                {safeTotalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"}
              </strong>
            </p>
          </div>
          <div className="line"></div>
          <p className="thanks">🙏 អរគុណសម្រាប់ការទិញទំនិញ!</p>
        </div>
      </div>
    );

  return (
    <>
      {/* ✅ Modal UI */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            បញ្ជាក់ការបញ្ជាទិញ
          </h2>

          <div className="text-center">
            <p className="mb-2 text-lg font-semibold">
              សរុប:{" "}
              <span className="text-emerald-600">
                {safeTotalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"}
              </span>
            </p>
            <p className="mb-2">
              ចំនួនទំនិញ: <strong>{totalQuantity || 0}</strong>
            </p>
            <p className="text-sm text-gray-600">ពេលវេលា: {now}</p>
          </div>

          {/* ✅ Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              បោះបង់
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              បញ្ជាក់
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Hidden Invoice Template (needed for print) */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <h2>🏪 វិក្កយបត្រ</h2>
          <p>🕒 {now}</p>
          <div className="line"></div>
          <div className="summary">
            <p>
              ចំនួនផលិតផល: <strong>{totalQuantity || 0}</strong>
            </p>
            <p>
              សរុបទាំងអស់:{" "}
              <strong>
                {safeTotalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"}
              </strong>
            </p>
          </div>
          <div className="line"></div>
          <p className="thanks">🙏 អរគុណសម្រាប់ការទិញទំនិញ!</p>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
