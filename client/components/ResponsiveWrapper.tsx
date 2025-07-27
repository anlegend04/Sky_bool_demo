import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}

export function ResponsiveWrapper({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  showOnMobile = false,
  showOnTablet = false,
  showOnDesktop = false,
}: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();

  // Determine if component should be hidden
  const shouldHide = 
    (hideOnMobile && isMobile) ||
    (hideOnTablet && breakpoint === "md") ||
    (hideOnDesktop && !isMobile && breakpoint !== "md") ||
    (showOnMobile && !isMobile) ||
    (showOnTablet && breakpoint !== "md") ||
    (showOnDesktop && isMobile);

  if (shouldHide) {
    return null;
  }

  // Build responsive classes
  const responsiveClasses = cn(
    className,
    mobileClassName && isMobile && mobileClassName,
    tabletClassName && breakpoint === "md" && tabletClassName,
    desktopClassName && !isMobile && breakpoint !== "md" && desktopClassName
  );

  return (
    <div className={responsiveClasses}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = "xl",
  padding = "md",
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = "md",
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-6",
    lg: "gap-4 sm:gap-6 lg:gap-8",
    xl: "gap-6 sm:gap-8 lg:gap-12",
  };

  const gridColsClasses = [
    `grid-cols-${cols.mobile || 1}`,
    `sm:grid-cols-${cols.tablet || cols.mobile || 1}`,
    `lg:grid-cols-${cols.desktop || cols.tablet || cols.mobile || 1}`,
    `xl:grid-cols-${cols.wide || cols.desktop || cols.tablet || cols.mobile || 1}`,
  ].join(" ");

  return (
    <div
      className={cn(
        "grid",
        gridColsClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: {
    mobile?: "xs" | "sm" | "base" | "lg" | "xl";
    tablet?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
    desktop?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  };
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export function ResponsiveText({
  children,
  className,
  size = { mobile: "base", tablet: "base", desktop: "base" },
  weight = "normal",
}: ResponsiveTextProps) {
  const sizeClasses = [
    `text-${size.mobile || "base"}`,
    `sm:text-${size.tablet || size.mobile || "base"}`,
    `lg:text-${size.desktop || size.tablet || size.mobile || "base"}`,
  ].join(" ");

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <span
      className={cn(
        sizeClasses,
        weightClasses[weight],
        className
      )}
    >
      {children}
    </span>
  );
}

// New responsive utility components
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "spacious";
}

export function ResponsiveCard({
  children,
  className,
  variant = "default",
}: ResponsiveCardProps) {
  const variantClasses = {
    default: "card-mobile",
    compact: "p-2 sm:p-3 lg:p-4",
    spacious: "p-4 sm:p-6 lg:p-8",
  };

  return (
    <div className={cn("card-responsive", variantClasses[variant], className)}>
      {children}
    </div>
  );
}

interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical" | "responsive";
}

export function ResponsiveButtonGroup({
  children,
  className,
  orientation = "responsive",
}: ResponsiveButtonGroupProps) {
  const orientationClasses = {
    horizontal: "flex flex-row space-x-2 sm:space-x-3",
    vertical: "flex flex-col space-y-2 sm:space-y-3",
    responsive: "btn-group-mobile",
  };

  return (
    <div className={cn(orientationClasses[orientation], className)}>
      {children}
    </div>
  );
}

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "bordered";
}

export function ResponsiveTable({
  children,
  className,
  variant = "default",
}: ResponsiveTableProps) {
  const variantClasses = {
    default: "table-responsive",
    compact: "table-responsive text-sm",
    bordered: "table-responsive border border-slate-200 rounded-lg",
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
}

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  layout?: "stacked" | "grid" | "responsive";
}

export function ResponsiveForm({
  children,
  className,
  layout = "responsive",
}: ResponsiveFormProps) {
  const layoutClasses = {
    stacked: "space-y-4 sm:space-y-6",
    grid: "form-grid-responsive",
    responsive: "form-responsive",
  };

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  );
}

interface ResponsiveModalProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function ResponsiveModal({
  children,
  className,
  size = "md",
}: ResponsiveModalProps) {
  const sizeClasses = {
    sm: "w-[95vw] sm:w-96",
    md: "w-[95vw] sm:w-[500px]",
    lg: "w-[95vw] sm:w-[700px]",
    xl: "w-[95vw] sm:w-[900px]",
    full: "w-[95vw] sm:w-[95vw] lg:w-[90vw]",
  };

  return (
    <div className={cn("modal-mobile", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface ResponsiveSpacingProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveSpacing({
  children,
  className,
  spacing = "md",
}: ResponsiveSpacingProps) {
  const spacingClasses = {
    sm: "space-mobile",
    md: "space-y-3 sm:space-y-4 lg:space-y-6",
    lg: "space-y-4 sm:space-y-6 lg:space-y-8",
    xl: "space-y-6 sm:space-y-8 lg:space-y-12",
  };

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "column" | "responsive";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}

export function ResponsiveFlex({
  children,
  className,
  direction = "responsive",
  align = "start",
  justify = "start",
}: ResponsiveFlexProps) {
  const directionClasses = {
    row: "flex flex-row",
    column: "flex flex-col",
    responsive: "flex-responsive",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div
      className={cn(
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
} 