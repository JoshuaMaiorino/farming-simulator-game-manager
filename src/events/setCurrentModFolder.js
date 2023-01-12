import { getModFolderDir } from '@/utils/ModFolder.js'
import { setActiveModDirectory } from '@/utils/Game.js'

export const execute = async (win, event, name) => {
    const modFolderDir = await getModFolderDir(name)
    return await setActiveModDirectory(modFolderDir)
}