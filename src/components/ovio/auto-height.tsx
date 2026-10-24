"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AutoHeight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`overflow-hidden ${className}`}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
