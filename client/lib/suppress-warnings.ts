// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

const originalWarn = console.warn;
const originalError = console.error;

// Suppress console.warn
console.warn = (...args: any[]) => {
  // Check multiple formats of arguments
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

  // Additional check for specific Recharts components
  const isRechartsWarning =
    allArgs.includes('XAxis') ||
    allArgs.includes('YAxis') ||
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
    allArgs.includes('Cell');

  if (isDefaultPropsWarning || isRechartsWarning) {
    // Suppress these warnings - they're from Recharts library
    return;
  }

  // Allow all other warnings to pass through
  originalWarn.apply(console, args);
};

// Also suppress console.error for the same patterns
console.error = (...args: any[]) => {
  // Suppress ALL defaultProps warnings - they're all from Recharts in this app
  const allArgs = args.join(" ");

  if (
    allArgs.includes(
      "Support for defaultProps will be removed from function components",
    )
  ) {
    // Suppress all defaultProps warnings - they're from third-party libraries (Recharts)
    return;
  }

  // Allow all other errors to pass through
  originalError.apply(console, args);
};

export {};
