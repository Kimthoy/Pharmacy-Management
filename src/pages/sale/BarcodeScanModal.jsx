import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanModal({ isOpen, onClose, onDetected }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [err, setErr] = useState("");
  const [hasDetected, setHasDetected] = useState(false); // ← debounce

  // Fixed scan window (tweak as you like)
  const SCAN_W = 320;
  const SCAN_H = 200;

  useEffect(() => {
    if (!isOpen) return;

    let stream;
    setErr("");
    setHasDetected(false);

    const setup = async () => {
      try {
        const constraints = {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            focusMode: "continuous",
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const reader = new BrowserMultiFormatReader();
        codeReaderRef.current = reader;

        reader.decodeFromVideoDevice(null, videoRef.current, (result) => {
          if (result && !hasDetected) {
            setHasDetected(true);
            const text = String(result.getText());

            // stop camera and reader immediately to avoid re-firing
            try {
              reader.reset();
            } catch {}
            if (videoRef.current?.srcObject) {
              videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            }

            onDetected(text); // Sale.jsx will decide to show UnitSelectModal or add base
          }
        });
      } catch (e) {
        setErr(
          e?.message?.includes("Permission")
            ? "Camera permission denied. Please allow camera access."
            : e?.message || "Unable to open camera."
        );
      }
    };

    setup();

    return () => {
      try {
        codeReaderRef.current?.reset();
      } catch {}
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, onDetected, hasDetected]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fullscreen underlay with video */}
      <div className="fixed inset-0 z-[997] bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Masked overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
            style={{
              width: `${SCAN_W}px`,
              height: `${SCAN_H}px`,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
            }}
          />
          <Corner x="left" y="top" w={SCAN_W} h={SCAN_H} />
          <Corner x="right" y="top" w={SCAN_W} h={SCAN_H} />
          <Corner x="left" y="bottom" w={SCAN_W} h={SCAN_H} />
          <Corner x="right" y="bottom" w={SCAN_W} h={SCAN_H} />
          <div
            className="absolute rounded"
            style={{
              left: `calc(50% - ${SCAN_W / 2 - 8}px)`,
              right: `calc(50% - ${SCAN_W / 2 - 8}px)`,
              top: `calc(50% - ${SCAN_H / 2 - 8}px)`,
              height: "2px",
              background: "rgba(255,255,255,0.85)",
              animation: "scanline 1.6s linear infinite alternate",
            }}
          />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-[60]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md bg-white/90 hover:bg-white shadow pointer-events-auto"
          >
            ✕ បិទ
          </button>
          {err && (
            <div className="ml-2 text-xs px-2 py-1 rounded bg-red-600 text-white shadow pointer-events-auto">
              {err}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(0); }
          100% { transform: translateY(${SCAN_H - 16}px); }
        }
      `}</style>
    </>
  );
}

/** Corner bracket */
function Corner({ x, y, w, h }) {
  const halfW = w / 2;
  const halfH = h / 2;
  const size = 28;

  const pos =
    x === "left" && y === "top"
      ? {
          left: `calc(50% - ${halfW}px)`,
          top: `calc(50% - ${halfH}px)`,
          borderRight: "none",
          borderBottom: "none",
          borderRadius: "12px 0 0 0",
        }
      : x === "right" && y === "top"
      ? {
          right: `calc(50% - ${halfW}px)`,
          top: `calc(50% - ${halfH}px)`,
          borderLeft: "none",
          borderBottom: "none",
          borderRadius: "0 12px 0 0",
        }
      : x === "left" && y === "bottom"
      ? {
          left: `calc(50% - ${halfW}px)`,
          bottom: `calc(50% - ${halfH}px)`,
          borderRight: "none",
          borderTop: "none",
          borderRadius: "0 0 0 12px",
        }
      : {
          right: `calc(50% - ${halfW}px)`,
          bottom: `calc(50% - ${halfH}px)`,
          borderLeft: "none",
          borderTop: "none",
          borderRadius: "0 0 12px 0",
        };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: "rgba(255,255,255,0.9)",
        borderWidth: "4px",
        ...pos,
      }}
    />
  );
}
