import { useState, useEffect } from "react";

const OrderReviewModal = ({
  isOpen,
  setIsOpen,
  cart,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  setCardNumber,
  confirmOrder,
  displayPrice,
}) => {
  const safeTotalPrice = totalPrice || 0;
  const exchangeRate = 4000;
  const totalPriceInRiel = safeTotalPrice * exchangeRate;

  const [dollarAmountRaw, setDollarAmountRaw] = useState("");
  const [totalDollarAmount, setTotalDollarAmount] = useState(0);
  const [totalRielAmount, setTotalRielAmount] = useState(0);
  const [rielAmountRaw, setRielAmountRaw] = useState("");

  useEffect(() => {
    if (rielAmountRaw) {
      const parsedRiel = parseFloat(rielAmountRaw) || 0;
      setTotalRielAmount(parsedRiel - totalPriceInRiel);
      setTotalDollarAmount((parsedRiel - totalPriceInRiel) / exchangeRate);
    } else {
      setTotalRielAmount(0);
      setTotalDollarAmount(0);
    }
  }, [rielAmountRaw, exchangeRate, totalPriceInRiel]);

  const handleDollarChange = (e) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas
    setDollarAmountRaw(value);
    const parsedValue = parseFloat(value) || 0;
    const paidInRiel = parsedValue * exchangeRate;
    setRielAmountRaw(paidInRiel.toString());
    setTotalRielAmount(paidInRiel - totalPriceInRiel);
    setTotalDollarAmount((paidInRiel - totalPriceInRiel) / exchangeRate);
  };

  const handleRielChange = (e) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas
    setRielAmountRaw(value);
    const parsedValue = parseFloat(value) || 0;
    setDollarAmountRaw((parsedValue / exchangeRate).toFixed(2));
    setTotalRielAmount(parsedValue - totalPriceInRiel);
    setTotalDollarAmount((parsedValue - totalPriceInRiel) / exchangeRate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4" aria-label="បញ្ជាក់ការបញ្ជាទិញ">
          បញ្ជាក់ការបញ្ជាទិញ
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">កន្ត្រកទទេ!</p>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {cart.map((item, index) => (
                <li
                  key={`${item.id}-${item.packaging || "default"}`}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {index + 1}.{" "}
                    {item.packaging
                      ? `${item.name} (${item.packaging})`
                      : item.name}
                  </span>
                  <span>
                    {item.quantity} x{" "}
                    {(displayPrice(item.price) || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    $ ={" "}
                    {(
                      (displayPrice(item.price) || 0) * item.quantity
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    $
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm mb-2 khmer-font">
              <span>សរុប:</span>
              <span className="font-semibold">
                $
                {safeTotalPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3 khmer-font">
              <span></span>
              <span className="font-semibold">
                <span>៛</span>
                {totalPriceInRiel.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
              </span>
            </div>
            <hr className="mb-3" />
            <div className="flex flex-col gap-4">
              ប្រាក់ដែលបានបង់
              <div className="flex gap-3">
                <div className="border flex justify-center align-middle">
                  <input
                    type="number"
                    value={dollarAmountRaw}
                    onChange={handleDollarChange}
                    className="w-full p-2 border-none focus:outline-none rounded-lg  "
                    placeholder="Dollar"
                    aria-label="Dollar amount"
                  />
                  <label className="text-sm mt-2 font-extralight text-center me-2">
                    $
                  </label>
                </div>
                <div className="border flex justify-center align-middle">
                  <input
                    type="text"
                    value={
                      rielAmountRaw
                        ? parseFloat(rielAmountRaw).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : ""
                    }
                    onChange={handleRielChange}
                    className="w-full p-2 border-none rounded-lg focus:outline-none "
                    placeholder="Riel"
                    aria-label="Riel amount"
                  />
                  <label className="text-lg mt-1 font-extralight text-center me-2">
                    ៛
                  </label>
                </div>
              </div>
              ប្រាក់នៅសល់
              <div className="flex gap-3">
                <div className="border flex justify-center align-middle">
                  <input
                    type="text"
                    value={totalDollarAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                    className="w-full focus:outline-none p-2 border-none rounded-lg  text-center"
                    placeholder="Total Dollar"
                    aria-label="Total dollar amount"
                  />
                  <label
                    htmlFor=""
                    className="text-sm mt-2 font-extralight text-center me-2"
                  >
                    $
                  </label>
                </div>
                <div className="border flex justify-center align-middle">
                  <input
                    type="text"
                    value={totalRielAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    readOnly
                    className="w-full p-2 border-none focus:outline-none rounded-lg text-center"
                    placeholder="Total Riel"
                    aria-label="Total riel amount"
                  />
                  <label
                    htmlFor=""
                    className="text-lg mt-1 font-extralight text-center me-2"
                  >
                    ៛
                  </label>
                </div>
              </div>
            </div>
            <hr className="mb-3 mt-3" />
            <div className="mb-4 mt-4">
              <label className="block mb-2 text-sm font-medium">
                ប្រភេទនៃការបង់ប្រាក់
              </label>
              <div className="flex gap-5">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cash">សាច់ប្រាក់</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="aba"
                    name="paymentMethod"
                    value="aba"
                    checked={paymentMethod === "aba"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="aba">ABA</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="wing"
                    name="paymentMethod"
                    value="wing"
                    checked={paymentMethod === "wing"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="wing">WING</label>
                </div>
              </div>
            </div>
            <hr className="mb- U+200B3 mt-3" />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setRielAmountRaw("");
                  setCardNumber("");
                  setDollarAmountRaw("");
                  setIsOpen(false);
                }}
                className="flex-1 rounded-lg hover:text-red-400 transition duration-200"
                aria-label="បោះបង់"
              >
                បោះបង់
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                aria-label="បញ្ជាក់ការបញ្ជាទិញ"
              >
                បញ្ជាក់
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderReviewModal;
