// Aggressive warning suppression for Recharts defaultProps warnings
// This must run before any other code to properly intercept warnings

// Immediately store original console methods before any other code runs
const originalConsoleWarn = console.warn.bind(console);
const originalConsoleError = console.error.bind(console);

// Create the most aggressive suppression function
const suppressRechartsWarnings = (...args: any[]): boolean => {
  const message = args.join(" ");

  // Check for defaultProps warnings
  const isDefaultPropsWarning = message.includes(
    "Support for defaultProps will be removed",
  );

  // Check for Recharts components
  const isRechartsComponent =
    /\b(XAxis|YAxis|XAxis2|YAxis2|CartesianGrid|Tooltip|Legend|ResponsiveContainer|BarChart|LineChart|PieChart|Area|Bar|Line|Pie|Cell|Surface|ReferenceLine|ReferenceArea|Brush|FunnelChart|Funnel|RadarChart|Radar|PolarGrid|PolarAngleAxis|PolarRadiusAxis|ChartLayoutContextProvider|CategoricalChartWrapper)\b/.test(
      message,
    );

  // Suppress if it's a defaultProps warning related to Recharts
  return isDefaultPropsWarning && isRechartsComponent;
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
  ["warn", "error", "log"].forEach((method) => {
    if (globalConsole && globalConsole[method]) {
      const originalMethod = globalConsole[method].bind(globalConsole);
      globalConsole[method] = (...args: any[]) => {
        if (method === "warn" || method === "error") {
          if (suppressRechartsWarnings(...args)) {
            return;
          }
        }
        originalMethod(...args);
      };
    }
  });

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
}

export default {};
