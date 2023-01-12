import { basename } from 'path'
import { getModFolder } from '@/utils/ModFolder.js'
import { getActiveModDirectory } from '@/utils/Game.js'
  
export const execute = async () => {
    const modDir = await getActiveModDirectory()
    const modFolderName = basename(modDir)
    return await getModFolder(modFolderName)
}