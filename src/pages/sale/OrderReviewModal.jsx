import { useState, useMemo } from "react";

/** ---- helpers ---- */
const FX = 4100; // 1 USD = 4100 KHR

const toNumber = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

const isPackageLine = (item) => {
  if (item.package_id) return true;
  const t = String(item.type || item.typeofmedicine || "").toLowerCase();
  return t.includes("package") || t.includes("ផ្សំ"); // Khmer "compound"
};

const usdPriceOf = (item) => {
  const price = toNumber(item.price, 0);
  const isKHR = String(item.currency || "USD").toUpperCase() === "KHR";
  return isKHR ? price / FX : price;
};

export default function OrderReviewModal({
  isOpen,
  setIsOpen,
  cart = [],
  paymentMethod,
  cardNumber,
  setCardNumber,
  onConfirm, // (payload) => void/Promise
}) {
  /** 1) Merge cart by (id + packaging + kind) so packages won't merge with meds */
  const mergedCartArray = useMemo(() => {
    const acc = {};
    for (const it of cart) {
      const kind = isPackageLine(it) ? "pkg" : "med";
      const key = `${it.id}-${it.packaging || "default"}-${kind}`;
      if (!acc[key]) {
        acc[key] = { ...it, quantity: toNumber(it.quantity, 1) };
      } else {
        acc[key].quantity += toNumber(it.quantity, 1);
      }
    }
    return Object.values(acc);
  }, [cart]);

  /** 2) Totals (USD preview + KHR hint) */
  const totalUSD = useMemo(
    () =>
      mergedCartArray.reduce(
        (sum, it) => sum + usdPriceOf(it) * toNumber(it.quantity, 1),
        0
      ),
    [mergedCartArray]
  );
  const totalKHR = Math.round(totalUSD * FX);

  /** 3) UI state */
  const [localPaymentMethod, setLocalPaymentMethod] = useState(
    paymentMethod || "cash"
  );
  const [dollarAmountRaw, setDollarAmountRaw] = useState("");
  const [rielAmountRaw, setRielAmountRaw] = useState("");
  const [totalDollarChange, setTotalDollarChange] = useState(0);
  const [totalRielChange, setTotalRielChange] = useState(0);
  const [dollarError, setDollarError] = useState("");
  const [rielError, setRielError] = useState("");
  const [cardError, setCardError] = useState("");

  /** 4) Validation helpers */
  const validateAmount = (value, isDollar = false) => {
    if (!value || value.trim() === "") return "";
    const clean = value.replace(/,/g, "");
    const re = isDollar ? /^-?\d*(\.\d{0,2})?$/ : /^-?\d*$/;
    if (!re.test(clean)) return "Amount invalid";
    const val = isDollar ? parseFloat(clean) : parseInt(clean, 10);
    if (Number.isNaN(val)) return "Amount invalid";
    if (isDollar && val < totalUSD) return "Dollar is less than total";
    if (!isDollar && val < totalKHR) return "Riel is less than total";
    return "";
  };

  /** 5) Cash inputs with auto cross-fill */
  const handleDollarChange = (e) => {
    const v = e.target.value.replace(/[^\d.]/g, "");
    setDollarAmountRaw(v);

    if (!v.trim()) {
      setRielAmountRaw("");
      setTotalDollarChange(0);
      setTotalRielChange(0);
      setDollarError("");
      return;
    }

    const paidUSD = Number(v) || 0;
    const paidKHR = Math.round(paidUSD * FX);

    setRielAmountRaw(String(paidKHR));
    setTotalRielChange(paidKHR - totalKHR);
    setTotalDollarChange((paidKHR - totalKHR) / FX);
    setDollarError(validateAmount(v, true));
    setRielError("");
  };

  const handleRielChange = (e) => {
    const v = e.target.value.replace(/[^\d]/g, "");
    setRielAmountRaw(v);

    if (!v.trim()) {
      setDollarAmountRaw("");
      setTotalDollarChange(0);
      setTotalRielChange(0);
      setRielError("");
      return;
    }

    const paidKHR = Number(v) || 0;
    const paidUSD = paidKHR / FX;

    setDollarAmountRaw(paidUSD.toFixed(2));
    setTotalRielChange(paidKHR - totalKHR);
    setTotalDollarChange((paidKHR - totalKHR) / FX);
    setRielError(validateAmount(v, false));
    setDollarError("");
  };

  /** 6) Build backend-ready payload */
  const buildPayload = () => {
    const items = [];
    const sale_retail_items = [];

    for (const it of mergedCartArray) {
      const qty = Math.max(1, Math.trunc(toNumber(it.quantity, 1)));
      const unit = toNumber(it.price, 0); // keep original cart currency/number

      if (isPackageLine(it)) {
        sale_retail_items.push({
          package_id: it.package_id || it.id, // packages.id
          quantity: qty,
          unit_price: unit, // same currency you post for normal items
        });
      } else {
        items.push({
          medicine_id: it.medicine_id || it.id, // medicines.id
          quantity: qty,
          unit_price: unit,
        });
      }
    }

    return {
      sale_date: new Date().toISOString().slice(0, 10),
      payment_method: localPaymentMethod, // "cash" | "aba" etc.
      ...(items.length ? { items } : {}),
      ...(sale_retail_items.length ? { sale_retail_items } : {}),
      // Optional: include paid amounts & FX for receipt/storage
      // usd_paid: Number(dollarAmountRaw || 0),
      // khr_paid: Number(rielAmountRaw || 0),
      // rate: FX,
      // card_number: localPaymentMethod !== "cash" ? String(cardNumber || "") : null,
    };
  };

  /** 7) Confirm */
  const handleConfirm = () => {
    if (localPaymentMethod === "cash") {
      // You only need one input; the other auto-fills
      if (!dollarAmountRaw && !rielAmountRaw) {
        setDollarError("Enter USD or KHR amount");
        setRielError("Enter USD or KHR amount");
        return;
      }
      if (dollarError || rielError) return;
    } else {
      const digits = String(cardNumber || "").replace(/\D/g, "");
      if (digits.length < 16) {
        setCardError("Please enter a valid 16-digit card number");
        return;
      }
      setCardError("");
    }

    const payload = buildPayload();
    onConfirm?.(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:mb-0  z-[200] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 z-10 p-5 rounded-lg max-w-md w-full font-khmer">
        <h2 className="text-xl font-bold mb-4">បញ្ជាក់ការបញ្ជាទិញ</h2>

        {mergedCartArray.length === 0 ? (
          <p className="text-center text-gray-600">កន្ត្រកទទេ!</p>
        ) : (
          <>
            {/* Cart List */}
            <ul className="space-y-2 mb-4 h-16 overflow-y-auto">
              {mergedCartArray.map((item, index) => {
                const priceInUSD = usdPriceOf(item);
                return (
                  <li
                    key={`${item.id}-${item.packaging || "default"}-${
                      isPackageLine(item) ? "pkg" : "med"
                    }`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {index + 1}.{" "}
                      {item.packaging
                        ? `${item.name} (${item.packaging})`
                        : item.name}
                    </span>
                    <span>
                      {item.quantity} x{" "}
                      {priceInUSD.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      $ ={" "}
                      {(priceInUSD * item.quantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      $
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Totals */}
            <div className="flex justify-between text-sm mb-2">
              <span>សរុប:</span>
              <span className="font-semibold">
                $
                {totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span></span>
              <span className="font-semibold">
                ៛{totalKHR.toLocaleString("en-US")}
              </span>
            </div>

            <hr className="mb-3" />

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                ប្រភេទនៃការបង់ប្រាក់
              </label>
              <select
                className="outline-none px-2 py-2 w-[200px] border rounded-md border-black"
                value={localPaymentMethod}
                onChange={(e) => setLocalPaymentMethod(e.target.value)}
              >
                <option value="cash">សាច់ប្រាក់</option>
                <option value="aba">ABA</option>
              </select>
            </div>

            {/* Cash / Riel Inputs */}
            {localPaymentMethod === "cash" ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">ប្រាក់ដែលបានបង់</label>
                  <div className="flex gap-3">
                    <div className="border flex items-center">
                      <input
                        type="text"
                        value={dollarAmountRaw}
                        onChange={handleDollarChange}
                        placeholder="ប្រាក់ដុល្លារ"
                        className="w-full p-2 border-none focus:outline-none rounded-lg"
                      />
                      <label className="text-sm p-2">$</label>
                    </div>

                    <div className="border flex items-center">
                      <input
                        type="text"
                        value={rielAmountRaw}
                        onChange={handleRielChange}
                        placeholder="ប្រាក់រៀល"
                        className="w-full p-2 border-none focus:outline-none rounded-lg"
                      />
                      <label className="text-sm p-2">៛</label>
                    </div>
                  </div>
                  {dollarError && (
                    <p className="text-red-600 text-sm mt-1">{dollarError}</p>
                  )}
                  {rielError && (
                    <p className="text-red-600 text-sm mt-1">{rielError}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">ប្រាក់នៅសល់</label>
                  <div className="flex gap-3">
                    <div className="border flex items-center">
                      <input
                        type="text"
                        value={totalDollarChange.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        readOnly
                        className="w-full p-2 border-none focus:outline-none rounded-lg text-center"
                      />
                      <label className="text-sm p-2">$</label>
                    </div>
                    <div className="border flex items-center">
                      <input
                        type="text"
                        value={totalRielChange.toLocaleString("en-US")}
                        readOnly
                        className="w-full p-2 border-none focus:outline-none rounded-lg text-center"
                      />
                      <label className="text-sm p-2">៛</label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="block mb-1">ABA Card / Account</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/[^\d ]/g, ""))
                  }
                  placeholder="**** **** **** ****"
                  className="w-full p-2 border rounded-lg"
                />
                {cardError && (
                  <p className="text-red-600 text-sm mt-1">{cardError}</p>
                )}
              </div>
            )}

            <hr className="my-3" />

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setRielAmountRaw("");
                  setDollarAmountRaw("");
                  setCardNumber("");
                  setDollarError("");
                  setRielError("");
                  setCardError("");
                  setIsOpen(false);
                }}
                className="flex-1 rounded-lg hover:text-red-400 transition duration-200"
              >
                បោះបង់
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={
                  localPaymentMethod === "cash"
                    ? Boolean(dollarError || rielError)
                    : Boolean(cardError)
                }
              >
                បញ្ជាក់
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
