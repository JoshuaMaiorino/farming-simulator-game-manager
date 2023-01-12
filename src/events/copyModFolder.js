import { copyModFolder } from '@/utils/ModFolder.js'

export const execute = async (win, event, name, newName) => {
    return await copyModFolder(name, newName)
}