import { deleteModFolder } from '@/utils/ModFolder.js'

export const execute = async (win, event, name) => {
    return await deleteModFolder(name)
}