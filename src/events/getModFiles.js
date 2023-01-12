import { getModFiles} from "@/utils/ModFile"

export const execute = async (win, event, modFolder) => {
    return await getModFiles(modFolder)
}