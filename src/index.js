import { helloWorld } from './business/hello-world/index.js';
import { logCsvData } from './business/load-csv/index.js';

import './list-all-code-file.js';

main();

function main() {
  helloWorld();

  logCsvData();
}
