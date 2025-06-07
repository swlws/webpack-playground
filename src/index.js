// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { helloWorld } from './business/hello-world/index.js';
import { logCsvData } from './business/load-csv/index.js';

import './list-all-code-file.js';

console.log(
  '%c使用 webpack.ProvidePlugin 全局引入的 lodash 模块：',
  'color: red;font-weight: bold;'
);
console.log(_);

main();

function main() {
  helloWorld();

  logCsvData();
}
