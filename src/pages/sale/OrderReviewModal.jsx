import { useState } from "react";

const OrderReviewModal = ({
  isOpen,
  setIsOpen,
  cart,
  paymentMethod,
  cardNumber,
  setCardNumber,
  confirmOrder,
}) => {
  const exchangeRate = 4050;
  const convertRielToUSD = (riel) => riel / exchangeRate;
 const totalPrice = cart.reduce((sum, item) => {
   const priceInUSD =
     item.currency === "KHR" ? item.price / exchangeRate : item.price;
   return sum + priceInUSD * item.quantity;
 }, 0);

  const totalPriceInRiel = totalPrice * exchangeRate;
  const [dollarAmountRaw, setDollarAmountRaw] = useState("");
  const [rielAmountRaw, setRielAmountRaw] = useState("");
  const [totalDollarAmount, setTotalDollarAmount] = useState(0);
  const [totalRielAmount, setTotalRielAmount] = useState(0);
  const [dollarError, setDollarError] = useState("");
  const [rielError, setRielError] = useState("");
  const [cardError, setCardError] = useState("");
  const formatNumber = (value, isDollar = false) => {
    if (!value) return "";
    const cleanValue = value.replace(/,/g, "");
    if (isNaN(cleanValue)) return value;
    return isDollar
      ? parseFloat(cleanValue).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : parseInt(cleanValue).toLocaleString("en-US");
  };
 const validateInput = (value, isDollar = false) => {
   if (!value || value.trim() === "") return ""; // Let empty values pass temporarily

   const cleanValue = value.replace(/,/g, "");
   const regex = isDollar ? /^-?\d*(\.\d{0,2})?$/ : /^-?\d*$/;
   if (!regex.test(cleanValue)) {
     return isDollar
       ? "Please enter a valid dollar amount"
       : "Please enter a valid riel amount";
   }

   const parsedValue = isDollar ? parseFloat(cleanValue) : parseInt(cleanValue);
   if (isNaN(parsedValue)) return "Invalid number";

   if (isDollar && parsedValue < totalPrice) {
     return "Dollar is less than total price";
   } else if (!isDollar && parsedValue < totalPriceInRiel) {
     return "Riel price is less than total price";
   }

   return "";
 };

 const handleDollarChange = (e) => {
   const value = e.target.value.replace(/,/g, "");
   setDollarAmountRaw(value);

   if (!value.trim()) {
     setRielAmountRaw("");
     setTotalRielAmount(0);
     setTotalDollarAmount(0);
     setDollarError("");
     return;
   }

   const error = validateInput(value, true);
   setDollarError(error);

   if (!error) {
     const parsedValue = parseFloat(value) || 0;
     const paidInRiel = parsedValue * exchangeRate;
     setRielAmountRaw(formatNumber(paidInRiel.toFixed(0)));
     setRielError("");
     setTotalRielAmount(paidInRiel - totalPriceInRiel);
     setTotalDollarAmount((paidInRiel - totalPriceInRiel) / exchangeRate);
   }
 };

 const handleRielChange = (e) => {
   const value = e.target.value.replace(/,/g, "");
   setRielAmountRaw(value);

   if (!value.trim()) {
     setDollarAmountRaw("");
     setTotalRielAmount(0);
     setTotalDollarAmount(0);
     setRielError("");
     return;
   }

   const error = validateInput(value, false);
   setRielError(error);

   if (!error) {
     const parsedValue = parseInt(value) || 0;
     const usd = parsedValue / exchangeRate;
     setDollarAmountRaw(formatNumber(usd.toFixed(2), true));
     setDollarError("");
     setTotalRielAmount(parsedValue - totalPriceInRiel);
     setTotalDollarAmount((parsedValue - totalPriceInRiel) / exchangeRate);
   }
 };

 const handleConfirm = () => {
   if (paymentMethod === "cash") {
     if (dollarError || rielError) return;

     if (!dollarAmountRaw || !rielAmountRaw) {
       setDollarError("Please enter an amount");
       setRielError("Please enter an amount");
       return;
     }
   } else {
     if (!cardNumber || cardNumber.length < 16) {
       setCardError("Please enter a valid 16-digit card number");
       return;
     }
   }

   confirmOrder(); // ✅ call passed-in function
 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  sm:mb-0 mb-16  z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white  dark:bg-gray-800 p-5 rounded-lg max-w-md w-full font-khmer">
        <h2 className="text-xl font-bold mb-4" aria-label="បញ្ជាក់ការបញ្ជាទិញ">
          បញ្ជាក់ការបញ្ជាទិញ
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">កន្ត្រកទទេ!</p>
        ) : (
          <>
            <ul className="space-y-2 mb-4 h-16 overflow-y-auto">
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
                    {convertRielToUSD(item.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    $ ={" "}
                    {(
                      convertRielToUSD(item.price) * item.quantity
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    $
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm mb-2">
              <span>សរុប:</span>
              <span className="font-semibold">
                $
                {totalPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span></span>
              <span className="font-semibold">
                ៛{totalPriceInRiel.toLocaleString("en-US")}
              </span>
            </div>
            <hr className="mb-3" />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                ប្រភេទនៃការបង់ប្រាក់
              </label>
              <select className="outline-none px-2 py-2 w-[200px] border rounded-md border-black">
                <option value="cash">សាច់ប្រាក់</option>
                <option value="aba">ABA</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">ប្រាក់ដែលបានបង់</label>
                <div className="flex gap-3">
                  <div className="border flex items-center">
                    <input
                      type="text"
                      value={formatNumber(dollarAmountRaw, true)}
                      onChange={handleDollarChange}
                      className="w-full p-2 border-none focus:outline-none rounded-lg"
                      placeholder="ប្រាក់ដុល្លា"
                      aria-label="Dollar amount"
                    />
                    <label className="text-sm p-2">$</label>
                  </div>
                  <div className="border flex items-center">
                    <input
                      type="text"
                      value={formatNumber(rielAmountRaw)}
                      onChange={handleRielChange}
                      className="w-full p-2 border-none focus:outline-none rounded-lg"
                      placeholder="ប្រាក់រៀល"
                      aria-label="Riel amount"
                    />
                    <label className="text-sm p-2">៛</label>
                  </div>
                </div>
                {dollarError && (
                  <p className="text-red-600 text-sm mt-1">{dollarError}</p>
                )}
                {rielError && (
                  <p className="text-red-600 text-sm mt-1">{rielError}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">ប្រាក់នៅសល់</label>
                <div className="flex gap-3">
                  <div className="border flex items-center">
                    <input
                      type="text"
                      value={totalDollarAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      readOnly
                      className="w-full focus:outline-none p-2 border-none rounded-lg text-center"
                      aria-label="Total dollar amount"
                    />
                    <label className="text-sm p-2">$</label>
                  </div>
                  <div className="border  flex items-center">
                    <input
                      type="text"
                      value={totalRielAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                      readOnly
                      className="w-full p-2 focus:outline-none border-none rounded-lg text-center"
                      aria-label="Total riel amount"
                    />
                    <label className="text-sm p-2">៛</label>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-3" />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setRielAmountRaw("");
                  setDollarAmountRaw("");
                  setCardNumber("");
                  setDollarError("");
                  setRielError("");
                  setCardError("");
                  setIsOpen(false);
                }}
                className="flex-1 rounded-lg hover:text-red-400 transition duration-200"
                aria-label="បោះបង់"
              >
                បោះបង់
              </button>
              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                aria-label="បញ្ជាក់ការបញ្ជាទិញ"
                disabled={
                  paymentMethod === "cash"
                    ? dollarError || rielError
                    : cardError
                }
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
