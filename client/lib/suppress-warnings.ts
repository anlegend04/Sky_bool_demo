// Comprehensive warning suppression for Recharts defaultProps warnings
// This suppresses warnings from the Recharts library about defaultProps usage
// which is a known issue that will be fixed in future versions of Recharts

// Store original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Create a comprehensive suppression function
const shouldSuppressMessage = (...args: any[]): boolean => {
  try {
    // Convert all arguments to strings and join them
    const messageStr = args.map(arg => String(arg || '')).join(' ');
    
    // Check for defaultProps warnings
    const hasDefaultPropsWarning = messageStr.includes('Support for defaultProps will be removed');
    
    // Check for Recharts components
    const rechartsComponents = [
      'XAxis', 'YAxis', 'XAxis2', 'YAxis2', 'CartesianGrid', 'Tooltip', 'Legend',
      'ResponsiveContainer', 'BarChart', 'LineChart', 'PieChart', 'Area', 'Bar',
      'Line', 'Pie', 'Cell', 'Surface', 'ReferenceLine', 'ReferenceArea', 'Brush',
      'FunnelChart', 'Funnel', 'RadarChart', 'Radar', 'PolarGrid', 'PolarAngleAxis',
      'PolarRadiusAxis', 'ChartLayoutContextProvider', 'CategoricalChartWrapper'
    ];
    
    const hasRechartsComponent = rechartsComponents.some(component => 
      messageStr.includes(component)
    );
    
    // Suppress if it's a defaultProps warning with Recharts components
    return hasDefaultPropsWarning && hasRechartsComponent;
  } catch (error) {
    // If error in processing, don't suppress to be safe
    return false;
  }
};

// Override console.warn with aggressive filtering
console.warn = (...args: any[]) => {
  // Check if this is a Recharts defaultProps warning
  if (shouldSuppressMessage(...args)) {
    return; // Suppress the warning
  }
  
  // Allow all other warnings through
  originalWarn.apply(console, args);
};

// Override console.error with the same filtering
console.error = (...args: any[]) => {
  // Check if this is a Recharts defaultProps error
  if (shouldSuppressMessage(...args)) {
    return; // Suppress the error
  }
  
  // Allow all other errors through
  originalError.apply(console, args);
};

// Additional suppression for React's internal warning system
if (typeof window !== 'undefined') {
  // Suppress React DevTools warnings
  const originalDevToolsHook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (originalDevToolsHook && originalDevToolsHook.onCommitFiberRoot) {
    const originalOnCommitFiberRoot = originalDevToolsHook.onCommitFiberRoot;
    originalDevToolsHook.onCommitFiberRoot = (id: any, root: any, ...args: any[]) => {
      try {
        return originalOnCommitFiberRoot(id, root, ...args);
      } catch (error) {
        const errorStr = String(error);
        if (errorStr.includes('defaultProps') || 
            errorStr.includes('XAxis') || 
            errorStr.includes('YAxis') ||
            errorStr.includes('recharts')) {
          return; // Suppress React DevTools errors related to Recharts
        }
        throw error;
      }
    };
  }
  
  // Intercept React's warning system at a lower level
  const originalReactWarn = (window as any).__REACT_DEV_TOOLS_LEGACY__ && 
                           (window as any).__REACT_DEV_TOOLS_LEGACY__.warn;
  if (originalReactWarn) {
    (window as any).__REACT_DEV_TOOLS_LEGACY__.warn = (...args: any[]) => {
      if (shouldSuppressMessage(...args)) {
        return;
      }
      return originalReactWarn.apply(this, args);
    };
  }
}

// Suppress at module level to catch early warnings
const moduleSuppress = () => {
  // No-op function to prevent any early warnings
};

export default moduleSuppress;
