/**
 * 枚举所有文件
 */

window.listJsFile = () => {
  const context = require.context('./', true, /\.js$/);
  context.keys().forEach((filePath) => {
    console.log(filePath);
    // 导入 filePath 对应的模块
    const module = context(filePath);
    // 打印模块的导出内容
    console.log(module);
  });
};
