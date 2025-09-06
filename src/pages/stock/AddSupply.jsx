import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { createSupply } from "../api/suppliesService";
import { getAllSupplier } from "../api/supplierService";
import { getAllMedicines } from "../api/medicineService";
import { toast } from "react-toastify";
import { useTranslation } from "../../hooks/useTranslation";
import { BsUpcScan } from "react-icons/bs";

const AddSupply = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [supply, setSupply] = useState({
    supplier_id: null,
    invoice_date: "",
    invoice_id: "",
  });

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [supplyItems, setSupplyItems] = useState([
    { medicine_id: "", supply_quantity: "", expire_date: "", unit_price: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Camera scanner state ---
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isStartingScanner, setIsStartingScanner] = useState(false);
  const quaggaRef = useRef(null);
  const lastDetectedRef = useRef({ code: "", ts: 0 });

  /* ---------------- helpers for paginated service (page, perPage) ---------------- */
  // getAllMedicines(page, perPage) -> { data, meta:{ last_page } }
  const fetchAllPagesViaArgs = async (serviceFn, perPage = 500) => {
    let page = 1;
    let last = 1;
    const out = [];
    do {
      const res = await serviceFn(page, perPage);
      const items = Array.isArray(res?.data) ? res.data : [];
      out.push(...items);
      last = res?.meta?.last_page || 1;
      page += 1;
    } while (page <= last);

    // de-dupe by id
    const seen = new Set();
    return out.filter((it) => {
      const id = it?.id;
      if (id == null || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  const asArrayLoose = (res) =>
    Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];

  /* ------------------------------ data fetch ------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Suppliers (works for {data:[]} or raw array)
        const suppliersRes = await getAllSupplier();
        const suppliers = asArrayLoose(suppliersRes);

        // Medicines: fetch ALL pages with your (page, perPage) signature
        const medicines = await fetchAllPagesViaArgs(getAllMedicines, 800);

        setSupplierOptions(
          suppliers.map((s) => ({
            value: s.id,
            label: s.company_name || s.name || `#${s.id}`,
          }))
        );

        setMedicineOptions(
          medicines.map((m) => ({
            value: m.id,
            label: m.medicine_name || m.name || `#${m.id}`,
            barcode: m.barcode ?? m.bar_code ?? m.ean ?? null,
          }))
        );
      } catch (e) {
        console.error(e);
        toast.error(t("common.fetchFailed") || "ទាញទិន្នន័យបរាជ័យ");
      }
    };
    fetchData();
  }, [t]);

  /* ------------------------------ helpers ------------------------------ */
  const handleSupplierChange = (selected) =>
    setSupply((prev) => ({ ...prev, supplier_id: selected?.value || null }));

  const handleItemChange = (index, field, value) => {
    setSupplyItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addItem = () =>
    setSupplyItems((prev) => [
      ...prev,
      { medicine_id: "", supply_quantity: "", expire_date: "", unit_price: "" },
    ]);

  const removeItem = (index) =>
    setSupplyItems((prev) => prev.filter((_, i) => i !== index));

  const handleBarcodeScan = (barcode) => {
    const codeStr = String(barcode);
    const found = medicineOptions.find(
      (m) => m.barcode != null && String(m.barcode) === codeStr
    );
    if (!found) {
      toast.error(`Barcode ${barcode} not found`);
      return;
    }

    setSupplyItems((prev) => {
      const idx = prev.findIndex((it) => it.medicine_id === found.value);
      if (idx === -1) {
        toast.success(`Added: ${found.label}`);
        return [
          ...prev,
          {
            medicine_id: found.value,
            supply_quantity: "1",
            expire_date: "",
            unit_price: "",
          },
        ];
      }
      const next = [...prev];
      next[idx].supply_quantity = String(
        (parseInt(next[idx].supply_quantity || "0", 10) || 0) + 1
      );
      toast.info(`Updated quantity for: ${found.label}`);
      return next;
    });
  };

  // USB / keyboard scanner
  useEffect(() => {
    let buffer = "";
    let timeout;
    const handleKeyPress = (e) => {
      if (timeout) clearTimeout(timeout);
      if (e.key === "Enter") {
        if (buffer) handleBarcodeScan(buffer.trim());
        buffer = "";
      } else if (e.key.length === 1) {
        buffer += e.key;
        timeout = setTimeout(() => (buffer = ""), 100);
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [medicineOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...supply, items: supplyItems };
      await createSupply(payload);
      toast.success("Supply created successfully!");
      navigate("/supplies");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Submission failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSupply((prev) => ({ ...prev, invoice_date: today }));
  }, []);

  /* ---------------------------- Quagga helpers --------------------------- */
  const isSecureOrigin = () => window.isSecureContext;

  const getRearCameraId = async () => {
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videos = devices.filter((d) => d.kind === "videoinput");
    const rear =
      videos.find((d) => /back|rear|environment/i.test(d.label || "")) ||
      videos[videos.length - 1];
    return rear?.deviceId;
  };

  const fixScannerDomSizing = () => {
    const root = document.getElementById("scanner-container");
    const video = root?.querySelector("video");
    const canvas = root?.querySelector("canvas");
    [video, canvas].forEach((el) => {
      if (!el) return;
      el.style.position = "absolute";
      el.style.inset = "0";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.objectFit = "cover";
    });
    if (video) {
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.autoplay = true;
    }
  };

  const startScanner = async () => {
    try {
      if (!isSecureOrigin()) {
        toast.error(
          "Camera requires HTTPS or http://localhost. Use HTTPS or localhost."
        );
        setIsScanOpen(false);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Your browser does not support camera access.");
        setIsScanOpen(false);
        return;
      }

      setIsStartingScanner(true);
      const Quagga = (await import("@ericblade/quagga2")).default;
      quaggaRef.current = Quagga;

      let deviceId = null;
      try {
        deviceId = await getRearCameraId();
      } catch {
        toast.error("Camera permission is required.");
        setIsStartingScanner(false);
        setIsScanOpen(false);
        return;
      }

      await Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: deviceId
              ? {
                  deviceId: { exact: deviceId },
                  aspectRatio: { ideal: 1.777 },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }
              : {
                  facingMode: { ideal: "environment" },
                  aspectRatio: { ideal: 1.777 },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
            target: document.querySelector("#scanner-container"),
            area: { top: "20%", right: "8%", left: "8%", bottom: "20%" },
          },
          locator: { patchSize: "x-large", halfSample: true },
          numOfWorkers:
            navigator.hardwareConcurrency && navigator.hardwareConcurrency > 1
              ? Math.min(4, navigator.hardwareConcurrency - 1)
              : 2,
          frequency: 10,
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "code_128_reader",
              "code_39_reader",
              "upc_reader",
              "upc_e_reader",
            ],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error(err);
            toast.error("មិនអាចចាប់ផ្តើមកាមេរ៉ាបានទេ");
            setIsScanOpen(false);
            setIsStartingScanner(false);
            return;
          }
          Quagga.start();
          setIsStartingScanner(false);
          requestAnimationFrame(fixScannerDomSizing);
        }
      );

      quaggaRef.current.onDetected((result) => {
        const code = result?.codeResult?.code;
        const now = Date.now();
        if (!code) return;
        if (
          lastDetectedRef.current.code === code &&
          now - lastDetectedRef.current.ts < 1000
        ) {
          return;
        }
        lastDetectedRef.current = { code, ts: now };
        handleBarcodeScan(code);
        stopScanner(true);
      });
    } catch (e) {
      console.error(e);
      toast.error("កំហុសកាមេរ៉ា");
      setIsScanOpen(false);
      setIsStartingScanner(false);
    }
  };

  const stopScanner = (closeModal = false) => {
    const Quagga = quaggaRef.current;
    if (Quagga) {
      try {
        Quagga.offDetected();
        Quagga.stop();
      } catch {}
    }
    if (closeModal) setIsScanOpen(false);
  };

  useEffect(() => {
    if (isScanOpen) {
      lastDetectedRef.current = { code: "", ts: 0 };
      startScanner();
      return () => stopScanner(false);
    }
  }, [isScanOpen]);

  /* ---------------------------- Scan overlay ---------------------------- */
  const ScanOverlay = () => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative w-[84%] aspect-[5/3] rounded-[14px]">
        <div className="absolute inset-0 rounded-[14px] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
        <div className="absolute inset-0 rounded-[14px] shadow-[0_0_0_3px_rgba(255,255,255,0.92)_inset]" />
        <div className="absolute left-4 right-4 top-0 h-[2px] bg-white/90 animate-scanline" />
      </div>
    </div>
  );

  /* -------------------------------- UI --------------------------------- */
  return (
    <div className="shadow-lg bg-[#FBFBFB] dark:bg-slate-900 mb-14 max-w-5xl mx-auto px-4 py-6 relative">
      <h2 className="text-lg font-bold dark:text-teal-50">
        {t("add-supply.title")}
      </h2>
      <p className="mb-4 text-gray-400">{t("add-supply.description")}</p>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 dark:text-teal-50">
              {t("add-supply.InvoiceDate")}
            </label>
            <input
              type="date"
              required
              className="border px-3 py-2 w-full"
              value={supply.invoice_date}
              onChange={(e) =>
                setSupply({ ...supply, invoice_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-teal-50">
              {t("add-supply.InvoiceID")}
            </label>
            <input
              required
              type="text"
              className="border px-3 py-2 w-full"
              value={supply.invoice_id}
              onChange={(e) =>
                setSupply({ ...supply, invoice_id: e.target.value })
              }
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2 mt-4">
          <label className="block mb-1 dark:text-teal-50">
            {t("add-supply.Supplier")}
          </label>
          <Select
            options={supplierOptions}
            required
            onChange={handleSupplierChange}
            value={
              supplierOptions.find((opt) => opt.value === supply.supplier_id) ||
              null
            }
            isClearable
          />
        </div>

        <h3 className="font-semibold mt-6 dark:text-teal-50">
          {t("add-supply.SupplyItem")}
        </h3>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-4">
          {supplyItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md p-4 bg-white dark:bg-slate-800"
            >
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.Medicine")}
                </label>
                <Select
                  required
                  classNamePrefix="react-select"
                  value={
                    medicineOptions.find(
                      (opt) => opt.value === item.medicine_id
                    ) || null
                  }
                  onChange={(selected) =>
                    handleItemChange(
                      index,
                      "medicine_id",
                      selected?.value || ""
                    )
                  }
                  options={medicineOptions}
                  placeholder="Select medicine"
                  isClearable
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.Quantity")}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  className="w-full px-3 py-2 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.supply_quantity}
                  onChange={(e) =>
                    handleItemChange(index, "supply_quantity", e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.UnitPrice")}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  className="w-full px-3 py-2 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "unit_price", e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("add-supply.ExpireDate")}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded dark:text-white dark:bg-transparent bg-white"
                  value={item.expire_date}
                  onChange={(e) =>
                    handleItemChange(index, "expire_date", e.target.value)
                  }
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  {t("add-supply.Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="min-w-full text-sm border dark:border-gray-700 bg-white dark:bg-slate-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700 text-left">
                <th className="p-2 border">{t("add-supply.Medicine")}</th>
                <th className="p-2 border">{t("add-supply.Quantity")}</th>
                <th className="p-2 border">{t("add-supply.UnitPrice")}</th>
                <th className="p-2 border">{t("add-supply.ExpireDate")}</th>
                <th className="p-2 border text-center">
                  {t("add-supply.Delete")}
                </th>
              </tr>
            </thead>
            <tbody>
              {supplyItems.map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="p-2 border">
                    <Select
                      required
                      classNamePrefix="react-select"
                      value={
                        medicineOptions.find(
                          (opt) => opt.value === item.medicine_id
                        ) || null
                      }
                      onChange={(selected) =>
                        handleItemChange(
                          index,
                          "medicine_id",
                          selected?.value || ""
                        )
                      }
                      options={medicineOptions}
                      placeholder="Select medicine"
                      isClearable
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      required
                      min={0}
                      className="w-full px-2 py-1 border rounded dark:text-white dark:bg-transparent bg-white"
                      value={item.supply_quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "supply_quantity",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      required
                      min={0}
                      className="w-full px-2 py-1 border rounded dark:text-white dark:bg-transparent bg-white"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(index, "unit_price", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      required
                      className="w-full px-2 py-1 border rounded dark:text-white dark:bg-transparent bg-white"
                      value={item.expire_date}
                      onChange={(e) =>
                        handleItemChange(index, "expire_date", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:underline"
                    >
                      {t("add-supply.Delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-md text-green-600 hover:underline rounded flex items-center gap-2 w-full sm:w-auto"
        >
          {t("add-supply.AddNew")}
        </button>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 shadow-lg text-md text-white px-6 py-2 mt-4 rounded w-full sm:w-auto"
          >
            {isLoading ? t("add-supply.Saving") : t("add-supply.Save")}
          </button>
        </div>
      </form>

      {/* Mobile scan FAB */}
      <button
        type="button"
        onClick={() => setIsScanOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-[1000] rounded-full p-4 shadow-xl bg-white dark:bg-gray-800 border"
        title="Scan barcode"
        aria-label="Scan barcode"
      >
        <BsUpcScan className="w-7 h-7 text-green-600" />
      </button>

      {/* Scanner Modal */}
      {isScanOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-11/12 max-w-md">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  ស្កេន បាកូដ
                </h3>
                <button
                  onClick={() => stopScanner(true)}
                  className="text-gray-600 hover:text-red-500 dark:text-gray-300"
                  aria-label="Close scanner"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                ចង្អុលកូដបាកូដឱ្យនៅកណ្តាលប្រអប់ស្កេន ដើម្បីបន្ថែមទៅបញ្ជី។
              </p>
            </div>

            <div className="p-3">
              <div
                id="scanner-container"
                className="relative w-full h-[75vh] max-h-[520px] rounded-lg overflow-hidden"
              >
                {/* Quagga injects <video>/<canvas> here */}
                <ScanOverlay />
                {isStartingScanner && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    Opening camera…
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => stopScanner(true)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  បិទ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupply;
