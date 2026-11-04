const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const START_URL = 'https://happybingo.ph';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const script = n => fs.readFileSync(path.join(__dirname, 'scripts', n), 'utf8');

let win, mobile = false;

function run(name) {
  win.webContents.executeJavaScript(script(name)).catch(e => dialog.showErrorBox('Script error', String(e)));
}

function setMobile(on) {
  mobile = on;
  const wc = win.webContents;
  if (on) {
    wc.setUserAgent(MOBILE_UA);
    wc.enableDeviceEmulation({
      screenPosition: 'mobile',
      screenSize: { width: 412, height: 915 },
      viewSize: { width: 412, height: 915 },
      deviceScaleFactor: 2.6,
      scale: 1,
    });
  } else {
    wc.setUserAgent('');
    wc.disableDeviceEmulation();
  }
  wc.reload();
}

function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    {
      label: 'Tools',
      submenu: [
        { label: 'Test panel (monitor + animations)', accelerator: 'CmdOrCtrl+1', click: () => run('hbtest.js') },
        { type: 'separator' },
        { label: 'Mobile view', type: 'checkbox', checked: false, accelerator: 'CmdOrCtrl+M', click: i => setMobile(i.checked) },
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win.webContents.reload() },
        { label: 'Back to HappyBingo', click: () => win.loadURL(START_URL) },
        { label: 'Open any URL...', click: askUrl },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
  ]));
}

function askUrl() {
  const w = new BrowserWindow({ width: 460, height: 130, parent: win, modal: true, resizable: false, minimizable: false, autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false } });
  w.loadURL('data:text/html,' + encodeURIComponent(`<body style="font:14px sans-serif;padding:14px">
    <input id=u style="width:100%;padding:6px" value="https://" autofocus>
    <button style="margin-top:10px;padding:5px 16px" onclick="require('electron').ipcRenderer.send('go',document.getElementById('u').value)">Go</button>
    <script>document.getElementById('u').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('button').click()})</script></body>`));
  require('electron').ipcMain.once('go', (_e, url) => { w.close(); if (/^https?:\/\//.test(url)) win.loadURL(url); });
}

app.whenReady().then(() => {
  win = new BrowserWindow({ width: 1100, height: 800, title: 'HB QA Tools' });
  buildMenu();
  win.loadURL(START_URL);
  // Re-arm tools after every page load by keeping them manual: use Tools menu or Ctrl/Cmd+1 / +2.
});
app.on('window-all-closed', () => app.quit());
