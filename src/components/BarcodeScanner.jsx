import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LiaWindowCloseSolid } from "react-icons/lia";

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    // Start decoding from video device, get promise with stream info
    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          onScanSuccess(result.getText());
          // Stop scanning after success
          codeReader.reset(); // <-- this is NOT a function, so remove this line
        }
      })
      .then((result) => {
        // Save stream to stop later
        streamRef.current = result?.stream;
      })
      .catch((err) => {
        console.error("Failed to start scanner", err);
      });

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        // Stop all tracks on the stream to release camera
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (codeReaderRef.current) {
        // Dispose the code reader
        codeReaderRef.current.reset && codeReaderRef.current.reset();
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white relative dark:bg-gray-800 rounded-lg p-3 w-full max-w-md">
        <video ref={videoRef} style={{ width: "100%" }} />
        <button onClick={onClose} className="text-red-600 rounded-md">
          <LiaWindowCloseSolid className="w-7 h-7 absolute bottom-1 right-2 hover:scale-125 transition-all hover:rounded-lg" />
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
