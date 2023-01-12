import { set } from 'electron-settings'
import { gameDirectory } from "@/utils/Settings"
import { validateGameDirectory } from "@/utils/Game.js"

export const execute = async (win, event, dir) => {
    if( await validateGameDirectory(dir) ){
        return await set(gameDirectory, dir)
    }
    return 'Invalid Directory: The Folder selected does not contain the gameSettings.xml file.'
}