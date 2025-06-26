const Cart = ({
  cart,
  isCartOpen,
  clearCart,
  saveCart,
  placeOrder,
  onClose,
}) => {
  const exchangeRate = 4000;

  const calculateTotalPriceUSD = () => {
    return cart.reduce((total, item) => {
      const priceInUSD =
        item.currency === "KHR" ? item.price / exchangeRate : item.price;
      return total + priceInUSD * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPriceUSD();
  const totalPriceInRiel = totalPrice * exchangeRate;

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const displayPrice = (price, currency = "USD") => {
    return currency === "KHR"
      ? (price / exchangeRate).toFixed(2)
      : price.toFixed(2);
  };

  return (
    <div
      className={`bg-slate-200 shadow-sm p-4 z-10 transition-transform duration-300
    fixed bottom-0 left-0 sm:w-80 w-full h-[80vh] md:h-full md:static
    rounded-t-2xl flex flex-col
    ${isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between items-center sm:mb-0 mb-4 bg-slate-200 z-10 pb-2 border-b">
        <h2 className="text-sm font-bold">កន្ត្រក</h2>
        <button
          onClick={onClose}
          aria-label="Close cart"
          className="sm:hidden flex bg-red-600 text-white px-3 rounded-lg py-1  shadow-lg"
        >
          បិទ
        </button>
      </div>

      {cart.length === 0 ? (
        <div className=" flex-1 flex flex-col items-center justify-center text-gray-600">
          <img src="empty_cart1.png" alt="" />
        </div>
      ) : (
        <div className="flex-1 overflow-auto mb-2">
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li
                key={`${item.id}-${item.packaging || "default"}`}
                className="flex items-center space-x-3 border-b py-2 bg-slate-100 transition p-4"
              >
                <span className="text-sm font-medium">{index + 1}.</span>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-xs">
                    {item.packaging
                      ? `${item.name} (${item.packaging})`
                      : item.name}
                    <br />
                    <div>
                      សរុប :{" "}
                      {(
                        displayPrice(item.price, item.currency) * item.quantity
                      ).toFixed(2)}{" "}
                      $ (
                      <span className="text-emerald-600">{item.quantity}</span>)
                    </div>
                    <span className="text-gray-500">
                      {item.typeofmedicine || "មិនបានកំណត់"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cart.length > 0 && (
        <div className="sticky bottom-0  z-10 pt-2 border-t">
          <div className="flex flex-col space-y-2 mb-4">
            <div className="flex justify-between items-center font-semibold">
              <span>សរុប</span>
              <span>$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span></span>
              <span>
                ៛{" "}
                {totalPriceInRiel.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <hr />
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>បរិមាណសរុប</span>
              <span className="text-emerald-600 font-semibold text-sm">
                {totalQuantity}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
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
              onClick={() => {
                placeOrder(); // your existing order logic
                onClose(); // close the cart automatically
              }}
              aria-label="បញ្ជាទិញ"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              បញ្ជាទិញ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
