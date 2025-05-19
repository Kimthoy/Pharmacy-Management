import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";

const PharmacyInterface = () => {
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const exchangeRate = 4100; // 1 USD = 4100 KHR

  const products = [
    {
      id: 1,
      name: "ថ្នាំក្អក",
      price: 1.25,
      image: "https://edrug-online.com/wp-content/uploads/2020/06/Paracetamol-Dosage.jpg",
    },
    {
      id: 2,
      name: "វីតាមីន C",
      price: 2.5,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "អាស្ពីរីន",
      price: 0.8,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "ថ្នាំបំបាត់ការឈឺចាប់",
      price: 1.2,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "វីតាមីន D",
      price: 2.0,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "ថ្នាំប្រឆាំងនឹងអាឡែស៊ី",
      price: 0.9,
      image: "https://via.placeholder.com/150",
    },
  ];

  const displayPrice = (price) =>
    currency === "USD" ? price : price * exchangeRate;

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const handleQuantityChange = (id, value) => {
    const parsedValue = parseInt(value);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue,
    }));
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      const qtyToAdd = quantities[product.id] || 1;
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    setToast({
      message: `${product.name} (x${quantities[product.id] || 1}) ${t("Sale.AddProductsList")}`,
      type: "success",
    });
    setQuantities((prev) => ({ ...prev, [product.id]: 1 })); // Reset quantity to 1 after adding
  };

  const updateCartQuantity = (id, value) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < 1) {
      setToast({ message: "ចំនួនត្រូវតែយ៉ាងហោចណាស់ ១", type: "error" });
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: parsedValue } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setToast({ message: t("Sale.RemovedProductMessage"), type: "info" });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + displayPrice(item.price) * item.quantity,
    0
  );
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = () => {
    if (window.confirm(t("Sale.ConfirmRemoveCartMessage"))) {
      setCart([]);
      setToast({ message: t("Sale.RemovedCartSuccesMessage"), type: "info" });
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      setToast({ message: t("Sale.SaveCartSuccesMessage"), type: "success" });
    } catch (error) {
      setToast({
        message: t("Sale.SaveCartFailMessage") + error.message,
        type: "error",
      });
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      setToast({ message: t("Sale.EmptyCartMessage"), type: "error" });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const confirmOrder = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setToast({ message: t("Sale.OrderSuccessMessage"), type: "success" });
  };

  // Toast auto-dismiss after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div className="w-36 bg-white shadow-lg hidden md:block">
        <div className="flex items-center justify-center h-16 bg-green-600 text-white">
          <span className="text-2xl font-bold">✚</span>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="HomePage"
          >
            {t("Sale.HomePage")}
          </a>
          <a
            href="#"
            className="block px-4 py-2 bg-green-100 text-green-600 font-semibold"
            aria-label="Products"
          >
            {t("Sale.Products")}
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="Orders"
          >
            {t("Sale.Orders")}
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="Report"
          >
            {t("Sale.Report")}
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="Cart"
          >
            {t("Sale.Cart")} ({totalQuantity})
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="Leave"
          >
            {t("Sale.Leave")}
          </a>
        </nav>
      </div>

      {/* Main Content and Cart */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Product List */}
        <div className="flex-1 p-6 overflow-auto">
          <header className="mb-6">
            <div className="flex justify-between flex-1 items-center mb-4">
              <h1 className="text-2xl font-bold" aria-label="ឱសថស្ថាន">
                {t("Sale.PharmacySalePage")} (NCPDP ID: 1234567)
              </h1>
              <nav className="space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="HomePageTop"
                >
                  {t("Sale.HomePageTop")}
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="ProductsTop"
                >
                  {t("Sale.ProductsTop")}
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="OrdersTop"
                >
                  {t("Sale.OrdersTop")}
                </a>
                <button
                  onClick={() =>
                    setCurrency(currency === "USD" ? "KHR" : "USD")
                  }
                  className="text-gray-600 hover:text-gray-800"
                  aria-label={t("Sale.ChangeCurrency")}
                >
                  {currency === "USD" ? t("Sale.ChangeToRiel"): t("Sale.ChangeToDollar")}
                </button>
              </nav>
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder={t("Sale.SearchProduct")}
                aria-label="SearchProduct"
                className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8DwHwAFBQIA/rB/WQAAAABJRU5ErkJggg==")
                  }
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  {displayPrice(product.price).toFixed(2)}{" "}
                  {currency === "USD" ? "$" : "៛"}
                </p>
                <div className="flex justify-center items-center mb-2">
                  <label className="mr-2" htmlFor={`qty-${product.id}`}>
                    {t("Sale.Quantity")}
                  </label>
                  <input
                    id={`qty-${product.id}`}
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="w-16 p-1 border rounded text-center"
                    aria-label={`ចំនួនសម្រាប់ ${product.name}`}
                  />
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  aria-label={`បន្ថែម ${product.name} ទៅកន្ត្រក`}
                >
                  {t("Sale.AddToCart")}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section (Desktop: Right Sidebar, Mobile: Bottom Drawer) */}
        <div
          className={`bg-white shadow-lg p-4 transition-all duration-300 md:w-60 md:h-full md:static
            fixed bottom-0 left-0 w-full h-3/4 rounded-t-2xl md:rounded-none flex flex-col
            ${
              isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
            }`}
        >
          {/* Cart Header - Sticky */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
            <h2 className="text-lg font-bold">{t("Sale.CartList")}</h2>
            <button
              className="md:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setIsCartOpen(false)}
              aria-label="បិទកន្ត្រក"
            >
              ✕
            </button>
          </div>

          {/* Cart Items - Scrollable */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <span className="text-4xl mb-2">🛒</span>
              <p>{t("Sale.EmptyCart")}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto mb-4">
              <ul className="space-y-2">
                {cart.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center space-x-3 border-b py-2 hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium">{index + 1}.</span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className=" text-xs">{item.name}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 text-sm hover:underline"
                          aria-label={`លុប ${item.name} ចេញពីកន្ត្រក`}
                        >
                          {t("Sale.RemoveProduct")}
                        </button>
                      </div>
                      <div className="text-sm">
                        {item.quantity} x {displayPrice(item.price).toFixed(2)}{" "}
                        {currency === "USD" ? "$" : "៛"} ={" "}
                        {(displayPrice(item.price) * item.quantity).toFixed(2)}{" "}
                        {currency === "USD" ? "$" : "៛"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cart Footer - Sticky Totals and Buttons */}
          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-white z-10 pt-2 border-t">
              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>{t("Sale.TotoalPrice")}</span>
                  <span>
                    {totalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <span>{t("Sale.TotalQuantity")}</span>
                  <span>{totalQuantity}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <button
                  onClick={clearCart}
                  aria-label="RemoveCart"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  {t("Sale.RemoveCartButton")}
                </button>
                <button
                  onClick={saveCart}
                  aria-label="SaveCart"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {t("Sale.SaveCartButton")}
                </button>
                <button
                  onClick={placeOrder}
                  aria-label="OrdersCart"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {t("Sale.OrdersCartButton")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Toggle for Mobile */}
        <button
          className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsCartOpen(true)}
          aria-label="បើកកន្ត្រក"
        >
          🛒 ({totalQuantity})
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2
              className="text-xl font-bold mb-4"
              aria-label="ConfirmOrder"
            >
              {t("Sale.ConfirmOrder")}
            </h2>
            <p className="mb-2">
              {t("Sale.TotalConfirmOrder")} {totalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"} (
              {totalQuantity} {t("Sale.ProductsConfirmOrder")})
            </p>
            <p className="text-sm text-gray-600">
              ពេលវេលា: 09:43 AM +07, ថ្ងៃចន្ទ, 19 ឧសភា 2025
            </p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                aria-label="CancelOrder"
              >
                {t("Sale.CancelOrderButton")}
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                aria-label="ConfirmOrder"
              >
                {t("Sale.ConfirmOrder")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PharmacyInterface;
