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
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};
const applyThemeClass = (theme) => {
  const root = document.documentElement; // <html>
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
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

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stockData = await getToretailProduct();
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
    <div className="p-4 sm:p-6 max-w-6xl mx-auto transition-colors duration-200 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">ការផ្សំកញ្ចប់ថ្នាំ</h2>
      </div>

      {/* Form: name + add items */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">ឈ្មោះកញ្ចប់ថ្នាំ</label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="ឧ. កញ្ចប់ព្យាបាលផ្តាសាយ"
          className="border p-2 rounded w-full sm:w-1/2 bg-white dark:bg-gray-800 dark:border-gray-700"
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          បន្ថែម
        </button>
      </div>

      {/* Compounds list */}
      {compounds.length > 0 && (
        <>
          {/* Desktop/tablet table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto rounded-lg border dark:border-gray-700 mb-4">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-green-600 text-white dark:bg-gray-800">
                  <tr>
                    <th className="p-2 text-left">ឈ្មោះថ្នាំ</th>
                    <th className="p-2 text-center">ចំនួនប្រើ</th>
                    <th className="p-2 text-center">តម្លៃ/ឯកតា</th>
                    <th className="p-2 text-center">តម្លៃសរុបរង</th>
                  </tr>
                </thead>
                <tbody>
                  {compounds.map((c, i) => (
                    <tr
                      key={i}
                      className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                    >
                      <td className="p-2">{c?.medicine?.medicine_name}</td>
                      <td className="p-2 text-center">{c.used}</td>
                      <td className="p-2 text-center">{formatRiel(c.price)}</td>
                      <td className="p-2 text-center">
                        {formatRiel(c.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3 mb-4">
            {compounds.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
              >
                <div className="font-medium">{c?.medicine?.medicine_name}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">ចំនួនប្រើ</div>
                    <div>{c.used}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">តម្លៃ/ឯកតា</div>
                    <div>{formatRiel(c.price)}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <div className="text-gray-500">តម្លៃសរុបរង</div>
                  <div>{formatRiel(c.subtotal)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={savePackage}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full sm:w-auto"
      >
        រក្សាទុកកញ្ចប់ថ្នាំ
      </button>

      {/* Saved Packages */}
      {packages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            កញ្ចប់ថ្នាំដែលបានរក្សាទុក
          </h3>

          {/* Desktop/tablet table */}
          <div className="hidden md:block">
            <div className="overflow-y-scroll h-80 rounded-lg border dark:border-gray-700">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-green-600 text-white sticky top-0 dark:bg-gray-800">
                  <tr>
                    <th className="p-2 text-left">ឈ្មោះកញ្ចប់</th>
                    <th className="p-2 text-left">ថ្នាំក្នុងកញ្ចប់</th>
                    <th className="p-2 text-center">តម្លៃសរុប</th>
                    <th className="p-2 text-center">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                    >
                      <td className="p-2">{pkg.name}</td>
                      <td className="p-2">
                        {(pkg.items || []).map((it, idx) => (
                          <div key={idx} className="truncate">
                            {it.retail_stock?.medicine?.medicine_name} –{" "}
                            {it.used_quantity} គ្រាប់
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-center">
                        {formatRiel(pkg.total_price)}
                      </td>
                      <td className="p-2 text-center">
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

          {/* Mobile card list */}
          <div className="md:hidden space-y-3 mb-16">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg border dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
              >
                <div className="font-semibold">{pkg.name}</div>
                <div className="mt-2 text-sm">
                  <div className="text-gray-500 mb-1">ថ្នាំក្នុងកញ្ចប់</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {(pkg.items || []).map((it, idx) => (
                      <li key={idx} className="break-words">
                        {it.retail_stock?.medicine?.medicine_name} –{" "}
                        {it.used_quantity} គ្រាប់
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-sm ">
                  <span className="text-gray-500 mr-1">តម្លៃសរុប:</span>
                  <span className="font-medium">
                    {formatRiel(pkg.total_price)}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
                  >
                    កែប្រែ
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                  >
                    លុប
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-end sm:items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-lg shadow-lg p-4 sm:p-6 w-full sm:w-3/4 max-h-[92vh] overflow-y-auto border dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-4">កែប្រែកញ្ចប់</h2>

            <div className="mb-4">
              <label className="font-semibold block mb-1">
                ឈ្មោះកញ្ចប់ថ្នាំ
              </label>
              <input
                type="text"
                value={editPackageName}
                onChange={(e) => setEditPackageName(e.target.value)}
                className="border p-2 rounded w-full sm:w-1/2 bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:items-center">
              <select
                value={editSelected}
                onChange={(e) => setEditSelected(e.target.value)}
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
                value={editAmount}
                min={1}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                placeholder="ចំនួន"
                className="border p-2 rounded w-full sm:w-24 bg-white dark:bg-gray-800 dark:border-gray-700"
              />

              <button
                onClick={addToEditCompound}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                បន្ថែម
              </button>
            </div>

            {/* Desktop/tablet table */}
            {editCompounds.length > 0 && (
              <>
                <div className="hidden md:block">
                  <div className="overflow-x-auto rounded-lg border dark:border-gray-700 mb-4">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="p-2 text-left">ឈ្មោះថ្នាំ</th>
                          <th className="p-2 text-center">ចំនួនប្រើ</th>
                          <th className="p-2 text-center">តម្លៃ/ឯកតា</th>
                          <th className="p-2 text-center">តម្លៃសរុបរង</th>
                          <th className="p-2 text-center">សកម្មភាព</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editCompounds.map((c, i) => (
                          <tr
                            key={i}
                            className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                          >
                            <td className="p-2">
                              {c?.medicine?.medicine_name}
                            </td>
                            <td className="p-2 text-center">
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
                                className="border w-20 text-center bg-white dark:bg-gray-800 dark:border-gray-700 rounded"
                              />
                            </td>
                            <td className="p-2 text-center">
                              {formatRiel(c.price)}
                            </td>
                            <td className="p-2 text-center">
                              {formatRiel(c.subtotal)}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() =>
                                  removeCompound(c.retail_stock_id)
                                }
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
                </div>

                {/* Mobile card list */}
                <div className="md:hidden space-y-3 mb-12">
                  {editCompounds.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-lg border dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
                    >
                      <div className="font-medium">
                        {c?.medicine?.medicine_name}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">ចំនួនប្រើ</div>
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
                            className="mt-1 border rounded w-full text-center bg-white dark:bg-gray-800 dark:border-gray-700"
                          />
                        </div>
                        <div>
                          <div className="text-gray-500">តម្លៃ/ឯកតា</div>
                          <div>{formatRiel(c.price)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="text-gray-500">តម្លៃសរុបរង</div>
                        <div>{formatRiel(c.subtotal)}</div>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => removeCompound(c.retail_stock_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                        >
                          លុប
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded w-full sm:w-auto"
              >
                បោះបង់
              </button>
              <button
                onClick={saveEditedPackage}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded w-full sm:w-auto"
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
