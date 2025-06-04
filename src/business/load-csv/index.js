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
