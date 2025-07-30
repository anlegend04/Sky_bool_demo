// Global utility to suppress Recharts defaultProps warnings
let originalWarn: typeof console.warn | null = null;
let suppressionActive = false;

export function suppressRechartsWarnings() {
  if (suppressionActive) return;
  
  suppressionActive = true;
  originalWarn = console.warn;
  
  console.warn = function(...args: any[]) {
    // Check if this is a Recharts defaultProps warning
    const message = args.join(' ');
    const isRechartsDefaultPropsWarning = 
      (args[0] && typeof args[0] === 'string' && 
       args[0].includes('Support for defaultProps will be removed')) &&
      args.some(arg => typeof arg === 'string' && 
        (arg.includes('XAxis') || arg.includes('YAxis') || 
         arg.includes('CartesianGrid') || arg.includes('Tooltip') ||
         arg.includes('Legend') || arg.includes('ResponsiveContainer') ||
         arg.includes('BarChart') || arg.includes('LineChart') ||
         arg.includes('PieChart') || arg.includes('FunnelChart') ||
         arg.includes('RadarChart')));
    
    if (!isRechartsDefaultPropsWarning) {
      originalWarn?.apply(console, args);
    }
  };
}

export function restoreWarnings() {
  if (!suppressionActive || !originalWarn) return;
  
  console.warn = originalWarn;
  suppressionActive = false;
  originalWarn = null;
}
