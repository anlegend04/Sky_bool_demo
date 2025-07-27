import * as React from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.md);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("sm");

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint("xl");
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint("lg");
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint("md");
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("sm");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

export function useIsBreakpoint(breakpoint: Breakpoint) {
  const [isBreakpoint, setIsBreakpoint] = React.useState<boolean>(false);

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setIsBreakpoint(width >= BREAKPOINTS[breakpoint]);
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [breakpoint]);

  return isBreakpoint;
}

export function useIsSmallScreen() {
  return useIsBreakpoint("sm");
}

export function useIsMediumScreen() {
  return useIsBreakpoint("md");
}

export function useIsLargeScreen() {
  return useIsBreakpoint("lg");
}

export function useIsExtraLargeScreen() {
  return useIsBreakpoint("xl");
}

export function useIs2XLScreen() {
  return useIsBreakpoint("2xl");
}

// Hook to get screen dimensions
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
}

// Hook to detect if device is touch-enabled
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return isTouchDevice;
}
