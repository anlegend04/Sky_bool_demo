// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

const originalWarn = console.warn;
const originalError = console.error;

// Suppress console.warn
console.warn = (...args: any[]) => {
  // Suppress specific Recharts defaultProps warnings
  const message = args[0];
  const secondArg = args[1];

  if (
    typeof message === 'string' &&
    message.includes('Support for defaultProps will be removed from function components')
  ) {
    // Check if it's any Recharts component - the component name might be in the second argument
    const allText = [message, secondArg].join(' ');
    const rechartsComponentPattern = /(XAxis|YAxis|CartesianGrid|Tooltip|Legend|PolarGrid|PolarAngleAxis|PolarRadiusAxis|Radar|Bar|Line|Pie|Cell|ResponsiveContainer|Surface|ReferenceLine|ReferenceArea|Brush|ErrorBar)\d*/;

    const isRechartsComponent = rechartsComponentPattern.test(allText);

    if (isRechartsComponent) {
      // Suppress this warning - it's from Recharts library, not our code
      return;
    }
  }

  // Allow all other warnings to pass through
  originalWarn.apply(console, args);
};

// Also suppress console.error for the same patterns
console.error = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('Support for defaultProps will be removed from function components')
  ) {
    // Check if it's any Recharts component (including numbered variations like XAxis2, YAxis2)
    const rechartsComponentPattern = /(XAxis|YAxis|CartesianGrid|Tooltip|Legend|PolarGrid|PolarAngleAxis|PolarRadiusAxis|Radar|Bar|Line|Pie|Cell|ResponsiveContainer|Surface|ReferenceLine|ReferenceArea|Brush|ErrorBar)\d*/;

    const isRechartsComponent = rechartsComponentPattern.test(message);

    if (isRechartsComponent) {
      // Suppress this error - it's from Recharts library, not our code
      return;
    }
  }

  // Allow all other errors to pass through
  originalError.apply(console, args);
};

export {};
