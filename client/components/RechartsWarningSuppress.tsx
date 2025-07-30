import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Store original React warning function
let originalWarn: any = null;

export class RechartsWarningSuppress extends Component<Props, State> {
  private originalConsoleWarn: typeof console.warn;
  private originalConsoleError: typeof console.error;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };

    // Store original console methods
    this.originalConsoleWarn = console.warn.bind(console);
    this.originalConsoleError = console.error.bind(console);
  }

  componentDidMount() {
    this.suppressWarnings();
  }

  componentWillUnmount() {
    // Restore original console methods
    console.warn = this.originalConsoleWarn;
    console.error = this.originalConsoleError;

    // Restore React's original warn if we modified it
    if (
      originalWarn &&
      (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        ?.ReactDebugCurrentFrame
    ) {
      try {
        const internals = (React as any)
          .__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        if (internals.ReactDebugCurrentFrame) {
          console.warn = originalWarn;
        }
      } catch (e) {
        // Ignore errors in restoring
      }
    }
  }

  private suppressWarnings() {
    const isRechartsDefaultPropsWarning = (message: string) => {
      return (
        message.includes("Support for defaultProps will be removed") ||
        (message.includes("defaultProps") &&
          (message.includes("XAxis") ||
            message.includes("YAxis") ||
            message.includes("XAxis2") ||
            message.includes("YAxis2") ||
            message.includes("CartesianGrid") ||
            message.includes("Tooltip") ||
            message.includes("Legend") ||
            message.includes("ResponsiveContainer") ||
            message.includes("BarChart") ||
            message.includes("LineChart") ||
            message.includes("PieChart") ||
            message.includes("FunnelChart") ||
            message.includes("Funnel") ||
            message.includes("RadarChart") ||
            message.includes("Radar") ||
            message.includes("recharts")))
      );
    };

    // Suppress console warnings
    console.warn = (...args: any[]) => {
      const message = args.join(" ");
      // Handle both regular strings and React's template format
      const isRechartsWarning =
        isRechartsDefaultPropsWarning(message) ||
        (args[0] &&
          typeof args[0] === "string" &&
          args[0].includes("Support for defaultProps will be removed") &&
          args.some(
            (arg) =>
              typeof arg === "string" &&
              (arg.includes("XAxis") || arg.includes("YAxis")),
          ));

      if (!isRechartsWarning) {
        this.originalConsoleWarn(...args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args.join(" ");
      if (!isRechartsDefaultPropsWarning(message)) {
        this.originalConsoleError(...args);
      }
    };

    // Try to suppress React's internal warnings as well
    try {
      const internals = (React as any)
        .__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (internals?.ReactDebugCurrentFrame && !originalWarn) {
        originalWarn = console.warn;
        const originalReactWarn = console.warn;
        console.warn = function (...args: any[]) {
          const message = args.join(" ");
          if (!isRechartsDefaultPropsWarning(message)) {
            originalReactWarn.apply(console, args);
          }
        };
      }
    } catch (e) {
      // If we can't access React internals, just continue with console suppression
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if the error is related to Recharts defaultProps
    const errorMessage = error.message || "";
    if (
      errorMessage.includes("defaultProps") &&
      (errorMessage.includes("XAxis") || errorMessage.includes("YAxis"))
    ) {
      // Don't update state for Recharts warnings
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorMessage = error.message || "";
    // Only log non-Recharts errors
    if (
      !errorMessage.includes("defaultProps") ||
      (!errorMessage.includes("XAxis") && !errorMessage.includes("YAxis"))
    ) {
      console.error("React Error Boundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the chart.</div>;
    }

    return this.props.children;
  }
}
