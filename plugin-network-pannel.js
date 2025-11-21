(function () {
  const logs = [];

  const style = document.createElement('style');
  style.innerHTML = `
    #network-toast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 100000;
      display: none;
      opacity: 0;
      transition: opacity 0.4s;
    }
    #network-monitor-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      padding: 8px 12px;
      background: #333;
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    #network-monitor-panel {
      position: fixed;
      width: 480px;
      height: 500px;
      background: #1e1e1e;
      color: #ddd;
      z-index: 99998;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      font-family: monospace;
      display: none;
      border-radius: 8px;
      top: 100px;
      left: calc(50% - 240px);
      display: flex;
      flex-direction: column;
    }
    #network-monitor-header {
      flex: 0 0 auto;
      background: #333;
      color: white;
      padding: 6px 10px;
      font-weight: bold;
      user-select: none;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    #network-monitor-header .title {
      flex-grow: 1;
    }
    #network-monitor-header .actions button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      margin-left: 6px;
    }
    #network-monitor-body {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      padding: 10px;
      gap: 10px;
      overflow: hidden;
    }
    #network-monitor-body .controls {
      flex: 0 0 auto;
    }
    #network-monitor-body #network-log-container {
      flex: 1 1 auto;
      overflow-y: auto;
      border-top: 1px solid #444;
      padding-top: 8px;
    }
    .summary-header {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      font-size: 13px;
    }
    .status {
      font-weight: bold;
    }
    .status.ok200 { color: #00d47f; }
    .status.error { color: #ff6f6f; }
    .summary-path {
      color: #9cdcfe;
      font-size: 12px;
      margin-top: 4px;
      word-break: break-word;
    }
    .log-item {
      border-bottom: 1px solid #444;
      margin-bottom: 8px;
      padding-bottom: 8px;
      cursor: pointer;
    }
    .log-details {
      margin-top: 6px;
      display: none;
    }
    .log-details pre {
      white-space: pre-wrap;
      word-break: break-word;
      color: #ce9178;
      margin: 4px 0;
    }
    .log-item.expanded .log-details {
      display: block;
    }
    .copy-btn {
      background: #555;
      color: white;
      padding: 2px 6px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 4px;
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('div');
  btn.id = 'network-monitor-btn';
  btn.textContent = '网络监控';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'network-monitor-panel';
  document.body.appendChild(panel);

  const toast = document.createElement('div');
  toast.id = 'network-toast';
  document.body.appendChild(toast);
  panel.style.display = 'none';

  panel.innerHTML = `
    <div id="network-monitor-header">
      <span class="title">网络监控</span>
      <span class="actions">
        <button id="monitor-export" title="导出日志">📤</button>
        <button id="monitor-close" title="关闭">✖</button>
      </span>
    </div>
    <div id="network-monitor-body">
      <div class="controls">
        <input id="network-search" type="text" placeholder="搜索 URL..." />
        <select id="method-filter">
          <option value="ALL">全部方法</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div id="network-log-container"></div>
    </div>
  `;

  const closeBtn = panel.querySelector('#monitor-close');
  const exportBtn = panel.querySelector('#monitor-export');

  let searchText = '';
  let filterMethod = 'ALL';
  let isDragging = false;
  let offsetX = 0,
    offsetY = 0;

  function formatTime(date) {
    return date.toLocaleTimeString();
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast('复制成功'));
  }
  function exportLogs() {
    const cleanLogs = logs.map((log) => ({
      method: log.method,
      url: log.url,
      status: log.status,
      time: log.time.toISOString(),
      requestBody: log.requestBody,
      response: log.response,
    }));
    const blob = new Blob([JSON.stringify(cleanLogs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `network-logs-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function showToast(msg) {
    const el = document.getElementById('network-toast');
    el.textContent = msg;
    el.style.display = 'block';
    el.style.opacity = '1';
    clearTimeout(el.hideTimer);
    el.hideTimer = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.4s';
      setTimeout(() => {
        el.style.display = 'none';
        el.style.transition = '';
      }, 400);
    }, 1500);
  }

  function updatePanel() {
    const logContainer = document.querySelector('#network-log-container');
    const searchInput = document.querySelector('#network-search');
    const methodFilter = document.querySelector('#method-filter');
    searchText = searchInput?.value || '';
    filterMethod = methodFilter?.value || 'ALL';
    logContainer.innerHTML = '';
    logs
      .filter(
        (log) =>
          (filterMethod === 'ALL' || log.method === filterMethod) &&
          (!searchText || log.url.includes(searchText))
      )
      .forEach((log) => {
        const item = document.createElement('div');
        item.className = 'log-item';
        if (log.expanded) item.classList.add('expanded');
        const statusClass = log.status === 200 ? 'ok200' : 'error';
        item.innerHTML = `
          <div class="log-summary">
            <div class="summary-header">
              <span class="time">${formatTime(log.time)}</span>
              <span class="method">${log.method}</span>
              <span class="status ${statusClass}">[${log.status}]</span>
            </div>
            <div class="summary-path">${log.url}</div>
          </div>
          <div class="log-details">
            ${
              log.requestBody
                ? `<div><strong>Request Body:</strong><button class=\"copy-btn\">复制请求内容</button><pre>${log.requestBody}</pre></div>`
                : ''
            }
            <div><strong>Response:</strong><button class=\"copy-btn\">复制响应内容</button><pre>${
              log.response
            }</pre></div>
          </div>
        `;
        const copyButtons = item.querySelectorAll('.copy-btn');
        copyButtons.forEach((btn) => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const text = btn.nextElementSibling.textContent;
            copyToClipboard(text);
          };
        });
        item.onclick = () => {
          log.expanded = !log.expanded;
          updatePanel();
        };
        logContainer.appendChild(item);
      });
  }
  btn.onclick = () => {
    const wasHidden = panel.style.display === 'none';
    panel.style.display = wasHidden ? 'flex' : 'none';
    if (wasHidden) updatePanel();
  };
  closeBtn.onclick = () => (panel.style.display = 'none');
  exportBtn.onclick = exportLogs;

  const searchInput = () => document.querySelector('#network-search');
  const methodFilter = () => document.querySelector('#method-filter');
  document.addEventListener('input', (e) => {
    if (e.target === searchInput() || e.target === methodFilter()) {
      updatePanel();
    }
  });

  panel
    .querySelector('#network-monitor-header')
    .addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });
  document.addEventListener('mouseup', () => (isDragging = false));

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const [url, config = {}] = args;
    const method = (config.method || 'GET').toUpperCase();
    const body = config.body;
    const reqBody = body
      ? typeof body === 'string'
        ? body
        : JSON.stringify(body)
      : null;
    const time = new Date();
    const res = await originalFetch.apply(this, args);
    const clone = res.clone();
    const text = await clone.text();
    logs.push({
      method,
      url,
      time,
      requestBody: reqBody,
      response: text,
      status: res.status,
      expanded: false,
    });
    if (panel.style.display !== 'none') updatePanel();
    return res;
  };
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new OriginalXHR();
    let method = '',
      url = '',
      requestBody = null,
      time = null;
    const open = xhr.open;
    const send = xhr.send;
    xhr.open = function (_method, _url, ...rest) {
      method = _method.toUpperCase();
      url = _url;
      return open.call(this, _method, _url, ...rest);
    };
    xhr.send = function (body) {
      time = new Date();
      if (body)
        requestBody = typeof body === 'string' ? body : JSON.stringify(body);
      this.addEventListener('load', function () {
        logs.push({
          method,
          url,
          time,
          requestBody,
          response: this.responseText,
          status: this.status,
          expanded: false,
        });
        if (panel.style.display !== 'none') updatePanel();
      });
      return send.call(this, body);
    };
    return xhr;
  };
})();
