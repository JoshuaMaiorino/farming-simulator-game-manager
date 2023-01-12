import path from 'path'
import fs from 'fs/promises'

import settings from 'electron-settings'
import { parseStringPromise, Builder} from 'xml2js'

import { gameSettings } from '@/utils/Files.js'
import { defaultModFolder } from '@/utils/Constants.js'
import { gameDirectory } from '@/utils/Settings.js'

export const getActiveModDirectory = async () => {
    
    const gameDir = await settings.get(gameDirectory)

    if( !gameDir ){
        throw new Error('The Game Directory has not been set.')
    }

    const gameSettingsFilePath = path.join(gameDir, gameSettings)

    const gameSettingsData = await fs.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
    const gameSettingsJson = await parseStringPromise(gameSettingsData)
    
    const activeModDir = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory
    const modOverrideActive = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active

    return modOverrideActive == 'true' ? activeModDir : path.join( gameDir, defaultModFolder.name )

}

export const validateGameDirectory = async(dir) => {
    const gameSettingsFilePath = path.join(dir, gameSettings)
    try 
    {
        const gameSettingFileStats = await fs.lstat(gameSettingsFilePath)
        if( !gameSettingFileStats.isFile() ) {
            return false
        }
        return true
    }
    catch
    {
        return false
    }
}

export const setActiveModDirectory = async (dir) => {
    
    const gameDir = await settings.get(gameDirectory)
    const gameSettingsFilePath = path.join(gameDir, gameSettings)

    if( !gameDir ){
        throw new Error('The Game Directory has not been set.')
    }

    const gameSettingsData = await fs.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
    const gameSettingsJson = await parseStringPromise(gameSettingsData)

    gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory = dir
    gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active = !(dir == path.join( gameDir, defaultModFolder.name ))

    const builder = new Builder();
    const xml = builder.buildObject(gameSettingsJson);
    
    await fs.writeFile(gameSettingsFilePath,xml)
    
    console.log("successfully written our update xml to file")

}