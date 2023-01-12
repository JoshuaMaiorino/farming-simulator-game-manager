import { get } from 'electron-settings'
import { gameDirectory, defaultGameDirectory } from "@/utils/Settings"

export const execute = async () => {
    const gameDir = await get(gameDirectory)

    if( gameDir )
    {
        return gameDir
    }

    return defaultGameDirectory
}