"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  showCenterLogo?: boolean;
}

/**
 * Standard, 100% Scannable QR Code Generator
 * Uses official spec-compliant QRCode library
 */
export function QRCodeSVG({
  value,
  size = 180,
  className = "",
  showCenterLogo = true,
}: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // 2x for retina crispness
      margin: 1,
      color: {
        dark: "#0a0d14",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  return (
    <div
      className={`relative inline-flex items-center justify-center p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200/80 ${className}`}
      style={{ width: size + 20, height: size + 20 }}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`QR Code Pass: ${value}`}
          width={size}
          height={size}
          className="rounded-lg object-contain block select-none"
        />
      ) : (
        <div
          className="flex items-center justify-center bg-slate-100 rounded-lg animate-pulse"
          style={{ width: size, height: size }}
        >
          <span className="text-[10px] font-mono text-slate-400 font-semibold">Generating...</span>
        </div>
      )}

      {/* Central YUGA Crest Badge */}
      {showCenterLogo && dataUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-7 w-7 rounded-lg bg-[#ff2e56] text-white flex items-center justify-center font-bold text-[11px] tracking-tight shadow-md border-2 border-white">
            Y
          </div>
        </div>
      )}
    </div>
  );
}
