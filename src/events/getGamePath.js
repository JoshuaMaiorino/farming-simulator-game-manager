import { get } from 'electron-settings'
import { gamePath } from "@/utils/Settings"

export const execute = async () => {
    return await get(gamePath)
}