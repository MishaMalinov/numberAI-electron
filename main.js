const { app, BrowserWindow } = require('electron')
const path  = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1300,
      height: 600,
      webPreferences: {
        contextIsolation:true,
        nodeIntegration:true,
        preload:path.join(__dirname,'/preload.js'),
      }
    })
    win.webContents.openDevTools()
    win.loadFile('./files/index.html')
  }
  
  
  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })