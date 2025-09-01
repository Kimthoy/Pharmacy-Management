// src/pages/sale/Sale.jsx
import { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import ProductList from "./ProductList";
import Cart from "./Cart";
import OrderReviewModal from "./OrderReviewModal";
import RetailSaleModal from "./RetailSaleModal";
import ToastNotification from "./ToastNotification";
import compoundMedicines from "./compoundMedicines";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { getAllMedicines } from "../api/medicineService";
import { createSale, buildSalePayload } from "../api/saleService";
import UnitSelectModal from "./UnitSelectModal";
import BarcodeScanModal from "./BarcodeScanModal";
import { BsUpcScan } from "react-icons/bs";

import "./sell.css";

const Sale = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [forceHideCart, setForceHideCart] = useState(false);
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isRetailSaleOpen, setIsRetailSaleOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [isCompoundMode, setIsCompoundMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [unitModal, setUnitModal] = useState({ open: false, product: null });
  const [isScanOpen, setIsScanOpen] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getAllMedicines();
        const data = Array.isArray(response) ? response : response?.data ?? [];
        setProducts(data);
      } catch (err) {
        setProducts([]);
        setToast({
          message: "បរាជ័យក្នុងការទាញទិន្នន័យថ្នាំ",
          type: "error",
        });
      }
    };
    fetchMedicines();
  }, []);

  const updatedCompoundMedicines = compoundMedicines.map((medicine) => ({
    ...medicine,
    typeofmedicine: "ថ្នាំផ្សំ",
  }));

  useEffect(() => {
    setCurrentProducts(products);
    setIsCompoundMode(false);
  }, [products]);

  // Add base product instantly
  const addToCart = (product) => {
    setCart((prev) => {
      const pid = product.id ?? product.medicine_id;
      const existingItem = prev.find(
        (item) => item.id === pid && !item.packaging
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === pid && !item.packaging
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          id: pid,
          image: product.image || product.image_url || null,
          name: product.medicine_name || product.name,
          quantity: product.quantity || 1,
          typeofmedicine:
            product.typeofmedicine ||
            (isCompoundMode ? "ថ្នាំផ្សំ" : "ថ្នាំធម្មតា"),
        },
      ];
    });

    setToast({
      message: `${
        product.medicine_name || product.name
      } ត្រូវបានបន្ថែមទៅកន្ត្រក`,
      type: "success",
    });
  };

  // Add with unit/packaging
  const addToCartWithUnit = ({ product, unit, quantity }) => {
    const price = Number(unit?.price ?? product.price ?? 0);
    const id = product.id ?? product.medicine_id;
    const nameBase = product.medicine_name || product.name || "ផលិតផល";

    setCart((prev) => {
      const matchIdx = prev.findIndex(
        (item) =>
          item.id === id &&
          (item.package_id ?? null) === (unit?.package_id ?? null) &&
          (item.packaging ?? "base") === (unit?.key ?? "base")
      );

      if (matchIdx > -1) {
        const next = [...prev];
        const existing = next[matchIdx];
        next[matchIdx] = {
          ...existing,
          quantity: (existing.quantity || 1) + (quantity || 1),
        };
        return next;
      }

      return [
        ...prev,
        {
          ...product,
          id,
          image: product.image || product.image_url || null,
          name: `${nameBase} (${unit?.label || "ឯកតា"})`,
          quantity: quantity || 1,
          price,
          packaging: unit?.key ?? "base",
          package_id: unit?.package_id ?? null,
          typeofmedicine:
            product.typeofmedicine ||
            (isCompoundMode ? "ថ្នាំផ្សំ" : "ថ្នាំធម្មតា"),
        },
      ];
    });

    setToast({
      message: `${nameBase} (${unit?.label || "ឯកតា"}) ត្រូវបានបន្ថែមទៅកន្ត្រក`,
      type: "success",
    });
  };

  // Manual click → instant add
  const handleAddToCartClick = (product) => {
    addToCart(product);
  };

  const displayPrice = (price) => (typeof price === "number" ? price : 0);

  const filteredProducts = useMemo(() => {
    const safeList = Array.isArray(currentProducts) ? currentProducts : [];
    return safeList.filter((product) => {
      const name =
        product?.name?.toLowerCase?.() ||
        product?.medicine_name?.toLowerCase?.() ||
        "";
      return name.includes(searchQuery.toLowerCase());
    });
  }, [currentProducts, searchQuery]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + displayPrice(item.price) * (item.quantity || 1),
    0
  );
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const clearCart = () => {
    if (window.confirm("តើអ្នកប្រាកដជាចង់លុបកន្ត្រកទេ?")) {
      setCart([]);
      setToast({ message: "កន្ត្រកត្រូវបានលុប", type: "info" });
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      setToast({ message: "កន្ត្រកទទេ!", type: "error" });
      return;
    }
    setIsOrderReviewModalOpen(true);
  };

  const isPackageLine = (it) =>
    Boolean(it.package_id) || String(it.typeofmedicine || "").includes("ផ្សំ");

  const confirmOrder = async () => {
    const normalItems = cart
      .filter((it) => !isPackageLine(it))
      .map((it) => ({
        medicine_id: it.medicine_id || it.id,
        quantity: Number(it.quantity || 1),
        unit_price: Number(displayPrice(it.price)),
      }));

    const saleRetailItems = cart
      .filter((it) => isPackageLine(it))
      .map((it) => ({
        package_id: it.package_id || it.id,
        quantity: Number(it.quantity || 1),
        unit_price: Number(displayPrice(it.price)),
      }));

    const payload = buildSalePayload({
      saleDate: new Date().toISOString().slice(0, 10),
      paymentMethod,
      items: normalItems,
      saleRetailItems,
    });

    try {
      await createSale(payload);
      setCart([]);
      setCardNumber("");
      setIsOrderReviewModalOpen(false);
      setToast({ message: "ការបញ្ជាទិញបានជោគជ័យ!", type: "success" });
    } catch (error) {
      setToast({
        message:
          "បរាជ័យក្នុងការបញ្ជាទិញ: " + (error.message || "Unknown error"),
        type: "error",
      });
    }
  };

  // auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Keyboard scanner (USB)
  useEffect(() => {
    let buffer = "";
    const handleKeydown = (e) => {
      if (e.key === "Enter") {
        if (buffer.length > 0) {
          const matched = products.find(
            (p) => String(p.barcode || p.medicine_code) === buffer
          );
          if (matched) {
            setUnitModal({ open: true, product: matched });
          } else {
            setToast({
              message: `រកមិនឃើញផលិតផលសម្រាប់ Barcode: ${buffer}`,
              type: "error",
            });
          }
        }
        buffer = "";
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [products]);

  // Camera scanner
  const handleBarcodeDetected = (codeText) => {
    const raw = products.find(
      (p) => String(p.barcode || p.medicine_code) === String(codeText)
    );

    if (!raw) {
      setToast({
        message: `រកមិនឃើញផលិតផលសម្រាប់ Barcode: ${codeText}`,
        type: "error",
      });
      return;
    }

    const hasUnits =
      (raw.packagings && raw.packagings.length > 0) ||
      (raw.available_units && raw.available_units.length > 0);

    if (hasUnits) {
      setUnitModal({ open: true, product: raw });
    } else {
      addToCart(raw);
    }

    setIsScanOpen(false);
  };

  return (
    <div className="flex h-[426px] bg-white dark:bg-gray-900 font-khmer relative">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 overflow-y-scroll h-full sm:p-6">
          <div className="sm:sticky sticky sm:-top-6 -top-0 sm:z-30 z-30">
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isCompoundMode={isCompoundMode}
              setCompoundModeType={(type) => {
                const isCompound = type === "compound";
                setCurrentProducts(
                  isCompound ? updatedCompoundMedicines : products
                );
                setIsCompoundMode(isCompound);
              }}
              openRetailSaleModal={() => setIsRetailSaleOpen(true)}
            />
          </div>

          <ProductList
            products={filteredProducts}
            cart={cart}
            handleAddToCartClick={handleAddToCartClick}
            displayPrice={displayPrice}
            showCompoundMedicines={isCompoundMode}
            closeCart={() => setCartOpen(false)}
            forceHideCart={(v) => setForceHideCart(Boolean(v))}
          />
        </div>

        <div>
          {!isOrderReviewModalOpen && !isRetailSaleOpen && (
            <Cart
              cart={cart}
              open={isCartOpen}
              clearCart={clearCart}
              placeOrder={placeOrder}
              onClose={() => setCartOpen(false)}
              onCheckout={() => setCartOpen(false)}
              forceHidden={forceHideCart}
            />
          )}
        </div>

        {/* Floating buttons */}
        {!isCartOpen && (
          <button
            className="sm:hidden fixed flex bottom-4 right-0 mb-14 bg-green-600 text-white p-2 rounded-md shadow-lg z-[150]"
            onClick={() => setCartOpen(true)}
          >
            <HiMiniShoppingCart className="w-6 h-6" /> ({totalQuantity})
          </button>
        )}
        <button
          className="sm:hidden fixed bottom-36 right-0 z-[200] bg-white dark:bg-gray-800 border shadow-lg rounded-full p-3"
          onClick={() => setIsScanOpen(true)}
        >
          <BsUpcScan className="w-6 h-6 text-green-600" />
        </button>
      </div>

      <OrderReviewModal
        isOpen={isOrderReviewModalOpen}
        setIsOpen={setIsOrderReviewModalOpen}
        cart={cart}
        totalPrice={totalPrice}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        onConfirm={confirmOrder}
        displayPrice={displayPrice}
      />

      <RetailSaleModal
        isOpen={isRetailSaleOpen}
        setIsOpen={setIsRetailSaleOpen}
        products={currentProducts}
        addToCart={addToCart}
      />

      <UnitSelectModal
        isOpen={unitModal.open}
        product={unitModal.product}
        onClose={() => setUnitModal({ open: false, product: null })}
        onConfirm={({ product, unit, quantity }) => {
          addToCartWithUnit({ product, unit, quantity });
          setUnitModal({ open: false, product: null });
        }}
      />

      <BarcodeScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onDetected={handleBarcodeDetected}
      />

      <ToastNotification toast={toast} />
    </div>
  );
};

export default Sale;
