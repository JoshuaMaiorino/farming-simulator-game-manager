import { dialog } from 'electron'
import { gameDirectory, gamePath, modFolder, modeFile } from '@/utils/OpenDialogModes'
    
export const execute = async (win, event, mode) => {
    let options = { 
        title: 'Select',
        buttonLabel: 'Select',
        filters: [],
        properties: []
    }

    switch(mode){
        case gameDirectory:
            options.title = 'Select Game Directory'
            options.buttonLabel = 'Choose Folder'
            options.properties = ['openDirectory']
            break;
        case gamePath:
            options.title = 'Select the Farming Simulator exe'
            options.buttonLabel = 'Select File'
            options.properties = ['openFile']
            options.filters = [{ name:'Game', extensions:['exe','app']}]
            break;
        case modFolder:
            options.title = 'Select a folder containing Mods'
            options.buttonLabel = 'Choose Folder'
            options.properties = ['openDirectory']
            break;
        case modeFile:
            options.title = 'Select Mod File'
            options.buttonLabel = 'Select File'
            options.properties = ['openFile']
            options.filters = [{ name:'Mod Files', extensions:['zip']}]
            break;
    }
    
    const { canceled, filePaths } = await dialog.showOpenDialog(win, options)
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}
