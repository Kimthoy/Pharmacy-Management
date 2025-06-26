import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { LiaWindowCloseSolid } from "react-icons/lia";
const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("scanner", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText, decodedResult) => {
        scanner.clear();
        onScanSuccess(decodedText);
      },
      (error) => {
        console.warn("Scan error:", error);
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Scanner cleanup error", err));
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white relative  dark:bg-gray-800 rounded-lg p-3 w-full max-w-md">
        <div id="scanner" ref={scannerRef} style={{ width: "100%" }}></div>
        <button onClick={onClose} className="  text-red-600 rounded-md  ">
          <LiaWindowCloseSolid className="w-7  h-7 absolute bottom-1 right-2 hover:scale-125 transition-all hover:rounded-lg" />
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
