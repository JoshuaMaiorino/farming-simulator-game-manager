import { join } from 'path'
import { homedir } from 'os'

export const defaultGameDirectory = join( homedir(), "Documents", "My Games", "FarmingSimulator2022" )

export const gameDirectory = 'gameDirectory'
export const gamePath = 'gamePath'
