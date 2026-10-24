import React from "react";
import { cn } from "@/lib/utils";

export interface GradientHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: "default" | "secondary" | "emerald" | "sunset" | "amber" | "light";
  size?: "default" | "sm" | "md" | "lg" | "xl" | "xxl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
}

const variantStyles: Record<NonNullable<GradientHeadingProps["variant"]>, string> = {
  default:
    "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400",
  secondary:
    "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500",
  emerald:
    "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent",
  sunset:
    "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent",
  amber:
    "bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent",
  light:
    "bg-gradient-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent",
};

const sizeStyles: Record<NonNullable<GradientHeadingProps["size"]>, string> = {
  default: "text-2xl sm:text-3xl",
  sm: "text-lg sm:text-xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
  xxl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
};

const weightStyles: Record<NonNullable<GradientHeadingProps["weight"]>, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

export const GradientHeading = React.forwardRef<
  HTMLHeadingElement,
  GradientHeadingProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      weight = "bold",
      as: Component = "h2",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "tracking-tight font-display inline-block leading-tight",
          variantStyles[variant],
          sizeStyles[size],
          weightStyles[weight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GradientHeading.displayName = "GradientHeading";
