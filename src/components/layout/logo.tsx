import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm shadow-emerald-700/25 transition-transform duration-300 hover:scale-105 border border-emerald-500/30 p-1.5",
        className
      )}
    >
      <Image
        src="/yuga-logo-white.png"
        alt="YUGA Logo"
        width={32}
        height={32}
        className="w-full h-full object-contain drop-shadow-xs"
        priority
      />
    </div>
  );
}

export function Logo({
  className,
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <span className="text-[16px] font-bold tracking-[0.14em] text-slate-900">
          YUGA
        </span>
        {showTagline && (
          <span className="text-[10.5px] font-semibold tracking-wide text-emerald-700 mt-0.5">
            GMC Kozhikode · 2026–27
          </span>
        )}
      </div>
    </div>
  );
}
