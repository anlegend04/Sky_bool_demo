// This file must be loaded as early as possible to suppress React warnings
// It runs before React components are rendered

(function () {
  "use strict";

  // Store original console methods immediately
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  // More aggressive suppression function
  function shouldSuppressWarning(format, ...args) {
    // Handle React's specific warning format
    if (typeof format === "string") {
      // Check for the exact defaultProps warning pattern from React
      if (
        format.includes(
          "%s: Support for defaultProps will be removed from function components",
        ) ||
        format.includes(
          "Support for defaultProps will be removed from function components",
        )
      ) {
        // Check if any of the arguments are Recharts components
        const allArgs = [format, ...args].join(" ");
        const rechartsComponents = [
          "XAxis",
          "YAxis",
          "XAxis2",
          "YAxis2",
          "CartesianGrid",
          "Tooltip",
          "Legend",
          "ResponsiveContainer",
          "BarChart",
          "LineChart",
          "PieChart",
          "Area",
          "Bar",
          "Line",
          "Pie",
          "Cell",
          "Surface",
          "ReferenceLine",
          "ReferenceArea",
        ];

        if (rechartsComponents.some((comp) => allArgs.includes(comp))) {
          return true;
        }
      }

      // Also check for any warning that mentions defaultProps and Recharts
      const allContent = [format, ...args].join(" ");
      if (
        allContent.includes("defaultProps") &&
        (allContent.includes("XAxis") ||
          allContent.includes("YAxis") ||
          allContent.includes("recharts") ||
          allContent.includes("Recharts"))
      ) {
        return true;
      }
    }

    return false;
  }

  // Override console.warn
  console.warn = function (format, ...args) {
    if (shouldSuppressWarning(format, ...args)) {
      return; // Suppress this warning
    }
    return originalWarn.apply(console, [format, ...args]);
  };

  // Override console.error as well (some warnings might be logged as errors)
  console.error = function (format, ...args) {
    if (shouldSuppressWarning(format, ...args)) {
      return; // Suppress this error
    }
    return originalError.apply(console, [format, ...args]);
  };

  // Override console.log as a fallback
  console.log = function (format, ...args) {
    if (shouldSuppressWarning(format, ...args)) {
      return; // Suppress this log
    }
    return originalLog.apply(console, [format, ...args]);
  };

  // Override at window level
  if (typeof window !== "undefined") {
    window.console.warn = console.warn;
    window.console.error = console.error;
    window.console.log = console.log;
  }

  // Additional global error handler
  if (typeof window !== "undefined") {
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      if (typeof message === "string" && shouldSuppressWarning(message)) {
        return true; // Suppress the error
      }
      if (originalOnError) {
        return originalOnError.call(
          window,
          message,
          source,
          lineno,
          colno,
          error,
        );
      }
      return false;
    };
  }
})();
