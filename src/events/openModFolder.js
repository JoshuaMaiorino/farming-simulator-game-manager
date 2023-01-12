import { shell } from 'electron'
import { getModFolderDir } from '@/utils/ModFolder.js'
  
export const execute = async (win, event, name) => {
    const dir = await getModFolderDir(name)
    return await shell.openPath( dir )
}