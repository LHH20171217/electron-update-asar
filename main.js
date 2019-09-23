// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const fs = require('fs')
const {
  exec
} = require('child_process');
const log = require('electron-log');
const asar = require('asar');
const ipc = require('electron').ipcMain

// const AppPath = app.getAppPath().slice(0,-8);
// const APParchive = AppPath+'app.asar';
// const APPfilename = AppPath+'app';

const APParchive = app.getAppPath();
const APPfilename = APParchive.slice(0, -8) + 'update'


async function transformAsar() {
  const result2 = await asar.createPackage(APPfilename, APParchive);
  log.info(result2, "transformAsar");
}

// async function transformAsar() {
//   const result2 = await asar.createPackage(APParchive+'/src', APParchive+'/update.asar');
//   log.info(result2,"transformAsar");
// }

async function Asartransform() {
  const result = await asar.extractAll(APParchive, APPfilename);
  await fs.writeFile(APPfilename + '/renderer.js', `var a= ${Math.random()}`, 'utf8', function (error) {
    if (error) {
      console.log(error);
      return false;
    }
    log.info('写入成功');
  })
  log.info(result, "Asartransform");
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // log.info(AppPath,"AppPath")
  log.info(APParchive, "APParchive")
  log.info(APPfilename, "APPfilename")
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  ipc.on('asynchronous-message', function (event, arg) {
    var promise1 = Promise.resolve(Asartransform());
    promise1.then(() => {
      transformAsar();
    }).then(() => {
      setTimeout(() => {
        app.relaunch();
        app.exit();
      }, 3000);
    })
    // Asartransform();
    // transformAsar();
    log.info(asar)
    event.sender.send('asynchronous-reply', 'pong');
    log.info('asynchronous-reply-pong');
    log.info(APParchive, "APParchive2222222")
    log.info(APPfilename, "APPfilename2222222")
    // app.relaunch();
    // app.exit();
  })


  log.info('>>>>>>')
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.