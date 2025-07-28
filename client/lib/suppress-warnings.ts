// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

// Store original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Helper function to check if a warning should be suppressed
const shouldSuppressWarning = (args: any[]): boolean => {
  try {
    // Convert all arguments to strings for analysis
    const stringArgs = args.map(arg => String(arg || ''));
    const allArgs = stringArgs.join(' ');
    const firstArg = stringArgs[0] || '';

    // Check for React's formatted warning pattern: "Warning: %s: Support for defaultProps..."
    const isFormattedDefaultPropsWarning =
      firstArg.includes('Warning:') &&
      firstArg.includes('%s') &&
      firstArg.includes('Support for defaultProps will be removed');

    // Direct check for defaultProps warnings in any argument
    const isDefaultPropsWarning =
      allArgs.includes('Support for defaultProps will be removed') ||
      allArgs.includes('defaultProps will be removed');

    // Check if any argument mentions Recharts component names
    const rechartsComponents = [
      'XAxis', 'YAxis', 'XAxis2', 'YAxis2', 'CartesianGrid', 'Tooltip', 'Legend',
      'ResponsiveContainer', 'BarChart', 'LineChart', 'PieChart', 'Area', 'Bar',
      'Line', 'Pie', 'Cell', 'Surface', 'ReferenceLine', 'ReferenceArea', 'Brush',
      'FunnelChart', 'Funnel', 'RadarChart', 'Radar', 'PolarGrid', 'PolarAngleAxis',
      'PolarRadiusAxis', 'ChartLayoutContextProvider', 'CategoricalChartWrapper'
    ];

    const hasRechartsComponent = rechartsComponents.some(component =>
      allArgs.includes(component)
    );

    // Specific check for the exact warning pattern we're seeing
    const isSpecificRechartsWarning =
      firstArg.includes('Warning:') &&
      firstArg.includes('Support for defaultProps') &&
      hasRechartsComponent;

    return isFormattedDefaultPropsWarning || isDefaultPropsWarning || isSpecificRechartsWarning;
  } catch (error) {
    // If there's an error checking, don't suppress to be safe
    return false;
  }
};

// Override console.warn
console.warn = (...args: any[]) => {
  if (shouldSuppressWarning(args)) {
    // Suppress this warning - it's from Recharts library
    return;
  }
  
  // Allow all other warnings to pass through
  originalWarn.apply(console, args);
};

// Override console.error
console.error = (...args: any[]) => {
  if (shouldSuppressWarning(args)) {
    // Suppress this error - it's from Recharts library
    return;
  }
  
  // Allow all other errors to pass through
  originalError.apply(console, args);
};

// Also try to intercept React's internal warning system
if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.onCommitFiberRoot) {
    const originalOnCommitFiberRoot = hook.onCommitFiberRoot;
    hook.onCommitFiberRoot = (id: any, root: any, ...args: any[]) => {
      try {
        return originalOnCommitFiberRoot(id, root, ...args);
      } catch (error) {
        // Suppress React DevTools errors related to defaultProps
        const errorMessage = String(error);
        if (errorMessage.includes('defaultProps') ||
            errorMessage.includes('XAxis') ||
            errorMessage.includes('YAxis') ||
            errorMessage.includes('XAxis2') ||
            errorMessage.includes('YAxis2') ||
            errorMessage.includes('recharts')) {
          return;
        }
        throw error;
      }
    };
  }
}

export {};
