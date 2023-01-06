const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openDialog: () => ipcRenderer.invoke('dialog:openDirectory'),
    getCurrentModFolder: (gameDir) => ipcRenderer.invoke('get-current-mod-folder', gameDir),
    getAllModFolders: (gameDir) => ipcRenderer.invoke('get-all-mod-folders', gameDir),
    getModFolder: (gameDir, name) => ipcRenderer.invoke('get-mod-folder', gameDir, name),
    updateModFolder: (gameDir, name, modFolder) => ipcRenderer.invoke('update-mod-folder', gameDir, name, modFolder),
    deleteModFolder: (gameDir, name) => ipcRenderer.invoke('delete-mod-folder', gameDir, name),
    copyModFolder: (gameDir, name, newName) => ipcRenderer.invoke('copy-mod-folder', gameDir, name, newName),
    getModFiles: (gameDir, name) => ipcRenderer.invoke('get-mod-files', gameDir, name),
    addModFile:(gameDir, modFolderName, filePath) => ipcRenderer.invoke('add-mod-file', gameDir, modFolderName, filePath),
    setCurrentModFolder: (gameDir, name) => ipcRenderer.invoke('set-current-mod-folder', gameDir, name),
    openModFolder: (gameDir, modFolderName ) => ipcRenderer.invoke('open-mod-folder', gameDir, modFolderName ),
    launchGame: () => ipcRenderer.invoke('launch-game'),
    downloadRemoteMods: (gameDir, name) => ipcRenderer.invoke('download-remote-mods', gameDir, name),
    recieveMessage: (channel, func) => ipcRenderer.on(channel, func)
})