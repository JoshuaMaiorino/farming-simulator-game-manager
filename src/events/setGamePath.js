import { set } from 'electron-settings'
import { gamePath } from "@/utils/Settings"

export const execute = async (win, event, path) => {
    return await set(gamePath, path)
}