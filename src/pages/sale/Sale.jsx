import { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import ProductList from "./ProductList";
import Cart from "./Cart";
import OrderReviewModal from "./OrderReviewModal";
import CheckoutModal from "./CheckoutModal";
import RetailSaleModal from "./RetailSaleModal";
import ToastNotification from "./ToastNotification";
import compoundMedicines from "./compoundMedicines";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { getAllMedicines } from "../api/medicineService";
import { createSale } from "../api/saleService";
import "./sell.css";

const Sale = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRetailSaleOpen, setIsRetailSaleOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [isCompoundMode, setIsCompoundMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const { data } = await getAllMedicines();
      setProducts(data);
    };
    fetchMedicines();
  }, []);

  const updatedCompoundMedicines = compoundMedicines.map((medicine) => ({
    ...medicine,
    typeofmedicine: "ថ្នាំផ្សំ",
  }));

  const randomizeProducts = () => {
    const randomChoice = Math.random() < 0.5;
    const selectedProducts = randomChoice ? products : updatedCompoundMedicines;
    setCurrentProducts(selectedProducts);
    setIsCompoundMode(!randomChoice);
  };

  useEffect(() => {
    setCurrentProducts(products);
    setIsCompoundMode(false);
  }, [products]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && !item.packaging
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && !item.packaging
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
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

  const handleAddToCartClick = (product) => {
    addToCart(product);
  };

  const displayPrice = (price) => {
    if (typeof price !== "number") return 0;
    return price;
  };

  const filteredProducts = useMemo(() => {
    const safeList = Array.isArray(currentProducts) ? currentProducts : [];
    return safeList.filter((product) => {
      const name = product?.name?.toLowerCase?.() || "";
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

  // ✅ CLEAR CART
  const clearCart = () => {
    if (window.confirm("តើអ្នកប្រាកដជាចង់លុបកន្ត្រកទេ?")) {
      setCart([]);
      setToast({ message: "កន្ត្រកត្រូវបានលុប", type: "info" });
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      setToast({ message: "កន្ត្រកត្រូវបានរក្សាទុក", type: "success" });
    } catch (error) {
      setToast({
        message: "បរាជ័យក្នុងការរក្សាទុកកន្ត្រក: " + error.message,
        type: "error",
      });
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      setToast({ message: "កន្ត្រកទទេ!", type: "error" });
      return;
    }
    setIsOrderReviewModalOpen(true);
  };

  const confirmOrder = async () => {
    const saleData = {
      sale_date: new Date().toISOString().slice(0, 10),
      payment_method: paymentMethod,
      total_amount: totalPrice,
      card_number: cardNumber || null,
      items: cart.map((item) => ({
        medicine_id: item.medicine_id || item.id,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    try {
      await createSale(saleData);
      setCart([]);
      setCardNumber("");
      setIsCheckoutOpen(false);
      setIsOrderReviewModalOpen(false);
      setToast({ message: "ការបញ្ជាទិញបានជោគជ័យ!", type: "success" });
    } catch (error) {
      console.error("Sale failed:", error);
      setToast({
        message:
          "បរាជ័យក្នុងការបញ្ជាទិញ: " + (error.message || "Unknown error"),
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    randomizeProducts();
  }, []);

  /* ✅ BARCODE SCANNER LISTENER */
  useEffect(() => {
    let barcodeBuffer = "";

    const handleKeydown = (e) => {
      if (e.key === "Enter") {
        if (barcodeBuffer.length > 0) {
          console.log("📸 Barcode scanned:", barcodeBuffer);

          // ✅ Find product by barcode
          const matched = products.find(
            (p) => String(p.barcode || p.medicine_code) === barcodeBuffer
          );

          if (matched) {
            addToCart(matched);
          } else {
            setToast({
              message: `រកមិនឃើញផលិតផលសម្រាប់ Barcode: ${barcodeBuffer}`,
              type: "error",
            });
          }
        }
        barcodeBuffer = ""; // reset after enter
      } else {
        // ✅ Append key if it's a number/letter
        if (e.key.length === 1) {
          barcodeBuffer += e.key;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [products]); // reattach if products update

  return (
    <div className="flex mb-14 h-screen bg-white dark:bg-gray-900 font-khmer relative">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 sm:p-6 p-2 ">
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

          <ProductList
            products={filteredProducts}
            cart={cart}
            handleAddToCartClick={handleAddToCartClick}
            displayPrice={displayPrice}
            showCompoundMedicines={isCompoundMode}
          />
        </div>
        <Cart
          cart={cart}
          isCartOpen={isCartOpen}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
          clearCart={clearCart}
          saveCart={saveCart}
          placeOrder={placeOrder}
          displayPrice={displayPrice}
          onClose={() => setCartOpen(false)}
        />
        <button
          className="md:hidden fixed bottom-4 mb-14 flex right-0 focus:shadow-none bg-green-600 text-white p-3 rounded-md  shadow-lg"
          onClick={() => setCartOpen(true)}
          aria-label="បើកកន្ត្រក"
        >
          <HiMiniShoppingCart className="w-6 h-6" /> ({totalQuantity})
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
        confirmOrder={confirmOrder}
        displayPrice={displayPrice}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        setIsOpen={setIsCheckoutOpen}
        totalPrice={totalPrice}
        totalQuantity={totalQuantity}
        products={cart}
        confirmOrder={confirmOrder}
        storeName="ហាងម៉ូតទំនិញ"
        currency="USD"
      />
      <RetailSaleModal
        isOpen={isRetailSaleOpen}
        setIsOpen={setIsRetailSaleOpen}
        products={currentProducts}
        addToCart={addToCart}
      />
      <ToastNotification toast={toast} />
    </div>
  );
};

export default Sale;
