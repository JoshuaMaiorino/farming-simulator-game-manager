import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import settings from 'electron-settings'
import { GameDirectory } from './utils/Settings.js'
const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'

//import { getCurrentModFolder, getAllModFolders, getModFolder, updateModFolder, deleteModFolder, copyModFolder, getModFolderDir, setCurrentModFolder } from './utils/modFolderHelper.js'

import folderHelper from './utils/modFolderHelper.js'
import modHelper from './utils/modFilesHelper.js'
import remoteModFiles from './utils/remoteModFiles.js'
import { copyModFolder } from './utils/ModFolder.js'

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

  settings.setSync(GameDirectory, 'C:\\Users\\JoshMaiorino\\OneDrive - BEMA Information Technologies LLC\\Documents\\My Games\\FarmingSimulator2022')

  ipcMain.handle('open-mod-folder', async(event, gameDir, moldFolderName) => {
    try{
      await shell.openPath( folderHelper.getModFolderDir(gameDir, moldFolderName) )
      event.sender.send('open-mod-folder', 'Opened Sucessfully')
    }catch (err)
    {
      console.log(err)
      event.returnValue = err
    }
  })

  ipcMain.handle('launch-game', async () => {
    shell.openExternal('steam://rungameid//1248130')
  })

  ipcMain.handle('get-all-mod-folders', async (event, gameDir) => {
    try{
      const data = await folderHelper.getAllModFolders(gameDir)
      return data
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }

  })

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

  ipcMain.handle('get-current-mod-folder', async (event, gameDir) => {
    try{
      return await folderHelper.getCurrentModFolder(gameDir)
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('get-mod-folder', async (event, gameDir, name) => {
    try{
      console.log( gameDir, name )
      const data = await folderHelper.getModFolder( gameDir, name)
      return data
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('update-mod-folder', async (event, gameDir, name, modFolder) => {
    try{
      return await folderHelper.updateModFolder(gameDir, name, modFolder)
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('delete-mod-folder', async (event, gameDir, name) => {
    try{
      return await folderHelper.deleteModFolder(gameDir, name)
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('set-current-mod-folder', async (event, gameDir, name) => {
    try{
      return await folderHelper.setCurrentModFolder(gameDir, name)
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
        return await remoteModFiles(remoteUrl, folderDir, percentComplete => {
          event.sender.send('download-remote-mods', percentComplete)
        })
      }
    }
    catch(err)
    {
      console.log(err)
    }
  })

  ipcMain.handle('copy-mod-folder', async (event, name, newName) => {
        
    try{
      await copyModFolder(name, newName)
    }
    catch (err)
    {
      console.log( err )
      event.returnValue = err
    }
  })

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })

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
