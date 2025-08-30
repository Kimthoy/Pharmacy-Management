import { useEffect, useState } from "react";
import { getToretailProduct } from "../api/retailStockService";
import Swal from "sweetalert2";
import api from "../api/api";
import {
  fetchPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../api/packageService";

// Khmer riel currency formatter
const formatRiel = (value) =>
  new Intl.NumberFormat("km-KH", {
    style: "currency",
    currency: "KHR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

// -------- Theme helpers (dark/light) --------
const STORAGE_KEY = "theme"; // 'dark' | 'light'
const getInitialTheme = () => {
  // 1) stored choice
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  // 2) system preference
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};
const applyThemeClass = (theme) => {
  const root = document.documentElement; // <html>
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export default function RetailProduct() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [stock, setStock] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [compounds, setCompounds] = useState([]);
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState(1);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPackageName, setEditPackageName] = useState("");
  const [editCompounds, setEditCompounds] = useState([]);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editSelected, setEditSelected] = useState("");
  const [editAmount, setEditAmount] = useState(1);

  // apply theme on mount & when it changes
  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stockData = await getToretailProduct();
    // Expect each item to include: id, quantity, tablet, capsule, price_tablet, price_capsule, medicine{medicine_name}
    setStock(stockData || []);

    const packageData = await fetchPackages();
    setPackages(packageData || []);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "តើអ្នកប្រាកដឬទេ?",
      text: "បើលុបហើយទិន្នន័យនឹងបាត់ទៅជារហូត!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "បាទ/ចាស, លុប!",
      cancelButtonText: "បោះបង់",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/packages/${id}`);
          Swal.fire("បានលុប!", "Package ត្រូវបានលុបដោយជោគជ័យ។", "success");
          loadData();
        } catch {
          Swal.fire("មានបញ្ហា!", "មិនអាចលុបបានទេ។", "error");
        }
      }
    });
  };

  const getUnitsPerBox = (item) => Number(item?.capsule ?? 0);
  const getUnitPriceKHR = (item) => Number(item?.price_capsule ?? 0);

  const addToCompound = () => {
    const item = stock.find((i) => i.id === Number(selected));
    if (!item) return;

    const unitsPerBox = getUnitsPerBox(item);
    if (unitsPerBox <= 0) {
      alert("មិនមានចំនួនឯកតាកំណត់ (tablet/capsule) សម្រាប់ស្តុកនេះទេ");
      return;
    }

    const totalUnitsAvailable = Number(item.quantity) * unitsPerBox;
    const desired = Number(amount);

    if (desired <= 0) {
      alert("ចំនួនត្រូវធំជាងសូន្យ");
      return;
    }
    if (desired > totalUnitsAvailable) {
      alert("ចំនួនលើសស្តុក");
      return;
    }

    const unitPriceKHR = getUnitPriceKHR(item);
    if (!unitPriceKHR) {
      alert("គ្មានតម្លៃ/ឯកតា (KHR) សម្រាប់ស្តុកនេះទេ");
      return;
    }

    const existing = compounds.find((c) => c.retail_stock_id === item.id);
    if (existing) {
      const newUsed = existing.used + desired;
      setCompounds(
        compounds.map((c) =>
          c.retail_stock_id === item.id
            ? {
                ...c,
                used: newUsed,
                price: existing.price,
                subtotal: newUsed * existing.price,
              }
            : c
        )
      );
    } else {
      setCompounds([
        ...compounds,
        {
          retail_stock_id: item.id,
          medicine: item.medicine,
          price: unitPriceKHR, // KHR per unit
          used: desired,
          subtotal: desired * unitPriceKHR, // KHR
        },
      ]);
    }

    setSelected("");
    setAmount(1);
  };

  const savePackage = async () => {
    if (!packageName.trim()) {
      alert("សូមបញ្ចូលឈ្មោះកញ្ចប់");
      return;
    }
    if (compounds.length === 0) {
      alert("សូមបន្ថែមថ្នាំយ៉ាងហោចណាស់មួយ");
      return;
    }

    const payload = {
      name: packageName.trim(),
      // Already KHR
      total: compounds.reduce(
        (sum, item) => sum + Number(item.subtotal || 0),
        0
      ),
      items: compounds.map((c) => ({
        retail_stock_id: c.retail_stock_id,
        used: c.used,
        subtotal: c.subtotal, // KHR
      })),
    };

    await createPackage(payload);

    setPackageName("");
    setCompounds([]);
    loadData();
  };

  // ---------------- Edit package ----------------
  const handleEdit = (pkg) => {
    setEditPackageName(pkg.name);
    // Recompute unit price from stored data (KHR)
    setEditCompounds(
      (pkg.items || []).map((it) => ({
        retail_stock_id: it.retail_stock_id,
        medicine: {
          medicine_name:
            it.retail_stock?.medicine?.medicine_name ||
            it.medicine_name ||
            it.name,
        },
        price:
          Number(it.used_quantity) > 0
            ? Number(it.subtotal) / Number(it.used_quantity)
            : 0, // KHR/unit
        used: Number(it.used_quantity),
        subtotal: Number(it.subtotal), // KHR
      }))
    );
    setEditingPackageId(pkg.id);
    setShowEditModal(true);
  };

  const addToEditCompound = () => {
    const item = stock.find((i) => i.id === Number(editSelected));
    if (!item) return;

    const unitsPerBox = getUnitsPerBox(item);
    if (unitsPerBox <= 0) {
      alert("មិនមានចំនួនឯកតាកំណត់ (tablet/capsule) សម្រាប់ស្តុកនេះទេ");
      return;
    }

    const totalUnitsAvailable = Number(item.quantity) * unitsPerBox;
    const desired = Number(editAmount);

    if (desired <= 0) {
      alert("ចំនួនត្រូវធំជាងសូន្យ");
      return;
    }
    if (desired > totalUnitsAvailable) {
      alert("ចំនួនលើសស្តុក");
      return;
    }

    const unitPriceKHR = getUnitPriceKHR(item);
    if (!unitPriceKHR) {
      alert("គ្មានតម្លៃ/ឯកតា (KHR) សម្រាប់ស្តុកនេះទេ");
      return;
    }

    const existing = editCompounds.find((c) => c.retail_stock_id === item.id);
    if (existing) {
      const newUsed = existing.used + desired;
      setEditCompounds(
        editCompounds.map((c) =>
          c.retail_stock_id === item.id
            ? {
                ...c,
                used: newUsed,
                price: existing.price,
                subtotal: newUsed * existing.price,
              }
            : c
        )
      );
    } else {
      setEditCompounds([
        ...editCompounds,
        {
          retail_stock_id: item.id,
          medicine: item.medicine,
          price: unitPriceKHR,
          used: desired,
          subtotal: desired * unitPriceKHR,
        },
      ]);
    }

    setEditSelected("");
    setEditAmount(1);
  };

  const updateQuantity = (id, newQty) => {
    const qty = Number(newQty);
    if (qty < 0) return;
    setEditCompounds(
      editCompounds.map((c) =>
        c.retail_stock_id === id
          ? { ...c, used: qty, subtotal: qty * c.price }
          : c
      )
    );
  };

  const removeCompound = (id) => {
    setEditCompounds(editCompounds.filter((c) => c.retail_stock_id !== id));
  };

  const saveEditedPackage = async () => {
    if (!editPackageName.trim()) {
      alert("សូមបញ្ចូលឈ្មោះកញ្ចប់");
      return;
    }
    if (editCompounds.length === 0) {
      alert("សូមបន្ថែមថ្នាំយ៉ាងហោចណាស់មួយ");
      return;
    }

    const payload = {
      name: editPackageName.trim(),
      total: editCompounds.reduce(
        (sum, item) => sum + Number(item.subtotal || 0),
        0
      ), // KHR
      items: editCompounds.map((c) => ({
        retail_stock_id: c.retail_stock_id,
        used: c.used,
        subtotal: c.subtotal, // KHR
      })),
    };

    try {
      await updatePackage(editingPackageId, payload);
      setShowEditModal(false);
      setEditingPackageId(null);
      setEditCompounds([]);
      setEditPackageName("");
      loadData();
    } catch (error) {
      console.error("Update failed:", error?.response?.data || error.message);
      alert("មានបញ្ហា ក្នុងពេលកែប្រែ package");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto transition-colors duration-200 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header with theme toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">ការផ្សំកញ្ចប់ថ្នាំ</h2>
      </div>

      <div className="mb-4">
        <label className="font-semibold">ឈ្មោះកញ្ចប់ថ្នាំ: </label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="ឧ. កញ្ចប់ព្យាបាលផ្តាសាយ"
          className="border p-2 rounded w-full sm:w-1/2 ml-0 sm:ml-2 bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:items-center">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded w-full sm:w-60 bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">-- ជ្រើសថ្នាំ --</option>
          {stock.map((item) => (
            <option key={item.id} value={item.id}>
              {item?.medicine?.medicine_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="ចំនួន"
          className="border p-2 rounded w-full sm:w-24 bg-white dark:bg-gray-800 dark:border-gray-700"
        />

        <button
          onClick={addToCompound}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          បន្ថែម
        </button>
      </div>

      {compounds.length > 0 && (
        <div className="overflow-y-scroll h-52 border rounded-lg dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2 dark:border-gray-700">ឈ្មោះថ្នាំ</th>
                <th className="border p-2 dark:border-gray-700">ចំនួនប្រើ</th>
                <th className="border p-2 dark:border-gray-700">តម្លៃ/ឯកតា</th>
                <th className="border p-2 dark:border-gray-700">តម្លៃសរុបរង</th>
              </tr>
            </thead>
            <tbody>
              {compounds.map((c, i) => (
                <tr
                  key={i}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                >
                  <td className="border p-2 dark:border-gray-700">
                    {c?.medicine?.medicine_name}
                  </td>
                  <td className="border p-2 text-center dark:border-gray-700">
                    {c.used}
                  </td>
                  <td className="border p-2 text-center dark:border-gray-700">
                    {formatRiel(c.price)}
                  </td>
                  <td className="border p-2 text-center dark:border-gray-700">
                    {formatRiel(c.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={savePackage}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        រក្សាទុកកញ្ចប់ថ្នាំ
      </button>

      {/* Saved Packages */}
      {packages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">កញ្ចប់ថ្នាំដែលបានរក្សាទុក</h3>
          <div className="overflow-y-scroll h-72 border rounded-lg dark:border-gray-700">
            <table className="w-full text-sm ">
              <thead className="bg-gray-100 sticky top-0 dark:bg-gray-800">
                <tr>
                  <th className="border p-2 dark:border-gray-700">
                    ឈ្មោះកញ្ចប់
                  </th>
                  <th className="border p-2 dark:border-gray-700">
                    ថ្នាំក្នុងកញ្ចប់
                  </th>
                  <th className="border p-2 dark:border-gray-700">តម្លៃសរុប</th>
                  <th className="border p-2 dark:border-gray-700">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                  >
                    <td className="border p-2 dark:border-gray-700">
                      {pkg.name}
                    </td>
                    <td className="border p-2 dark:border-gray-700">
                      {(pkg.items || []).map((it, idx) => (
                        <div key={idx}>
                          {it.retail_stock?.medicine?.medicine_name} –{" "}
                          {it.used_quantity} គ្រាប់
                        </div>
                      ))}
                    </td>
                    <td className="border p-2 text-center dark:border-gray-700">
                      {formatRiel(pkg.total_price)}
                    </td>
                    <td className="border p-2 text-center dark:border-gray-700">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        កែប្រែ
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        លុប
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">កែប្រែកញ្ចប់</h2>

            <div className="mb-4">
              <label className="font-semibold">ឈ្មោះកញ្ចប់ថ្នាំ: </label>
              <input
                type="text"
                value={editPackageName}
                onChange={(e) => setEditPackageName(e.target.value)}
                className="border p-2 rounded w-full md:w-1/2 ml-0 md:ml-2 bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            {/* Add medicine in edit modal */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 md:items-center">
              <select
                value={editSelected}
                onChange={(e) => setEditSelected(e.target.value)}
                className="border p-2 rounded w-full md:w-60 bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">-- ជ្រើសថ្នាំ --</option>
                {stock.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item?.medicine?.medicine_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={editAmount}
                min={1}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                placeholder="ចំនួន"
                className="border p-2 rounded w-full md:w-24 bg-white dark:bg-gray-800 dark:border-gray-700"
              />

              <button
                onClick={addToEditCompound}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                បន្ថែម
              </button>
            </div>

            {editCompounds.length > 0 && (
              <div className="overflow-x-auto border rounded-lg dark:border-gray-700 mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="border p-2 dark:border-gray-700">
                        ឈ្មោះថ្នាំ
                      </th>
                      <th className="border p-2 dark:border-gray-700">
                        ចំនួនប្រើ
                      </th>
                      <th className="border p-2 dark:border-gray-700">
                        តម្លៃ/ឯកតា
                      </th>
                      <th className="border p-2 dark:border-gray-700">
                        តម្លៃសរុបរង
                      </th>
                      <th className="border p-2 dark:border-gray-700">
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {editCompounds.map((c, i) => (
                      <tr
                        key={i}
                        className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                      >
                        <td className="border p-2 dark:border-gray-700">
                          {c?.medicine?.medicine_name}
                        </td>
                        <td className="border p-2 text-center dark:border-gray-700">
                          <input
                            type="number"
                            value={c.used}
                            min={1}
                            onChange={(e) =>
                              updateQuantity(
                                c.retail_stock_id,
                                Number(e.target.value)
                              )
                            }
                            className="border w-20 text-center bg-white dark:bg-gray-800 dark:border-gray-700"
                          />
                        </td>
                        <td className="border p-2 text-center dark:border-gray-700">
                          {formatRiel(c.price)}
                        </td>
                        <td className="border p-2 text-center dark:border-gray-700">
                          {formatRiel(c.subtotal)}
                        </td>
                        <td className="border p-2 text-center dark:border-gray-700">
                          <button
                            onClick={() => removeCompound(c.retail_stock_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                          >
                            លុប
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                បោះបង់
              </button>
              <button
                onClick={saveEditedPackage}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
