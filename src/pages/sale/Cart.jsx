const Cart = ({
  cart,
  isCartOpen,
  totalPrice,
  totalQuantity,
  clearCart,
  saveCart,
  placeOrder,
  displayPrice,
}) => {
  const exchangeRate = 4000;
  const totalPriceInRiel = totalPrice * exchangeRate;

  return (
    <div
      className={`bg-white shadow-sm p-2 transition-all duration-300 md:w-60 md:h-full md:static
        fixed bottom-0 left-0 w-[50%] h-3/4 rounded-t-2xl md:rounded-none flex flex-col
        ${isCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}`}
    >
      <div className="flex justify-between items-center mb-4 bg-white z-10 pb-2 border-b">
        <h2 className="text-sm font-bold">កន្ត្រក</h2>
      </div>
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
          <span className="text-4xl mb-2">🛒</span>
          <p>កន្ត្រកទទេ</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto mb-2">
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li
                key={`${item.id}-${item.packaging || "default"}`}
                className="flex items-center space-x-3 border-b py-2 hover:bg-gray-50 transition"
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
                      {(displayPrice(item.price) * item.quantity).toFixed(2)} $
                      (<span className="text-emerald-600">{item.quantity}</span>
                      )
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
        <div className="sticky bottom-0 bg-white z-10 pt-2 border-t">
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
  );
};

export default Cart;
