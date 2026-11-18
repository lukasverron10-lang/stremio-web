const { app, BrowserWindow, shell, session } = require('electron');
const path = require('node:path');

const isDevelopment = !app.isPackaged;
let mainWindow;

function openExternal(url) {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
    shell.openExternal(url).catch(() => {});
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1480,
        height: 940,
        minWidth: 1024,
        minHeight: 680,
        show: false,
        autoHideMenuBar: true,
        backgroundColor: '#080a0f',
        title: 'ONNEY Cinema',
        icon: path.join(__dirname, '..', 'assets', 'favicons', 'icon_256x256.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true,
            spellcheck: false
        }
    });

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        openExternal(url);
        return { action: 'deny' };
    });
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith('file://')) return;
        event.preventDefault();
        openExternal(url);
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const entry = path.join(__dirname, '..', 'build', 'index.html');
    mainWindow.loadFile(entry);
    if (isDevelopment) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
        callback(['media', 'notifications'].includes(permission));
    });
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
