import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

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
    // Override console methods specifically for this component's context
    this.suppressWarnings();
  }

  componentWillUnmount() {
    // Restore original console methods
    console.warn = this.originalConsoleWarn;
    console.error = this.originalConsoleError;
  }

  private suppressWarnings() {
    const isRechartsWarning = (message: string) => {
      return (
        message.includes("Support for defaultProps will be removed") &&
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
          message.includes("recharts"))
      );
    };

    console.warn = (...args: any[]) => {
      const message = args.join(" ");
      if (!isRechartsWarning(message)) {
        this.originalConsoleWarn(...args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args.join(" ");
      if (!isRechartsWarning(message)) {
        this.originalConsoleError(...args);
      }
    };
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
