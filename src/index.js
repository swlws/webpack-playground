import { helloWorld } from './business/hello-world/index.js';
import { logCsvData } from './business/load-csv/index.js';

main();

function main() {
  helloWorld();

  logCsvData();
}
