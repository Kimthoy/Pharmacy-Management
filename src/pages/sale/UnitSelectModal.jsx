import { useMemo, useState } from "react";

const Backdrop = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black/40 z-40"
    onClick={onClose}
    aria-hidden="true"
  />
);

// Normalize unit options from product data
function useUnitOptions(product) {
  return useMemo(() => {
    if (!product) return [];

    // 1) product.packagings (e.g., Box/Strip/Tablet with own prices)
    if (Array.isArray(product.packagings) && product.packagings.length) {
      return product.packagings.map((p) => ({
        key: p.id ?? p.name,
        label: p.name ?? "កញ្ចប់",
        price: Number(p.price ?? product.price ?? 0),
        factor: Number(p.factor ?? 1),
        package_id: p.id ?? undefined,
      }));
    }

    // 2) product.available_units (alternative structure)
    if (
      Array.isArray(product.available_units) &&
      product.available_units.length
    ) {
      return product.available_units.map((u) => ({
        key: u.key ?? u.label,
        label: u.label ?? "ឯកតា",
        price: Number(u.price ?? product.price ?? 0),
        factor: Number(u.factor ?? 1),
        package_id: u.package_id ?? undefined,
      }));
    }

    // 3) Fallback base unit
    return [
      {
        key: "base",
        label: product.base_unit_label || "ឯកតាមូលដ្ឋាន",
        price: Number(product.price ?? 0),
        factor: 1,
        package_id: undefined,
      },
    ];
  }, [product]);
}

export default function UnitSelectModal({
  isOpen,
  product,
  onConfirm,
  onClose,
}) {
  const options = useUnitOptions(product);
  const [selectedKey, setSelectedKey] = useState(
    () => options[0]?.key ?? "base"
  );
  const [qty, setQty] = useState(1);

  if (!isOpen || !product) return null;

  const selected = options.find((o) => o.key === selectedKey) ?? options[0];

  return (
    <>
      <Backdrop onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-modal-title"
        className="fixed z-50 inset-x-0 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5"
      >
        <h3 id="unit-modal-title" className="text-lg font-semibold mb-3">
          ជ្រើសរើសប្រភេទឯកតា
        </h3>

        <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {options.map((o) => (
            <label
              key={o.key}
              className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="unitOption"
                  checked={selectedKey === o.key}
                  onChange={() => setSelectedKey(o.key)}
                />
                <span className="font-medium">{o.label}</span>
              </div>
              <div className="text-sm opacity-80">
                ${Number.isFinite(o.price) ? o.price.toFixed(2) : "0.00"}
              </div>
            </label>
          ))}
          {options.length === 0 && (
            <div className="text-sm text-gray-500">
              គ្មានឯកតាសម្រាប់ទំនិញនេះទេ
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium">បរិមាណ</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 border rounded-md px-3 py-1 bg-white dark:bg-gray-900"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            បោះបង់
          </button>
          <button
            onClick={() =>
              onConfirm({ product, unit: selected, quantity: qty })
            }
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            disabled={!selected}
          >
            បន្ថែមទៅកន្ត្រក
          </button>
        </div>
      </div>
    </>
  );
}
