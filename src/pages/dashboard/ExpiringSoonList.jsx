import { useEffect, useState } from "react";
import {
  getExpiringSoonItems,
  returnToManufacturer,
} from "../api/supplyItemService";
import ReturnModal from "./components/ReturnModal";
import { useTranslation } from "../../hooks/useTranslation";

const ExpiringSoonList = () => {
  const [expiringList, setExpiringList] = useState([]);
  const [expiredList, setExpiredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [toast, setToast] = useState({ type: "", msg: "" });

  // modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExpiringSoon = async () => {
      try {
        setLoading(true);
        const items = await getExpiringSoonItems(); // or { months:2, perPage:0 }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const soon = [];
        const expired = [];
        (Array.isArray(items) ? items : []).forEach((it) => {
          const d = it?.expire_date ? new Date(it.expire_date) : null;
          if (!d || isNaN(d)) return;
          const dd = new Date(d);
          dd.setHours(0, 0, 0, 0);
          if (dd < today) expired.push(it);
          else soon.push(it);
        });

        setExpiringList(soon);
        setExpiredList(expired);
      } catch (err) {
        setError("Failed to fetch expiring soon medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringSoon();
  }, []);

  const openReturnModal = (item) => {
    setSelectedItem(item);
    setShowReturnModal(true);
    setToast({ type: "", msg: "" });
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedItem(null);
  };

  const confirmReturn = async ({ quantity, reason }) => {
    if (!selectedItem?.id) return;
    try {
      setSubmitting(true);
      await returnToManufacturer(selectedItem.id, { quantity, reason });

      // Update table locally: decrement or remove
      setExpiringList((prev) =>
        prev
          .map((row) =>
            row.id === selectedItem.id
              ? {
                  ...row,
                  supply_quantity: (row.supply_quantity || 0) - quantity,
                }
              : row
          )
          .filter((row) => (row.supply_quantity || 0) > 0)
      );

      setToast({
        type: "success",
        msg: "Returned to manufacturer successfully.",
      });
      closeReturnModal();
    } catch (e) {
      setToast({
        type: "error",
        msg:
          e?.response?.data?.message || e?.message || "Failed to return item.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-gray-500">
          {t("expire-soon.Loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-7  dark:bg-gray-800 p-4 rounded shadow-lg">
      <h3 className="text-lg font-bold text-black dark:text-gray-200 mb-3">
        {t("expire-soon.Title")}
      </h3>

      {toast.msg && (
        <div
          className={`mb-3 px-3 py-2 rounded border ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}

      {expiringList.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{t("expire-soon.NotFound")}</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-green-600 dark:bg-gray-700 text-white dark:text-gray-200">
            <tr>
              <th className="p-2 text-left"> {t("expire-soon.Medicine")}</th>
              <th className="p-2 text-left"> {t("expire-soon.Quantity")}</th>
              <th className="p-2 text-left"> {t("expire-soon.ExpireDate")}</th>
              <th className="p-2 text-left"> {t("expire-soon.Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {expiringList.map((item) => (
              <tr
                key={item?.id ?? `${item?.medicine_id}-${item?.expire_date}`}
                className="border-b border-gray-300 dark:border-gray-700 align-top"
              >
                <td className="p-2 text-gray-700 dark:text-gray-200">
                  {item.medicine?.medicine_name || "Unknown Medicine"}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-200">
                  {item.supply_quantity ?? "N/A"}
                </td>
                <td className="p-2 text-red-600 dark:text-red-400">
                  {item?.expire_date
                    ? new Date(item.expire_date).toLocaleDateString()
                    : "No date"}
                </td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60"
                    onClick={() => openReturnModal(item)}
                    disabled={(item?.supply_quantity ?? 0) <= 0}
                  >
                    {t("expire-soon.Return")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pop modal */}
      <ReturnModal
        isOpen={showReturnModal}
        item={selectedItem}
        onClose={closeReturnModal}
        onConfirm={confirmReturn}
        busy={submitting}
      />
    </div>
  );
};

export default ExpiringSoonList;
