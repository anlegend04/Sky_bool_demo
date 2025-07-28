// Aggressive warning suppression for Recharts defaultProps warnings
// This must run before any other code to properly intercept warnings

// Immediately store original console methods before any other code runs
const originalConsoleWarn = console.warn.bind(console);
const originalConsoleError = console.error.bind(console);

// Create the most aggressive suppression function
const suppressRechartsWarnings = (...args: any[]): boolean => {
  const message = args.join(" ");
  const fullString = JSON.stringify(args);

  // Check for defaultProps warnings (multiple variations)
  const isDefaultPropsWarning = message.includes("Support for defaultProps will be removed") ||
    message.includes("defaultProps will be removed") ||
    message.includes("Use JavaScript default parameters instead") ||
    fullString.includes("defaultProps");

  // More comprehensive Recharts component detection
  const isRechartsComponent =
    /\b(XAxis|YAxis|XAxis2|YAxis2|CartesianGrid|Tooltip|Legend|ResponsiveContainer|BarChart|LineChart|PieChart|Area|Bar|Line|Pie|Cell|Surface|ReferenceLine|ReferenceArea|Brush|FunnelChart|Funnel|RadarChart|Radar|PolarGrid|PolarAngleAxis|PolarRadiusAxis|ChartLayoutContextProvider|CategoricalChartWrapper)\b/.test(
      message,
    ) ||
    /\b(XAxis|YAxis|XAxis2|YAxis2|CartesianGrid|Tooltip|Legend|ResponsiveContainer|BarChart|LineChart|PieChart|Area|Bar|Line|Pie|Cell|Surface|ReferenceLine|ReferenceArea|Brush|FunnelChart|Funnel|RadarChart|Radar|PolarGrid|PolarAngleAxis|PolarRadiusAxis|ChartLayoutContextProvider|CategoricalChartWrapper)\b/.test(
      fullString,
    ) ||
    message.includes("recharts") ||
    fullString.includes("recharts");

  // Also check for the specific pattern in the stack trace
  const hasRechartsStack = message.includes("deps/recharts.js") ||
    fullString.includes("deps/recharts.js") ||
    message.includes("CategoricalChartWrapper") ||
    message.includes("ChartLayoutContextProvider");

  // Suppress if it's a defaultProps warning related to Recharts
  return (isDefaultPropsWarning && isRechartsComponent) ||
         (isDefaultPropsWarning && hasRechartsStack);
};

// Immediately override console methods
console.warn = (...args: any[]) => {
  if (suppressRechartsWarnings(...args)) {
    return; // Suppress this warning
  }
  originalConsoleWarn(...args);
};

console.error = (...args: any[]) => {
  if (suppressRechartsWarnings(...args)) {
    return; // Suppress this error
  }
  originalConsoleError(...args);
};

// Also override console.log as a fallback
const originalConsoleLog = console.log.bind(console);
console.log = (...args: any[]) => {
  if (suppressRechartsWarnings(...args)) {
    return; // Suppress this log
  }
  originalConsoleLog(...args);
};

// Override at window level immediately
if (typeof window !== "undefined") {
  const globalConsole = window.console;
  if (globalConsole && globalConsole.warn) {
    const originalGlobalWarn = globalConsole.warn.bind(globalConsole);
    globalConsole.warn = (...args: any[]) => {
      if (suppressRechartsWarnings(...args)) {
        return;
      }
      originalGlobalWarn(...args);
    };
  }

  // Intercept all console methods that might be used for warnings
  ["warn", "error", "log", "info", "debug"].forEach((method) => {
    if (globalConsole && globalConsole[method]) {
      const originalMethod = globalConsole[method].bind(globalConsole);
      globalConsole[method] = (...args: any[]) => {
        // Check all methods for Recharts warnings
        if (suppressRechartsWarnings(...args)) {
          return;
        }
        originalMethod(...args);
      };
    }
  });

  // Add specific override for React's console warnings
  if (globalConsole && globalConsole.warn) {
    const reactWarnOverride = globalConsole.warn;
    globalConsole.warn = function(format: string, ...args: any[]) {
      // Check if this is a React warning about defaultProps
      if (typeof format === 'string' && format.includes('%s')) {
        const fullMessage = format + ' ' + args.join(' ');
        if (suppressRechartsWarnings(fullMessage, ...args)) {
          return;
        }
      }
      return reactWarnOverride.call(this, format, ...args);
    };
  }

  // Try to intercept React's warning system
  const interceptReactWarnings = () => {
    // Check for React DevTools
    const reactDevTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (reactDevTools && reactDevTools.onCommitFiberRoot) {
      const originalOnCommitFiberRoot = reactDevTools.onCommitFiberRoot;
      reactDevTools.onCommitFiberRoot = (
        id: any,
        root: any,
        ...args: any[]
      ) => {
        try {
          return originalOnCommitFiberRoot(id, root, ...args);
        } catch (error) {
          const errorStr = String(error);
          if (suppressRechartsWarnings(errorStr)) {
            return;
          }
          throw error;
        }
      };
    }

    // Check for React internals
    const anyWindow = window as any;
    if (
      anyWindow.React &&
      anyWindow.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ) {
      const internals =
        anyWindow.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (
        internals.ReactDebugCurrentFrame &&
        internals.ReactDebugCurrentFrame.getCurrentStack
      ) {
        const originalGetCurrentStack =
          internals.ReactDebugCurrentFrame.getCurrentStack;
        internals.ReactDebugCurrentFrame.getCurrentStack = (...args: any[]) => {
          try {
            const result = originalGetCurrentStack.apply(
              internals.ReactDebugCurrentFrame,
              args,
            );
            if (suppressRechartsWarnings(result)) {
              return "";
            }
            return result;
          } catch (e) {
            return "";
          }
        };
      }
    }
  };

  // Run immediately if React is already loaded, otherwise wait
  if ((window as any).React) {
    interceptReactWarnings();
  } else {
    // Try multiple times to catch React loading
    const intervals = [0, 10, 50, 100, 200, 500, 1000];
    intervals.forEach((delay) => {
      setTimeout(interceptReactWarnings, delay);
    });

    // Also try when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", interceptReactWarnings);
    }
  }
}

// Monkey patch setTimeout and setInterval to catch delayed warnings
if (typeof window !== "undefined") {
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;

  window.setTimeout = ((fn: any, delay: number, ...args: any[]) => {
    const wrappedFn = (...fnArgs: any[]) => {
      try {
        return fn(...fnArgs);
      } catch (error) {
        if (!suppressRechartsWarnings(String(error))) {
          throw error;
        }
      }
    };
    return originalSetTimeout(wrappedFn, delay, ...args);
  }) as any;

  window.setInterval = ((fn: any, delay: number, ...args: any[]) => {
    const wrappedFn = (...fnArgs: any[]) => {
      try {
        return fn(...fnArgs);
      } catch (error) {
        if (!suppressRechartsWarnings(String(error))) {
          throw error;
        }
      }
    };
    return originalSetInterval(wrappedFn, delay, ...args);
  }) as any;

  // Additional global error handler
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && suppressRechartsWarnings(message)) {
      return true; // Prevent the error from being logged
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Additional unhandled promise rejection handler
  const originalOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    if (event.reason && suppressRechartsWarnings(String(event.reason))) {
      event.preventDefault();
      return;
    }
    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection(event);
    }
  };
}

// Force immediate execution of suppression
(() => {
  // Run suppression setup immediately
  console.log('%c🔇 Recharts warning suppression active', 'color: #888; font-size: 11px;');
})();

export default {};
