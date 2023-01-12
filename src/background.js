import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'

import events from '@/utils/Events'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setMenuBarVisibility(false)

  //Import Event Handlers
  for( const key in events) {
    try {
      const eventHandler = await import('@/events/' + key)
      ipcMain.handle(key, async(event, ...args) => {
        return await eventHandler.execute(win, event, ...args)
      })
    }
    catch(err)
    {
      console.log( key + ' event not implemented')
    }
  }

/*

  ipcMain.handle('get-mod-files', async (event, gameDir, name) => {
    try{
      return await modHelper.getModFiles(folderHelper.getModFolderDir(gameDir, name))
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('add-mod-file', async (event, gameDir, modFolderName, filePath) => {
    try{
      return await modHelper.addModFile(folderHelper.getModFolderDir(gameDir, modFolderName), filePath)
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('download-remote-mods', async(event,gameDir, name) => {
    try{
      const modFolder = await folderHelper.getModFolder(gameDir, name)
      const remoteUrl = modFolder.remoteUrl
      const folderDir = await folderHelper.getModFolderDir(gameDir, name )
      if( remoteUrl )
      {
        return await downloadMods(remoteUrl, folderDir, percentComplete => {
          event.sender.send('download-remote-mods', percentComplete)
        })
      }
    }
    catch(err)
    {
      console.log(err)
    }
  })

*/

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
