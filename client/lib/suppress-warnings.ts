// Simple warning suppression for Recharts defaultProps warnings
// This runs after React is loaded to avoid hook call issues

const originalWarn = console.warn;

console.warn = (...args: any[]) => {
  const message = args.join(" ");

  // Only suppress specific Recharts defaultProps warnings
  const isRechartsDefaultPropsWarning =
    message.includes("Support for defaultProps will be removed") &&
    (message.includes("XAxis") || message.includes("YAxis"));

  if (!isRechartsDefaultPropsWarning) {
    originalWarn.apply(console, args);
  }
};

export default {};
