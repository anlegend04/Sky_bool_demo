// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

const originalWarn = console.warn;
const originalError = console.error;

// Suppress console.warn
console.warn = (...args: any[]) => {
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

  // Allow all other warnings to pass through
  originalWarn.apply(console, args);
};

// Also suppress console.error for the same patterns
console.error = (...args: any[]) => {
  // Suppress specific Recharts defaultProps warnings
  const allArgs = args.join(" ");

  if (
    allArgs.includes(
      "Support for defaultProps will be removed from function components",
    )
  ) {
    // Check if it's any Recharts component - check all arguments
    const rechartsComponentPattern =
      /(XAxis|YAxis|CartesianGrid|Tooltip|Legend|PolarGrid|PolarAngleAxis|PolarRadiusAxis|Radar|Bar|Line|Pie|Cell|ResponsiveContainer|Surface|ReferenceLine|ReferenceArea|Brush|ErrorBar)\d*/;

    const isRechartsComponent = rechartsComponentPattern.test(allArgs);

    if (isRechartsComponent) {
      // Suppress this error - it's from Recharts library, not our code
      return;
    }
  }

  // Allow all other errors to pass through
  originalError.apply(console, args);
};

export {};
