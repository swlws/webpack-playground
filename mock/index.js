const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { logRed, logGreen, logYellow } = require('../tools/log-color');

let mockRoutes = [];
const mockDir = path.resolve(__dirname, './interface');

function loadMocks() {
  mockRoutes = [];

  const files = fs.readdirSync(mockDir);
  files.forEach((file) => {
    const filePath = path.join(mockDir, file);

    // 清除缓存
    delete require.cache[require.resolve(filePath)];

    const routes = require(filePath);
    if (Array.isArray(routes)) {
      mockRoutes.push(...routes);
    }
  });

  console.log('[mock] loaded routes, this is the list:');
  mockRoutes.forEach((route) => {
    const { method, path, enable } = route;
    const str = `\t${method} ${path} (${enable ? 'enabled' : 'disabled'})`;
    const logFun = enable ? logGreen : logRed;
    logFun(str);
  });
  console.log();
}
loadMocks();

chokidar.watch(mockDir).on('change', () => {
  console.log('[mock] mock files changed, reloading...');
  loadMocks();
});

function findMock(req) {
  const method = req.method.toUpperCase();
  const path = req.path;

  return mockRoutes.find(
    (route) =>
      route.enable !== false && route.method === method && route.path === path
  );
}

module.exports = function mockMiddleware(req, res, next) {
  // 只对 /api 开头的接口进行 mock
  if (!req.path.startsWith('/api/')) return next();

  const match = findMock(req);
  if (match && typeof match.handler === 'function') {
    logYellow(`[mock] ${match.method} ${match.path} -> mock`);
    return match.handler(req, res);
  }

  return next(); // ✅ 不启用 mock 的走真实接口
};
