import { useEffect, useMemo, useState } from "react";

/**
 * Props:
 * - isOpen: boolean
 * - item: supply item (or null)
 * - onClose: () => void
 * - onConfirm: ({ quantity, reason }) => Promise<void> | void
 * - busy: boolean (show spinner/disable buttons while submitting)
 */
const ReturnModal = ({ isOpen, item, onClose, onConfirm, busy = false }) => {
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState("Expired - return to manufacturer");
  const [step, setStep] = useState("edit"); // 'edit' | 'confirm'
  const [err, setErr] = useState("");

  const available = useMemo(() => item?.supply_quantity ?? 0, [item]);

  useEffect(() => {
    if (!isOpen) return;
    setStep("edit");
    setErr("");
    setQty(item?.supply_quantity ?? 0);
    setReason("Expired - return to manufacturer");
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const medName =
    item?.medicine?.medicine_name || item?.medicine?.name || "Unknown Medicine";
  const expireDate = item?.expire_date
    ? new Date(item.expire_date).toLocaleDateString()
    : "No date";

  const validate = () => {
    if (!qty || qty <= 0) {
      setErr("Quantity must be greater than 0.");
      return false;
    }
    if (qty > available) {
      setErr("Quantity exceeds available stock.");
      return false;
    }
    setErr("");
    return true;
  };

  const onContinue = () => {
    if (!validate()) return;
    setStep("confirm");
  };

  const onYes = async () => {
    if (!validate()) return;
    await onConfirm({ quantity: qty, reason });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg mx-4 rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Return to Manufacturer
          </h3>
          <button
            className="text-gray-500 hover:text-red-600"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-4 space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <div>
              <span className="font-medium">Medicine:</span> {medName}
            </div>
            <div>
              <span className="font-medium">Available:</span> {available}
            </div>
            <div>
              <span className="font-medium">Expire Date:</span> {expireDate}
            </div>
          </div>

          {err && (
            <div className="px-3 py-2 rounded border bg-red-50 border-red-200 text-red-700 text-sm">
              {err}
            </div>
          )}

          {step === "edit" && (
            <>
              <div className="flex items-center gap-3">
                <label className="w-20 text-sm text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={available || 1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="w-20 text-sm text-gray-700 dark:text-gray-300">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Reason"
                />
              </div>
            </>
          )}

          {step === "confirm" && (
            <div className="p-3 rounded border bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200">
              <div className="font-semibold mb-1">
                Warning: this action will reduce stock!
              </div>
              <div className="text-sm">
                You’re about to return <b>{qty}</b> unit(s) of <b>{medName}</b>.
                This cannot be undone.
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
          {step === "edit" ? (
            <>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={onContinue}
                disabled={busy}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
              >
                Review &amp; Confirm
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("edit")}
                className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                Back
              </button>
              <button
                onClick={onYes}
                disabled={busy}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
              >
                {busy ? "Processing..." : "Yes, return"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
