import React, { useEffect, useState } from "react";
import { fetchPackages, updatePackage } from "../api/packageService";
import { getToretailProduct } from "../api/retailStockService";

// Khmer price formatting (no decimals)
const formatKHR = (num) =>
  num == null ? "" : `KHR ${Number(num).toLocaleString("en-US")}`;

// choose unit price from a retail stock row
const getUnitPrice = (stock) => stock?.price_capsule ?? 0;

const MedicineTable = ({
  handleAddToCartClick,
  currency = "៛",
  isOpen,
  setIsOpen,
}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Edit modal state ----
  const [showEdit, setShowEdit] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [editName, setEditName] = useState("");
  const [editItems, setEditItems] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [saving, setSaving] = useState(false);

  // ---- Quick sell (qty/price before add) modal state ----
  const [showBuy, setShowBuy] = useState(false);
  const [buyPkg, setBuyPkg] = useState(null);
  const [buyQty, setBuyQty] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);

  // Load packages
  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetchPackages();
      setPackages(res || []);
    } catch (err) {
      console.error("Failed to fetch packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // ---------------- Add to cart (used by quick sell confirm) ----------------
  const addPackageToCart = (pkg, qty, price) => {
    handleAddToCartClick({
      id: pkg.id,
      name: pkg.name,
      image: pkg.image || null,
      price: Number(price) || 0, // price per package
      currency: "KHR",
      quantity: Math.max(1, Number(qty) || 1),
      typeofmedicine: "ថ្នាំផ្សំ",
      packaging: true,
    });
  };

  // ---------------- Open quick sell modal ----------------
  const openBuy = (pkg) => {
    // close cart drawer if present
    if (typeof setIsOpen === "function") setIsOpen(false);

    setBuyPkg(pkg);
    setBuyQty(1);
    setBuyPrice(pkg.unit_price ?? pkg.total_price ?? 0);
    setShowBuy(true);
  };
  const closeBuy = () => {
    setShowBuy(false);
    setBuyPkg(null);
  };

  // lock scroll while ANY modal is open
  const anyModalOpen = showEdit || showBuy;
  useEffect(() => {
    if (anyModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [anyModalOpen]);

  // ---------- Edit package handlers ----------
  const openEdit = async (pkg) => {
    if (typeof setIsOpen === "function") setIsOpen(false);

    setEditingPkg(pkg);
    setEditName(pkg.name || "");
    const mapped =
      (pkg.items || []).map((it) => {
        const used = Number(it.used_quantity ?? it.used ?? 0);
        const price = it.subtotal && used > 0 ? Number(it.subtotal) / used : 0;
        const medicineName =
          it?.retail_stock?.medicine?.medicine_name ||
          it?.medicine_name ||
          it?.name ||
          "—";
        return {
          retail_stock_id: it.retail_stock_id ?? it.retail_stock?.id ?? it.id,
          medicineName,
          price,
          used,
          subtotal: price * used,
        };
      }) || [];
    setEditItems(mapped);

    try {
      const s = await getToretailProduct();
      setStocks(s || []);
    } catch (e) {
      console.error("Failed to load retail stocks", e);
      setStocks([]);
    }

    setSelectedStockId("");
    setAddQty(1);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditingPkg(null);
    setEditItems([]);
    setSelectedStockId("");
    setAddQty(1);
  };

  const addLine = () => {
    const id = parseInt(selectedStockId, 10);
    if (!id) return;
    const stock = stocks.find((s) => s.id === id);
    if (!stock) return;

    const price = getUnitPrice(stock);
    const name = stock?.medicine?.medicine_name ?? stock?.medicine_name ?? "—";

    const exist = editItems.find((x) => x.retail_stock_id === id);
    if (exist) {
      const nextUsed = exist.used + Number(addQty || 0);
      setEditItems((arr) =>
        arr.map((x) =>
          x.retail_stock_id === id
            ? { ...x, used: nextUsed, subtotal: nextUsed * price }
            : x
        )
      );
    } else {
      setEditItems((arr) => [
        ...arr,
        {
          retail_stock_id: id,
          medicineName: name,
          price: Number(price) || 0,
          used: Number(addQty || 0),
          subtotal: (Number(addQty || 0) || 0) * (Number(price) || 0),
        },
      ]);
    }
    setSelectedStockId("");
    setAddQty(1);
  };

  const updateQty = (id, val) => {
    const qty = Math.max(0, Number(val || 0));
    setEditItems((arr) =>
      arr.map((x) =>
        x.retail_stock_id === id
          ? { ...x, used: qty, subtotal: qty * (x.price || 0) }
          : x
      )
    );
  };

  const removeLine = (id) => {
    setEditItems((arr) => arr.filter((x) => x.retail_stock_id !== id));
  };

  const totalKHR = editItems.reduce((s, x) => s + (x.subtotal || 0), 0);

  const saveEdit = async () => {
    if (!editingPkg) return;
    if (!editName.trim()) {
      alert("សូមបញ្ចូលឈ្មោះកញ្ចប់");
      return;
    }
    if (editItems.length === 0) {
      alert("សូមបន្ថែមថ្នាំយ៉ាងហោចណាស់មួយ");
      return;
    }

    const payload = {
      name: editName.trim(),
      total: totalKHR, // server expects total in KHR
      items: editItems.map((x) => ({
        retail_stock_id: x.retail_stock_id,
        used: x.used,
        subtotal: x.subtotal,
      })),
    };

    try {
      setSaving(true);
      await updatePackage(editingPkg.id, payload);
      closeEdit();
      await reload();
    } catch (e) {
      console.error("Update package failed", e);
      alert(e?.response?.data?.message || "មានបញ្ហា ក្នុងពេលកែប្រែកញ្ចប់");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">កំពុងទាញទិន្នន័យ...</p>;

  return (
    <div className="w-full mb-14 z-10 overflow-x-auto">
      <table className="sm:w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-600 p-2  dark:text-gray-300 text-center">
              ឈ្មោះកញ្ចប់
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2  dark:text-gray-300 text-center">
              តម្លៃសរុប ({currency})
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2  dark:text-gray-300 text-center">
              សកម្មភាព
            </th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="border border-gray-300 dark:border-gray-600 p-4 dark:text-gray-300 text-center">
                {pkg.name}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-4 dark:text-gray-300 text-center">
                {formatKHR(pkg.total_price)} {currency}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-4 flex gap-2 justify-center">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => openEdit(pkg)}
                >
                  កែប្រែ
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => openBuy(pkg)} // ✅ open qty/price modal first
                >
                  បន្ថែមទៅកន្ត្រក
                </button>
              </td>
            </tr>
          ))}
          {packages.length === 0 && (
            <tr>
              <td
                className="border border-gray-300 dark:border-gray-600 p-4 text-center text-gray-500 dark:text-gray-400"
                colSpan={3}
              >
                គ្មានទិន្នន័យ
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- Quick Sell Modal (Qty & Price) ---------- */}
      {showBuy && buyPkg && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg w-full sm:max-w-md max-w-sm shadow-xl">
            <div className="p-5 border-b">
              <h3 className="text-xl font-semibold">កំណត់ចំនួន និងតម្លៃ</h3>
              <p className="text-gray-500 text-sm mt-1">{buyPkg.name}</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">ចំនួន</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded px-3 py-2 text-center"
                    value={buyQty}
                    onChange={(e) =>
                      setBuyQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    តម្លៃ/កញ្ចប់ (KHR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded px-3 py-2 text-center"
                    value={buyPrice}
                    onChange={(e) =>
                      setBuyPrice(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="font-medium">សរុប</span>
                <span className="font-semibold">
                  {formatKHR((Number(buyQty) || 0) * (Number(buyPrice) || 0))}
                </span>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeBuy}
              >
                បោះបង់
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  addPackageToCart(buyPkg, buyQty, buyPrice);
                  closeBuy();
                }}
              >
                បន្ថែមទៅកន្ត្រក
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Edit Modal ---------- */}
      {showEdit && (
        <div className="fixed  inset-0 sm:mt-20 mt-0 bg-black/40 flex items-center justify-center ">
          <div className="bg-white rounded-lg h-[90%] w-[95%] overflow-y-scroll sm:max-w-xl max-w-lg shadow-xl">
            <div className="p-5 border-b">
              <h3 className="text-xl font-semibold">កែប្រែកញ្ចប់</h3>
            </div>

            <div className="sm:p-5 p-2 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">ឈ្មោះកញ្ចប់</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="ឧ. កញ្ចប់ព្យាបាលផ្តាសាយ"
                  />
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">ជ្រើសថ្នាំ</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedStockId}
                    onChange={(e) => setSelectedStockId(e.target.value)}
                  >
                    <option value="">-- ជ្រើសរើស --</option>
                    {stocks.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s?.medicine?.medicine_name} (
                        {formatKHR(getUnitPrice(s))})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ width: 110 }}>
                  <label className="block text-sm mb-1">ចំនួន</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded px-3 py-2 text-center"
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                  />
                </div>

                <button
                  className="h-10 px-4 rounded bg-blue-600 text-white"
                  onClick={addLine}
                >
                  បន្ថែម
                </button>
              </div>

              <div className="overflow-x-auto ">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">ឈ្មោះថ្នាំ</th>
                      <th className="border p-2 text-center">ចំនួនប្រើ</th>
                      <th className="border p-2 text-center">តម្លៃ/គ្រាប់</th>
                      <th className="border p-2 text-center">តម្លៃសរុប</th>
                      <th className="border p-2 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editItems.map((row) => (
                      <tr key={row.retail_stock_id}>
                        <td className="border p-2">{row.medicineName}</td>
                        <td className="border p-2 text-center">
                          <input
                            type="number"
                            className="border rounded w-20 text-center"
                            min="0"
                            value={row.used}
                            onChange={(e) =>
                              updateQty(row.retail_stock_id, e.target.value)
                            }
                          />
                        </td>
                        <td className="border p-2 text-center">
                          {formatKHR(row.price)}
                        </td>
                        <td className="border p-2 text-center">
                          {formatKHR(row.subtotal)}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => removeLine(row.retail_stock_id)}
                          >
                            លុប
                          </button>
                        </td>
                      </tr>
                    ))}
                    {editItems.length === 0 && (
                      <tr>
                        <td
                          className="border p-3 text-center text-gray-500"
                          colSpan={5}
                        >
                          មិនទាន់មានថ្នាំបន្ថែមទេ
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {editItems.length > 0 && (
                    <tfoot>
                      <tr>
                        <td
                          className="border p-2 font-semibold text-right"
                          colSpan={3}
                        >
                          សរុប
                        </td>
                        <td className="border p-2 text-center font-semibold">
                          {formatKHR(totalKHR)}
                        </td>
                        <td className="border p-2" />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-2">
              <button
                className="px-4 py-2 text-red-500 rounded bg-gray-300"
                onClick={closeEdit}
                disabled={saving}
              >
                បោះបង់
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white"
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;
