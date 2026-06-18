import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface AdSlotProps {
  type?: "banner" | "rectangle";
  className?: string;
  key?: React.Key;
  slotId?: string;
}

export function AdSlot({ type = "banner", className = "", slotId = "" }: AdSlotProps) {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const adLoaded = useRef(false);

  useEffect(() => {
    if (clientId && !adLoaded.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        adLoaded.current = true;
      } catch (e) {
        console.error("AdSense Error", e);
      }
    }
  }, [clientId, type]);

  if (!clientId) {
    return (
      <div
        className={`w-full bg-[var(--color-line)] flex flex-col items-center justify-center text-[var(--color-ink-soft)] text-xs rounded-lg overflow-hidden my-4 relative ${
          type === "banner" ? "h-[60px]" : "h-[250px]"
        } ${className}`}
      >
        <div className="absolute top-1 left-2 text-[8px] uppercase tracking-wider opacity-60">
          Publicidade
        </div>
        <span className="opacity-80 font-medium">Espaço Publicitário</span>
        <span className="opacity-50 mt-1 text-[10px]">Podes configurar AdSense nas definições</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex items-center justify-center my-4 overflow-hidden relative ${className}`}
      style={{ minHeight: type === "banner" ? "60px" : "250px" }}
    >
      <div className="absolute top-1 left-2 text-[8px] uppercase tracking-wider opacity-30 pointer-events-none z-10">
        Publicidade
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "100%", width: "100%" }}
        data-ad-client={clientId}
        data-ad-slot={slotId || undefined}
        data-ad-format={type === "rectangle" ? "rectangle" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
