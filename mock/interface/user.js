module.exports = [
  {
    method: 'GET',
    path: '/api/mock/user',
    enable: true, // ✅ 启用 mock
    handler: (req, res) => {
      res.json({ id: 1, name: 'Mock User' });
    },
  },
  {
    method: 'POST',
    path: '/api/mock/login',
    enable: false, // ❌ 禁用 mock，走真实后端
    handler: (req, res) => {
      res.json({ token: 'mock-token' });
    },
  },
];
