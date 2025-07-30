// This file must be loaded as early as possible to suppress React warnings
// It runs before React components are rendered

(function() {
  'use strict';
  
  // Store original console.warn immediately
  const originalWarn = console.warn;
  
  // Override console.warn to intercept React warnings
  console.warn = function(format, ...args) {
    // React warnings often use format strings with %s placeholders
    if (typeof format === 'string') {
      // Check for the specific defaultProps warning
      if (format.includes('Support for defaultProps will be removed from function components')) {
        // Check if this warning is about Recharts components
        const componentName = args[0];
        if (typeof componentName === 'string') {
          const rechartsComponents = [
            'XAxis', 'YAxis', 'XAxis2', 'YAxis2', 'CartesianGrid', 
            'Tooltip', 'Legend', 'ResponsiveContainer', 'BarChart', 
            'LineChart', 'PieChart', 'Area', 'Bar', 'Line', 'Pie', 
            'Cell', 'Surface', 'ReferenceLine', 'ReferenceArea'
          ];
          
          if (rechartsComponents.some(comp => componentName.includes(comp))) {
            // Suppress this warning - it's a Recharts defaultProps warning
            return;
          }
        }
      }
      
      // Also check if the full warning contains Recharts-related content
      const fullWarning = format + ' ' + args.join(' ');
      if (fullWarning.includes('defaultProps') && 
          (fullWarning.includes('recharts') || 
           fullWarning.includes('XAxis') || 
           fullWarning.includes('YAxis'))) {
        return;
      }
    }
    
    // If it's not a Recharts defaultProps warning, let it through
    return originalWarn.apply(console, [format, ...args]);
  };
  
  // Also try to intercept at the window level
  if (typeof window !== 'undefined') {
    const originalWindowWarn = window.console.warn;
    window.console.warn = console.warn;
  }
})();
