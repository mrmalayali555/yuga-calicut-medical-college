"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type MouseEventHandler,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// Tokens — elevation and surface chrome
// ============================================================================

export const cutoutCardSurfaceShadowClassName = cn(
  "border border-slate-200/90 bg-white",
  "shadow-[0_1px_3px_0_rgba(16,40,25,0.05),0_6px_18px_-3px_rgba(16,40,25,0.06)]",
  "transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
  "hover:border-emerald-300 hover:shadow-[0_4px_12px_-2px_rgba(16,40,25,0.08),0_12px_28px_-6px_rgba(16,40,25,0.1)]"
);

export const cutoutCardSurfaceClassName = cn(
  "group/cutout relative cursor-pointer overflow-hidden rounded-[28px] bg-white text-slate-900",
  cutoutCardSurfaceShadowClassName
);

/** Staggered text/footer entrance inside `CutoutCardContent` */
export function useCutoutContentStaggerVariants() {
  const reduceMotion = useReducedMotion();

  return useMemo(() => {
    if (reduceMotion) {
      return {
        container: {
          hidden: {},
          show: {
            transition: { staggerChildren: 0.03, delayChildren: 0 },
          },
        },
        item: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
          },
        },
      } as const;
    }

    return {
      container: {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.055, delayChildren: 0.06 },
        },
      },
      item: {
        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", duration: 0.48, bounce: 0.14 },
        },
      },
    } as const;
  }, [reduceMotion]);
}

const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

// ============================================================================
// Context
// ============================================================================

export interface CutoutCardContextValue {
  hovered: boolean;
  setHovered: (next: boolean) => void;
}

const CutoutCardContext = createContext<CutoutCardContextValue | null>(null);

export function useCutoutCard() {
  const ctx = useContext(CutoutCardContext);
  if (!ctx) {
    throw new Error("useCutoutCard must be used within <CutoutCard>");
  }
  return ctx;
}

export function useOptionalCutoutCard() {
  return useContext(CutoutCardContext);
}

// ============================================================================
// Internal controllable state hook
// ============================================================================

function useInternalControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
}) {
  const [uncontrolledProp, setUncontrolledProp] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (isControlled) {
        const setter = next as (prev: T) => T;
        const val = typeof next === "function" ? setter(prop as T) : next;
        if (val !== prop) onChange(val);
      } else {
        setUncontrolledProp((prev) => {
          const setter = next as (prev: T) => T;
          const val = typeof next === "function" ? setter(prev as T) : next;
          onChange(val);
          return val;
        });
      }
    },
    [isControlled, prop, onChange]
  );

  return [value, setValue] as const;
}

// ============================================================================
// Root Component
// ============================================================================

export type CutoutCardProps = Omit<
  ComponentProps<typeof motion.div>,
  "defaultValue"
> & {
  hovered?: boolean;
  defaultHovered?: boolean;
  onHoveredChange?: (hovered: boolean) => void;
  trackPointerHover?: boolean;
};

export function CutoutCard({
  className,
  hovered: hoveredProp,
  defaultHovered = false,
  onHoveredChange,
  trackPointerHover = true,
  onMouseEnter,
  onMouseLeave,
  children,
  ...props
}: CutoutCardProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useInternalControllableState<boolean>({
    prop: hoveredProp,
    defaultProp: defaultHovered,
    onChange: onHoveredChange,
  });

  const setHoveredStable = useCallback(
    (next: boolean) => {
      setHovered(next);
    },
    [setHovered]
  );

  const ctx = useMemo<CutoutCardContextValue>(
    () => ({
      hovered: hovered ?? false,
      setHovered: setHoveredStable,
    }),
    [hovered, setHoveredStable]
  );

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseEnter?.(e);
    if (e.defaultPrevented || !trackPointerHover) {
      return;
    }
    setHoveredStable(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseLeave?.(e);
    if (e.defaultPrevented || !trackPointerHover) {
      return;
    }
    setHoveredStable(false);
  };

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(cutoutCardSurfaceClassName, className)}
        data-slot="cutout-card"
        data-state={ctx.hovered ? "hovered" : "idle"}
        initial={{ opacity: 0 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={
          reduceMotion
            ? { duration: 0.22, ease: [0.23, 1, 0.32, 1] }
            : { duration: 0.36, ease: [0.23, 1, 0.32, 1] }
        }
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  );
}

// ============================================================================
// Layout primitives
// ============================================================================

export type CutoutCardMediaProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardMedia({ className, ...props }: CutoutCardMediaProps) {
  return (
    <div
      className={cn("relative overflow-hidden w-full", className)}
      data-slot="cutout-card-media"
      {...props}
    />
  );
}

export type CutoutCardImageProps = ComponentProps<typeof Image>;

export function CutoutCardImage({
  className,
  alt = "",
  fill = true,
  sizes = "(max-width: 768px) 100vw, 28rem",
  ...props
}: CutoutCardImageProps) {
  return (
    <Image
      alt={alt}
      className={cn(
        "object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105",
        fill && "h-full w-full",
        className
      )}
      data-slot="cutout-card-image"
      {...props}
      fill={fill}
      sizes={fill ? sizes : undefined}
    />
  );
}

export type CutoutCardOverlayProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardOverlay({
  className,
  ...props
}: CutoutCardOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent",
        className
      )}
      data-slot="cutout-card-overlay"
      {...props}
    />
  );
}

export type CutoutCardContentProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardContent({
  className,
  ...props
}: CutoutCardContentProps) {
  return (
    <div
      className={cn("p-6", className)}
      data-slot="cutout-card-content"
      {...props}
    />
  );
}

export type CutoutCardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardFooter({
  className,
  ...props
}: CutoutCardFooterProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      data-slot="cutout-card-footer"
      {...props}
    />
  );
}

// ============================================================================
// Cutout geometry
// ============================================================================

export type CutoutCornerProps = ComponentProps<"svg"> & {
  size?: number;
};

export function CutoutCorner({
  className,
  size = 32,
  viewBox = "0 0 200 200",
  ...props
}: CutoutCornerProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(className)}
      data-slot="cutout-corner"
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  );
}

export type CutoutCardInsetLabelProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardInsetLabel({
  className,
  ...props
}: CutoutCardInsetLabelProps) {
  return (
    <div
      className={cn("absolute z-10", className)}
      data-slot="cutout-card-inset-label"
      {...props}
    />
  );
}

export type CutoutCardPinProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardPin({ className, ...props }: CutoutCardPinProps) {
  return (
    <div
      className={cn("absolute z-10", className)}
      data-slot="cutout-card-pin"
      {...props}
    />
  );
}

// ============================================================================
// Context-sensitive action region (reveals on card hover)
// ============================================================================

export type CutoutCardActionProps = ComponentProps<typeof motion.div> & {
  revealOnHover?: boolean;
};

export function CutoutCardAction({
  className,
  revealOnHover = true,
  ...props
}: CutoutCardActionProps) {
  const { hovered } = useCutoutCard();
  const reduceMotion = useReducedMotion();
  const visible = !revealOnHover || hovered;

  return (
    <motion.div
      animate={
        visible
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(8px)" }
      }
      className={cn(
        "absolute z-20",
        revealOnHover && !visible && "pointer-events-none",
        className
      )}
      data-reveal={revealOnHover ? "hover" : "always"}
      data-slot="cutout-card-action"
      transition={
        reduceMotion
          ? { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
          : { duration: 0.24, ease: [0.23, 1, 0.32, 1] }
      }
      {...props}
    />
  );
}
