// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

// Store original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Helper function to check if a warning should be suppressed
const shouldSuppressWarning = (args: any[]): boolean => {
  try {
    const firstArg = String(args[0] || '');
    const secondArg = String(args[1] || '');
    const allArgs = args.map(arg => String(arg)).join(' ');

    // Comprehensive check for defaultProps warnings
    const isDefaultPropsWarning = 
      firstArg.includes('Support for defaultProps will be removed') ||
      secondArg.includes('Support for defaultProps will be removed') ||
      allArgs.includes('Support for defaultProps will be removed') ||
      firstArg.includes('defaultProps will be removed') ||
      allArgs.includes('defaultProps will be removed');

    // Additional check for specific Recharts components including numbered variants
    const isRechartsWarning =
      allArgs.includes('XAxis') ||
      allArgs.includes('YAxis') ||
      allArgs.includes('XAxis2') ||
      allArgs.includes('YAxis2') ||
      allArgs.includes('CartesianGrid') ||
      allArgs.includes('Tooltip') ||
      allArgs.includes('Legend') ||
      allArgs.includes('ResponsiveContainer') ||
      allArgs.includes('BarChart') ||
      allArgs.includes('LineChart') ||
      allArgs.includes('PieChart') ||
      allArgs.includes('Area') ||
      allArgs.includes('Bar') ||
      allArgs.includes('Line') ||
      allArgs.includes('Pie') ||
      allArgs.includes('Cell') ||
      allArgs.includes('Surface') ||
      allArgs.includes('ReferenceLine') ||
      allArgs.includes('ReferenceArea') ||
      allArgs.includes('Brush') ||
      allArgs.includes('FunnelChart') ||
      allArgs.includes('Funnel') ||
      allArgs.includes('RadarChart') ||
      allArgs.includes('Radar') ||
      allArgs.includes('PolarGrid') ||
      allArgs.includes('PolarAngleAxis') ||
      allArgs.includes('PolarRadiusAxis');

    return isDefaultPropsWarning || isRechartsWarning;
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
        if (errorMessage.includes('defaultProps') || errorMessage.includes('XAxis') || errorMessage.includes('YAxis')) {
          return;
        }
        throw error;
      }
    };
  }
}

export {};
