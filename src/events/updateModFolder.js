import { updateModFolder } from '@/utils/ModFolder.js'

export const execute = async (win, event, name, modFolder) => {
    return await updateModFolder(name, modFolder)
}