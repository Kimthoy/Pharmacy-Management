import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FX = 4050; // only used if you want to display/compute change; adjust if needed

export default function CheckoutModal({
  isOpen,
  setIsOpen,
  cart = [],
  totalPrice = 0,
  totalQuantity = 0,
  confirmOrder, // should return a Promise
  currency = "USD", // "USD" or "KHR"
  storeName = "ហាងរបស់អ្នក",
  logoUrl = null,
}) {
  const invoiceRef = useRef(null);

  const [localPaymentMethod, setLocalPaymentMethod] = useState("cash");
  const [dollarAmountRaw, setDollarAmountRaw] = useState("");
  const [rielAmountRaw, setRielAmountRaw] = useState("");
  const [dollarError, setDollarError] = useState("");
  const [rielError, setRielError] = useState("");
  const [cardNumberLocal, setCardNumberLocal] = useState("");
  const [cardError, setCardError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isPackageLine = (it) =>
    Boolean(it.package_id) ||
    String(it.typeofmedicine || "").includes("ផ្សំ") ||
    String(it.type || "")
      .toLowerCase()
      .includes("package");

  // Build the payload your SaleController expects
  const buildPayload = () => {
    const items = cart
      .filter((it) => !isPackageLine(it))
      .map((it) => ({
        // ✅ must be medicines.id
        medicine_id: it.medicine_id || it.id,
        quantity: Number(it.quantity || 1),
        unit_price: Number(it.price || 0), // keep same currency across all items
      }));

    const sale_retail_items = cart
      .filter((it) => isPackageLine(it))
      .map((it) => ({
        // ✅ must be packages.id
        package_id: it.package_id || it.id,
        quantity: Number(it.quantity || 1),
        unit_price: Number(it.price || 0),
      }));

    return {
      sale_date: new Date().toISOString().slice(0, 10),
      payment_method: localPaymentMethod,
      ...(items.length ? { items } : {}),
      ...(sale_retail_items.length ? { sale_retail_items } : {}),
      // add more fields here if your API expects them:
      // usd_paid: Number(dollarAmountRaw || 0),
      // khr_paid: Number(rielAmountRaw || 0),
      // rate: FX,
      // card_number: localPaymentMethod === 'card' ? cardNumberLocal : null,
    };
  };

  const validate = () => {
    if (localPaymentMethod === "cash") {
      if (currency === "USD") {
        if (!dollarAmountRaw) {
          setDollarError("Please enter an amount");
          return false;
        }
        setDollarError("");
      } else {
        if (!rielAmountRaw) {
          setRielError("Please enter an amount");
          return false;
        }
        setRielError("");
      }
    } else {
      if (
        !cardNumberLocal ||
        String(cardNumberLocal).replace(/\D/g, "").length < 16
      ) {
        setCardError("Please enter a valid 16-digit card number");
        return false;
      }
      setCardError("");
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = buildPayload();
      await Promise.resolve(confirmOrder?.(payload)); // parent posts to /sales
      // After successful post, auto-download invoice
      await handleDownloadPDF();
      setIsOpen(false);
    } catch (e) {
      // parent should toast; keep optional local alert as fallback
      console.error(e);
      alert(e?.message || "Failed to confirm order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const el = invoiceRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${Date.now()}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-[60]">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          បញ្ជាក់ការបញ្ជាទិញ
        </h2>

        <div className="text-center">
          <p className="mb-2 text-lg font-semibold">
            សរុប:{" "}
            <span className="text-emerald-600">
              {Number(totalPrice).toFixed(2)} {currency === "USD" ? "$" : "៛"}
            </span>
          </p>
          <p className="mb-2">
            ចំនួនទំនិញ: <strong>{totalQuantity}</strong>
          </p>
        </div>

        {/* Payment UI (simple) */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <label className="font-medium">វិធីទូទាត់</label>
            <select
              className="border rounded px-2 py-1"
              value={localPaymentMethod}
              onChange={(e) => setLocalPaymentMethod(e.target.value)}
            >
              <option value="cash">សាច់ប្រាក់</option>
              <option value="card">កាត</option>
            </select>
          </div>

          {localPaymentMethod === "cash" ? (
            currency === "USD" ? (
              <div>
                <label className="block text-sm mb-1">បង់ (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2"
                  value={dollarAmountRaw}
                  onChange={(e) => setDollarAmountRaw(e.target.value)}
                />
                {dollarError && (
                  <p className="text-red-600 text-sm mt-1">{dollarError}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-1">បង់ (KHR)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full border rounded px-3 py-2"
                  value={rielAmountRaw}
                  onChange={(e) => setRielAmountRaw(e.target.value)}
                />
                {rielError && (
                  <p className="text-red-600 text-sm mt-1">{rielError}</p>
                )}
              </div>
            )
          ) : (
            <div>
              <label className="block text-sm mb-1">លេខកាត</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={19}
                className="w-full border rounded px-3 py-2"
                value={cardNumberLocal}
                onChange={(e) =>
                  setCardNumberLocal(e.target.value.replace(/[^\d ]/g, ""))
                }
                placeholder="**** **** **** ****"
              />
              {cardError && (
                <p className="text-red-600 text-sm mt-1">{cardError}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
            disabled={submitting}
          >
            បោះបង់
          </button>
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "កំពុងដំណើរការ..." : "✅ បញ្ជាក់ & ទាញយកវិក្កយបត្រ"}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            disabled={submitting}
          >
            ⬇️ ទាញយកវិក្កយបត្រ
          </button>
        </div>
      </div>

      {/* Invoice Template */}
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
        {/* Add line items, totals, etc. here if you want the invoice to show them */}
      </div>
    </div>
  );
}
