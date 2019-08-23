const {app, BrowserWindow} = require('electron');
const url = 'http://127.0.0.1:8800';
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 618,
        minWidth: 1100,
        minHeight: 618,
        //frame: false,//是否有菜单栏
        autoHideMenuBar: true
        //fullscreen: true
    });
    mainWindow.loadURL(url + "/login");
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow);
app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit());
app.on('activate', () => !mainWindow && createWindow());
//用户免授权
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');