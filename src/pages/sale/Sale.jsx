import React, { useState, useMemo, useEffect } from "react";

const PharmacyInterface = () => {
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
      image: "https://via.placeholder.com/150",
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
      message: `${product.name} (x${
        quantities[product.id] || 1
      }) ត្រូវបានបន្ថែមទៅកន្ត្រក`,
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
    setToast({ message: "ផលិតផលត្រូវបានលុបចេញពីកន្ត្រក", type: "info" });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + displayPrice(item.price) * item.quantity,
    0
  );
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    setIsCheckoutOpen(true);
  };

  const confirmOrder = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setToast({ message: "ការបញ្ជាទិញបានជោគជ័យ!", type: "success" });
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
      <div className="w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-green-600 text-white">
          <span className="text-2xl font-bold">✚</span>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="ទំព័រដើម"
          >
            ទំព័រដើម
          </a>
          <a
            href="#"
            className="block px-4 py-2 bg-green-100 text-green-600 font-semibold"
            aria-label="ផលិតផល"
          >
            ផលិតផល
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="ការបញ្ជាទិញ"
          >
            ការបញ្ជាទិញ
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="របាយការណ៍"
          >
            របាយការណ៍
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="កន្ត្រក"
          >
            កន្ត្រក ({totalQuantity})
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
            aria-label="ចាកចេញ"
          >
            ចាកចេញ
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Product List */}
        <div className="flex-1 p-6 overflow-auto">
          <header className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold" aria-label="ឱសថស្ថាន">
                ឱសថស្ថាន (NCPDP ID: 1234567)
              </h1>
              <nav className="space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="ទំព័រដើម"
                >
                  ទំព័រដើម
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="ផលិតផល"
                >
                  ផលិតផល
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="ការបញ្ជាទិញ"
                >
                  ការបញ្ជាទិញ
                </a>
                <button
                  onClick={() =>
                    setCurrency(currency === "USD" ? "KHR" : "USD")
                  }
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="ប្តូររូបិយបណ្ណ"
                >
                  {currency === "USD" ? "ប្តូរទៅ ៛" : "ប្តូរទៅ $"}
                </button>
              </nav>
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="គេហទំព័រស្វែងរក"
                aria-label="ស្វែងរកផលិតផល"
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
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">
                  តម្លៃ {displayPrice(product.price).toFixed(2)}{" "}
                  {currency === "USD" ? "$" : "៛"}
                </p>
                <div className="mt-2 flex justify-center items-center">
                  <label className="mr-2" htmlFor={`qty-${product.id}`}>
                    ចំនួន:
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
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  aria-label={`បន្ថែម ${product.name} ទៅកន្ត្រក`}
                >
                  បន្ថែមទៅកន្ត្រក
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Toggle for Mobile */}
        <button
          className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsCartOpen(true)}
          aria-label="បើកកន្ត្រក"
        >
          🛒 ({totalQuantity})
        </button>

        {/* Cart Section (Desktop: Sidebar, Mobile: Bottom Drawer) */}
        <div
          className={`bg-white shadow-lg p-4 transition-all duration-300 md:w-80 md:block md:static md:h-auto
            fixed bottom-0 left-0 w-full h-3/4 rounded-t-2xl md:rounded-none flex flex-col
            ${
              isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
            }`}
        >
          {/* Cart Header - Sticky */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
            <h2 className="text-lg font-bold">កន្ត្រក</h2>
            <button
              className="md:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setIsCartOpen(false)}
              aria-label="បិទកន្ត្រក"
            >
              ✕
            </button>
          </div>

          {/* Cart Items - Scrollable */}
          <div>
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                <span className="text-4xl mb-2">🛒</span>
                <p>កន្ត្រកទទេ</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto mb-4">
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center space-x-3 border-b py-2 hover:bg-gray-50 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">
                            {item.name}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 text-sm hover:underline"
                            aria-label={`លុប ${item.name} ចេញពីកន្ត្រក`}
                          >
                            លុប
                          </button>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <span>{item.quantity} x</span>
                          <span className="ml-1">
                            {displayPrice(item.price).toFixed(2)}{" "}
                            {currency === "USD" ? "$" : "៛"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {/* Cart Footer - Sticky Totals and Buttons */}
            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white z-10 pt-2 border-t">
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>សរុប</span>
                    <span>
                      {totalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>បរិមាណសរុប</span>
                    <span>{totalQuantity}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <button
                    onClick={clearCart}
                    aria-label="លុបកន្ត្រក"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    លុប
                  </button>
                  <button
                    onClick={saveCart}
                    aria-label="រក្សាទុកកន្ត្រក"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    រក្សាទុក
                  </button>
                  <button
                    onClick={placeOrder}
                    aria-label="បញ្ជាទិញ"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    បញ្ជាទិញ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2
              className="text-xl font-bold mb-4"
              aria-label="បញ្ជាក់ការបញ្ជាទិញ"
            >
              បញ្ជាក់ការបញ្ជាទិញ
            </h2>
            <p className="mb-2">
              សរុប: {totalPrice.toFixed(2)} {currency === "USD" ? "$" : "៛"} (
              {totalQuantity} ផលិតផល)
            </p>
            <p className="text-sm text-gray-600">
              ពេលវេលា: 06:38 PM +07, ថ្ងៃអាទិត្យ, 18 ឧសភា 2025
            </p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                aria-label="បោះបង់"
              >
                បោះបង់
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                aria-label="បញ្ជាក់ការបញ្ជាទិញ"
              >
                បញ្ជាក់
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
