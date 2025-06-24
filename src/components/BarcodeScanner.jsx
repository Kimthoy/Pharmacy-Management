import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div id="scanner" ref={scannerRef} style={{ width: "100%" }}></div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
