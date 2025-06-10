# webpack-playground

webpack playground
  
- dev 模式. 热更新
- prod 模式
- babel 编译. 语法转换；polyfill 填充
- worker
- Http Mock

package exports

- <https://webpack.docschina.org/guides/package-exports/>

## analyze

基于`webpack-bundle-analyzer`插件

### 方式一

```bash
webpack --config webpack.prod.js --profile --json > stats.json
webpack-bundle-analyzer stats.json
```

## 方式二

```bash
webpack --analyze --config webpack.prod.js
```

## Node.js 进程参数

```bash
NODE_OPTIONS="--max-old-space-size=4096" webpack
```

## 包别名

```json
{
  "webpack": "^4.0.0",
  "webpack-5": "npm:webpack@^5.32.0",
  "webpack-cli": "^4.5.0"
}
```
