const marked = require('marked');
const { logYellow } = require('../../tools/log-color.js');
const loaderUtils = require('loader-utils');

module.exports = function (source) {
  logYellow('【md-loader】开始处理 Markdown 文件');

  // 获取 loader 配置选项
  // const options = loaderUtils.getOptions(this) || {};
  // 获取 loader 配置选项 - Webpack 5 方式
  const options = this.getOptions ? this.getOptions() : getOptions(this);

  // 配置 marked
  marked.setOptions({
    ...options,
    // 默认启用 GitHub Flavored Markdown
    gfm: true,
    // 默认启用表格支持
    tables: true,
    // 默认启用代码块高亮
    highlight:
      options.highlight ||
      function (code, lang) {
        return `<pre><code class="language-${lang}">${code}</code></pre>`;
      },
  });

  // 转换 Markdown 为 HTML
  const html = marked.parse(source);

  // 返回处理后的内容
  // 默认导出为字符串，也可以包装为模块
  return `export default ${JSON.stringify(html)}`;
};
