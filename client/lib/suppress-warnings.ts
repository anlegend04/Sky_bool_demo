// Temporarily suppress known Recharts defaultProps warnings
// This is a workaround for https://github.com/recharts/recharts/issues/3615
// Remove this when Recharts is updated to fix defaultProps usage

const originalWarn = console.warn;

console.warn = (...args: any[]) => {
  // Suppress specific Recharts defaultProps warnings
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('Support for defaultProps will be removed from function components') &&
    (message.includes('XAxis') || 
     message.includes('YAxis') || 
     message.includes('CartesianGrid') ||
     message.includes('Tooltip') ||
     message.includes('Legend') ||
     message.includes('PolarGrid') ||
     message.includes('PolarAngleAxis') ||
     message.includes('PolarRadiusAxis') ||
     message.includes('Radar'))
  ) {
    // Suppress this warning - it's from Recharts library, not our code
    return;
  }
  
  // Allow all other warnings to pass through
  originalWarn.apply(console, args);
};

export {};
