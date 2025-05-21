import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProductList from "./ProductList";
import Cart from "./Cart";
import OrderReviewModal from "./OrderReviewModal";
import CheckoutModal from "./CheckoutModal";
import ToastNotification from "./ToastNotification";
import compoundMedicines from "./compoundMedicines";

const Sale = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [rielAmount, setRielAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [isCompoundMode, setIsCompoundMode] = useState(false);

  const exchangeRate = 4050;

  const regularProducts = [
    {
      id: 1,
      name: "ថ្នាំក្អក",
      price: 1.25,
      image:
        "https://th.bing.com/th/id/OIP.ljUSqIK7CFM9CZGAAb0cGgHaFy?w=278&h=217&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      hasBottle: true,
      typeofmedicine: "ប្រអប់",
    },
    {
      id: 2,
      name: "វីតាមីន C",
      price: 2.5,
      image:
        "https://th.bing.com/th/id/R.c068130b57bc509fd0f85bd9ce1b5aca?rik=APU1%2bXfEr8SQBQ&pid=ImgRaw&r=0",
      hasBottle: false,
      typeofmedicine: "បន្ទះ",
    },
    {
      id: 3,
      name: "អាស្ពីរីន",
      price: 0.8,
      image:
        "https://th.bing.com/th/id/OIP.m7dTJT4Mo3Y8Wr0TKwt8sgHaHa?w=800&h=800&rs=1&pid=ImgDetMain",
      hasBottle: true,
      typeofmedicine: "ដប",
    },
    {
      id: 4,
      name: "ថ្នាំបំបាត់ការឈឺចាប់",
      price: 1.2,
      image:
        "https://edrug-online.com/wp-content/uploads/2020/06/Paracetamol-Dosage.jpg",
      hasBottle: false,
      typeofmedicine: "ប្រអប់",
    },
    {
      id: 5,
      name: "វីតាមីន D",
      price: 5.0,
      image:
        "https://th.bing.com/th/id/R.0f5d3bb4626be26530d545a525af630c?rik=77RaYpK340tQZQ&pid=ImgRaw&r=0&sres=1&sresct=1",
      hasBottle: true,
      typeofmedicine: "ថ្នាំធម្មតា",
    },
    {
      id: 6,
      name: "ថ្នាំប្រឆាំងនឹងអាឡែស៊ី",
      price: 0.9,
      image:
        "https://th.bing.com/th/id/OIP.F1gIKLr0bGqvir5qjXrjuQHaHa?w=172&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      hasBottle: false,
      typeofmedicine: "ថ្នាំធម្មតា",
    },
  ];

  const updatedCompoundMedicines = compoundMedicines.map((medicine) => ({
    ...medicine,
    typeofmedicine: "ថ្នាំផ្សំ",
  }));

  const randomizeProducts = () => {
    const randomChoice = Math.random() < 0.5;
    const selectedProducts = randomChoice
      ? regularProducts
      : updatedCompoundMedicines;
    setCurrentProducts(selectedProducts);
    setIsCompoundMode(!randomChoice);
  };

  useEffect(() => {
    setCurrentProducts(regularProducts);
  }, []);

  const handleAddToCartClick = (product) => {
    addToCart(product);
  };

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
          quantity: 1,
          typeofmedicine:
            product.typeofmedicine ||
            (isCompoundMode ? "ថ្នាំផ្សំ" : "ថ្នាំធម្មតា"),
        },
      ];
    });
    setToast({
      message: `${product.name} ត្រូវបានបន្ថែមទៅកន្ត្រក`,
      type: "success",
    });
  };

  const displayPrice = (price) => {
    if (typeof price !== "number") return 0;
    return price; // Always in USD, no conversion needed
  };

  const filteredProducts = useMemo(
    () =>
      currentProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [currentProducts, searchQuery]
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + displayPrice(item.price) * (item.quantity || 1),
    0
  );
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const calculateChangeInUSD = () => {
    if (!rielAmount || isNaN(rielAmount)) return 0;
    const paidInUSD = parseFloat(rielAmount) / exchangeRate;
    const change = paidInUSD - totalPrice;
    return change > 0 ? change : 0;
  };

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

  const confirmOrder = () => {
    if (paymentMethod === "cash") {
      const paidInUSD = parseFloat(rielAmount) / exchangeRate;
      if (isNaN(paidInUSD) || paidInUSD < totalPrice) {
        setToast({ message: "ចំនួនប្រាក់មិនគ្រប់គ្រាន់!", type: "error" });
        return;
      }
    }
    if (paymentMethod === "card" && (!cardNumber || cardNumber.length < 16)) {
      setToast({
        message: "សូមបញ្ចូលលេខកាត MasterCard ត្រឹមត្រូវ!",
        type: "error",
      });
      return;
    }
    setCart([]);
    setRielAmount("");
    setCardNumber("");
    setIsCheckoutOpen(false);
    setIsOrderReviewModalOpen(false);
    setToast({ message: "ការបញ្ជាទិញបានជោគជ័យ!", type: "success" });
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

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar totalQuantity={totalQuantity} />
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 p-6 overflow-auto">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            randomizeProducts={randomizeProducts}
            isCompoundMode={isCompoundMode}
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
          setIsCartOpen={setIsCartOpen}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
          clearCart={clearCart}
          saveCart={saveCart}
          placeOrder={placeOrder}
          displayPrice={displayPrice}
        />
        <button
          className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsCartOpen(true)}
          aria-label="បើកកន្ត្រក"
        >
          🛒 ({totalQuantity})
        </button>
      </div>
      <OrderReviewModal
        isOpen={isOrderReviewModalOpen}
        setIsOpen={setIsOrderReviewModalOpen}
        cart={cart}
        totalPrice={totalPrice}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        rielAmount={rielAmount}
        setRielAmount={setRielAmount}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        calculateChangeInUSD={calculateChangeInUSD}
        confirmOrder={confirmOrder}
        displayPrice={displayPrice}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        setIsOpen={setIsCheckoutOpen}
        totalPrice={totalPrice}
        totalQuantity={totalQuantity}
        confirmOrder={confirmOrder}
      />
      <ToastNotification toast={toast} />
    </div>
  );
};

export default Sale;
