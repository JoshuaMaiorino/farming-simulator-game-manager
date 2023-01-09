import { homedir } from 'os'
import { join } from 'path'

const DefaultModFolder = {
    name: "mods",
    description: "The Default Farming Simulator Mods Folder. It's recommended to not use this folder.",
    remoteUrl: null
}

const Directory = "modFolders"

const DefaultGameDirectory = join( homedir(), "Documents", "My Games", "FarmingSimulator2022" )

export default {
    DefaultModFolder,
    Directory,
    DefaultGameDirectory
}