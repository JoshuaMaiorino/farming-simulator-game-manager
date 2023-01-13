import { contextBridge, ipcRenderer } from 'electron'
import ev from '@/utils/Events'

contextBridge.exposeInMainWorld('electronAPI', {
    recieveMessage: (channel, func) => ipcRenderer.on(channel, func),
})

contextBridge.exposeInMainWorld('appSettings', {
    setGameDirectory: (dir) => ipcRenderer.invoke(ev.setGameDirectory, dir),
    getGameDirectory: () => ipcRenderer.invoke(ev.getGameDirectory),
    setGamePath:(path) => ipcRenderer.invoke(ev.setGamePath, path),
    getGamePath: () => ipcRenderer.invoke(ev.getGamePath),
    openDialog: (mode) => ipcRenderer.invoke(ev.openDialog, mode),
})

contextBridge.exposeInMainWorld('game', {
    launch: () => ipcRenderer.invoke(ev.launchGame),
    getCurrentModFolder:() => ipcRenderer.invoke(ev.getCurrentModFolder),
    setCurrentModFolder: (name) => ipcRenderer.invoke(ev.setCurrentModFolder, name),
})

contextBridge.exposeInMainWorld('modFolder', {
    openDirectory: (name) => ipcRenderer.invoke(ev.openModFolder, name),
    getAll: () => ipcRenderer.invoke( ev.getAllModFolders ),
    get: (name) => ipcRenderer.invoke(ev.getModFolder, name),
    update:(name, modFolder) => ipcRenderer.invoke(ev.updateModFolder, name, modFolder),
    delete:(name) => ipcRenderer.invoke(ev.deleteModFolder, name),
    copy:(name, newName) => ipcRenderer.invoke(ev.copyModFolder, name, newName),
    downloadRemoteMods: (name, forceRefresh ) => ipcRenderer.invoke(ev.downloadRemoteMods, name, forceRefresh)
})

contextBridge.exposeInMainWorld('modFile', {
    getAll: (modFolderName) => ipcRenderer.invoke(ev.getModFiles, modFolderName),
    addModFile: (modFolderName, filePath) => ipcRenderer.invoke(ev.addModFile, modFolderName, filePath)
})