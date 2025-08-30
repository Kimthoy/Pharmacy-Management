import React, { useEffect, useState } from "react";
import { fetchPackages } from "../api/packageService";

const formatPriceKHR = (num) =>
  num ? `KHR ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "KHR 0";

const SaleRetail = () => {
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await fetchPackages();
        setPackages(data);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const addToCart = (pkg) => {
    setCart([...cart, { ...pkg, qty: 1 }]);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-3">📦 បញ្ជីកញ្ចប់ថ្នាំ</h2>

      {loading ? (
        <p>កំពុងដំណើរការ...</p>
      ) : (
        <table className="w-full border-collapse mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">ឈ្មោះកញ្ចប់</th>
              <th className="border p-2 text-left">ថ្នាំក្នុងកញ្ចប់</th>
              <th className="border p-2 text-right">តម្លៃសរុប</th>
              <th className="border p-2 text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="border p-2">{pkg.name}</td>
                <td className="border p-2">
                  {pkg.items && pkg.items.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {pkg.items.map((item, idx) => (
                        <li key={idx}>
                          {item.retail_stock?.medicine?.name} – {item.quantity}{" "}
                          ក្រាម
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">គ្មានទិន្នន័យ</span>
                  )}
                </td>
                <td className="border p-2 text-right">
                  {formatPriceKHR(pkg.total_price)}
                </td>
                <td className="border p-2 text-center space-x-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    កែប្រែ
                  </button>
                  <button
                    onClick={() => addToCart(pkg)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    បន្ថែមទៅកន្ត្រក
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🛒 Cart */}
      <h3 className="font-semibold mb-2">🛒 ការលក់</h3>
      {cart.length === 0 ? (
        <p className="text-gray-500">មិនទាន់មានទំនិញ</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ឈ្មោះកញ្ចប់</th>
              <th className="border p-2">តម្លៃ (៛)</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">សរុប (៛)</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">
                  {formatPriceKHR(item.total_price)}
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={item.qty}
                    min={1}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 1;
                      setCart((prev) =>
                        prev.map((c, i) =>
                          i === idx ? { ...c, qty: newQty } : c
                        )
                      );
                    }}
                    className="w-16 border rounded text-center"
                  />
                </td>
                <td className="border p-2 text-right">
                  {formatPriceKHR(item.total_price * item.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SaleRetail;
