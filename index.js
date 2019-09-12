const {app, BrowserWindow, ipcMain} = require('electron');

const url = 'http://127.0.0.1:8800';
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 1100,
        minHeight: 618,
        autoHideMenuBar: true,
        enableLargerThanScreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url + "/login");
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null)
}

function preview(value) {
    //大屏模拟器
    let screen = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        fullscreen: true
    });
    screen.loadURL(url + "/preview?id=" + value);
    screen.on('closed', () => {
        control.isDestroyed() || control.close();
        screen = null
    });

    //控制端模拟器
    let control = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        alwaysOnTop: true
    });
    control.loadURL(url + "/control");
    control.on('closed', () => {
        screen.isDestroyed() || screen.close();
        control = null
    })
}

ipcMain.on('message', (event, msg) => {
    try {
        msg = JSON.parse(msg);
    } catch (e) {
        console.log("ipc接受消息格式错误", e);
        return
    }
    switch (msg.key) {
        //预览
        case "preview":
            preview(msg.value);
            break;
        default:
    }
});

app.on('ready', createWindow);
app.on('window-all-closed', () => (process.platform !== 'darwin') && app.quit());
app.on('activate', () => !mainWindow && createWindow());
//用户免授权
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');