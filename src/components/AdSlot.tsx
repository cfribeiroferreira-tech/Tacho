import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface AdSlotProps {
  type?: "banner" | "rectangle";
  className?: string;
  key?: React.Key;
  slotId?: string;
}

export function AdSlot({ type = "banner", className = "", slotId = "" }: AdSlotProps) {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-4264060085761397";
  const adLoaded = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clientId && !adLoaded.current) {
      if (!document.getElementById("adsense-script")) {
        const script = document.createElement("script");
        script.id = "adsense-script";
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
      
      const pushAd = () => {
        if (!containerRef.current) return;
        
        // Wait until container has width to prevent "No slot size for availableWidth=0"
        if (containerRef.current.offsetWidth === 0) {
          setTimeout(pushAd, 200);
          return;
        }

        try {
          const adsbygoogle = (window as any).adsbygoogle || [];
          adsbygoogle.push({});
          adLoaded.current = true;
        } catch (e: any) {
          if (!e.message?.includes("All 'ins' elements")) {
            console.error("AdSense Error", e);
          }
        }
      };

      // Delay execution to let DOM render
      const timeoutId = setTimeout(pushAd, 100);
      
      return () => clearTimeout(timeoutId);
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
      ref={containerRef}
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
