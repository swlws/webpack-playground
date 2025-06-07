const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function logGreen(...args) {
  console.log(COLORS.green, ...args, COLORS.reset);
}
exports.logGreen = logGreen;

function logYellow(...args) {
  console.log(COLORS.yellow, ...args, COLORS.reset);
}
exports.logYellow = logYellow;

function logRed(...args) {
  console.log(COLORS.red, ...args, COLORS.reset);
}
exports.logRed = logRed;
