/**
 * 构建时，插件会自动注释参数
 *     - 必须使用 CommonJS 模块语法，即使用 module.exports 导出
 * @param {*} param0
 * @returns
 */
module.exports = function ({ date = '未知' }) {
  return {
    cacheable: true,
    code: `module.exports = "${date}"`,
  };
};
