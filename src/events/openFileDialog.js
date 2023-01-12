import { dialog } from 'electron'
    
export const execute = async (win) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile']
    })
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}
