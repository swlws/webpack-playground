// import 'core-js/stable';

/**
 * Standalone runtime for Regenerator-compiled generator and async functions.
 */
// import 'regenerator-runtime/runtime';

import { helloWorld } from './business/hello-world/index.js';
import { logCsvData } from './business/load-csv/index.js';
import './business/worker/index.js';
import readMeDom from '../README.md';

import './list-all-code-file.js';

console.log(
  '%c使用 webpack.ProvidePlugin 全局引入的 lodash 模块：\n%c输入 _ 即可使用lodash模块',
  'color: red;font-weight: bold;',
  'color: blue;font-weight: bold;'
);

main();

function main() {
  showReadMe();

  helloWorld();

  logCsvData();
}

function showReadMe() {
  const ele = document.createElement('article');
  ele.innerHTML = readMeDom;
  document.body.appendChild(ele);
}

fetch('/api/mock/user');
fetch('/api/mock/login');
