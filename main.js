const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { autoUpdater } = require("electron-updater");
const fs = require('fs')
const path = require('path')
var temp = require('temp')
var AdmZip = require('adm-zip');

// Automatically track and cleanup files at exit
temp.track();

var file_path = null
if (process.platform == 'win32' && process.argv.length >= 2) {
  file_path = process.argv[1];
}


function open_rbsd_file(rbsd_path) {
  var zip = new AdmZip(rbsd_path);
  var temp_dir = temp.mkdirSync('atlas')
  zip.extractAllTo(temp_dir, /* overwrite */ true)
  return temp_dir
}

function get_moves_path(tempDir) {
  return path.join(tempDir, 'moves.json')
}


function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: false
    }
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('index.html')

  ipcMain.on('show-open-dialog', (event, arg)=> {
    const options = {
      title: 'Open a Robot Simulation Data file',
      buttonLabel: 'Load',
      filters: [
        { name: 'rbsd', extensions: ['rbsd'] }
      ]
    }
    dialog.showOpenDialog(null, options, (filePaths) => {
      event.sender.send('open-dialog-paths-selected', filePaths)
    });
  })

  ipcMain.on('asynchronous-message', (event, arg) => {
    win.show()
  })

  ipcMain.on('get-rbsd-moves', (event, arg) => {
    if (file_path !== null) {
      arg = file_path
      var rbsd_path = open_rbsd_file(arg)
      event.returnValue = get_moves_path(rbsd_path)
    } else {
      event.returnValue = 'index.json'
    }
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('open-file', (event, path) => {
  file_path = path
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
