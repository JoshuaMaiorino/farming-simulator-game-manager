import path from 'path'
import fs from 'fs/promises'

import settings from 'electron-settings'
import { parseStringPromise, Builder} from 'xml2js'

import { GameSettings } from '@/utils/Files.js'
import { DefaultModFolder } from '@/utils/Constants.js'
import { GameDirectory } from '@utils/Settings.js'

const getActiveModDirectory = async () => {
    
    const gameDir = await settings.get(GameDirectory)

    if( !gameDir ){
        throw new Error('The Game Directory has not been set.')
    }

    const gameSettingsFilePath = path.join(gameDir, GameSettings)

    const gameSettingsData = await fs.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
    const gameSettingsJson = await parseStringPromise(gameSettingsData)
    
    const activeModDir = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory
    const modOverrideActive = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active

    return modOverrideActive == 'true' ? activeModDir : path.join( gameDir, DefaultModFolder.name )

}

const setActiveModDirectory = async (dir) => {
    
    const gameDir = await settings.get(GameDirectory)
    const gameSettingsFilePath = path.join(gameDir, GameSettings)

    if( !gameDir ){
        throw new Error('The Game Directory has not been set.')
    }

    const gameSettingsData = await fs.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
    const gameSettingsJson = await parseStringPromise(gameSettingsData)

    gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory = dir
    gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active = dir == path.join( gameDir, DefaultModFolder.name )

    const builder = new Builder();
    const xml = builder.buildObject(gameSettingsJson);
    
    await fs.writeFile(gameSettingsFilePath,xml)
    
    console.log("successfully written our update xml to file")

}

module.exports = {
    getActiveModDirectory
    , setActiveModDirectory
}