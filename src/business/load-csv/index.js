import txt from '../../data/data.txt';
import csv from '../../data/data.csv';
import json5 from '../../data/data.json5';
import yaml from '../../data/data.yaml';
import toml from '../../data/data.toml';

console.log('txt data:\n', txt);
console.log('csv data:', csv);
console.log('json5 data:', json5);
console.log('yaml data:', yaml);
console.log('toml data:', toml);

/**
 * 打印 csv 数据
 */
export function logCsvData() {
  import(/* webpackChunkName: 'data_csv' */ '../../data/data.csv').then(
    (module) => {
      const formData = module.default;

      const table = document.createElement('table');
      const tbody = document.createElement('tbody');
      formData.forEach((row, index) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
          const td = document.createElement(index === 0 ? 'th' : 'td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      document.body.appendChild(table);
    }
  );
}
