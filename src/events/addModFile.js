import { addModFile } from '@/utils/modFile.js'

export const execute = async (win, event, modFolder, filePath) => {
    return await addModFile(modFolder, filePath)
}