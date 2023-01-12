import fs from 'fs/promises'
import path from 'path'
import settings from 'electron-settings'

import { defaultModFolder, directory } from './Constants.js'
import { gameDirectory } from './Settings.js'
import { data } from './Files.js'
import { copyFolder } from './Utils.js'

export const getModFoldersDirectory = async () => {
    
    const gameDir = await settings.get(gameDirectory)

    const modFoldersDir = path.join( gameDir, directory)
    
    try {
        const stats = await fs.lstat(modFoldersDir)
        if( !stats.isDirectory() )
        {
            // This should never actually happen
            throw new Error('The Mods Folder Directory is not a Directory')
        }
    }
    catch (err)
    {
        if( err.code === 'ENOENT' ) 
        {
            await fs.mkdir( modFoldersDir )
        }
        else
        {
            throw err
        }
    }

    return modFoldersDir
}

export const getModFolderDir =  async (name) => {
    
    const gameDir = await settings.get(gameDirectory)
    if( !gameDir ) {
        throw new Error('The Game Directory has not been set.')
    }

    if( name == defaultModFolder.name )
    {
        return path.join( gameDir, name )
    }
    else 
    {
        const foldersDir = await getModFoldersDirectory()
        const folderDir = path.join( foldersDir, name )
        try
        {
            const stats = await fs.lstat(folderDir)
            if( !stats.isDirectory() )
            {
                // This should never actually happen
                throw new Error('The Mod Folder exists, but is not a Directory')
            }
        }
        catch (err)
        {
            if( err.code === 'ENOENT' ) 
            {
                console.log('Warning: This Directory Does not Exist')
            }
            else
            {
                throw err
            }
        }

        return folderDir
    }
}
export const getModFolder = async (name) => {
    
    if( name == defaultModFolder.name )
    {
        return defaultModFolder
    }
    
    const modFolderDir = await getModFolderDir(name)
    
    try{
        const modFolderData = await fs.readFile(path.join(modFolderDir, data), { encoding: 'utf-8'})
        return JSON.parse( modFolderData )
    }
    catch(err)
    {
        if (err.code === 'ENOENT') 
        {
            console.log( 'Directory Does not Exist' )
            return { name }
        }
        throw err
    }
    
}

export const deleteModFolder = async (name) => {
    if( name == defaultModFolder.name ){
        return false
    }
    const modFolderDir = await getModFolderDir(name)
    return await fs.rmdir(modFolderDir, { recursive: true })
}

export const copyModFolder = async (name, newName) => {

    const modFolderDir = await getModFolderDir(name)
    const newModFolderDir = await getModFolderDir(newName)
    await fs.mkdir(newModFolderDir)
    await copyFolder( modFolderDir, newModFolderDir )
    
    const modFolder = await getModFolder(newName)
    modFolder.name = newName
    
    return await updateModFolder(newName, modFolder)
}

export const updateModFolder = async (name, modFolder, previousError = null) => {
    
    if( name == defaultModFolder.name ) {
        return false
    }

    const modFolderDir = await getModFolderDir(modFolder.name)
    
    try {
        if( name != modFolder.name )
        {
            const oldFolderPath = await getModFolderDir(name)
            await fs.rename(oldFolderPath, modFolderDir)
        }

        const dataFilePath = path.join(modFolderDir, data)
        await fs.writeFile( dataFilePath, JSON.stringify( modFolder) )
    }
    catch (err) {
        console.log(err)
        if( err.code == 'ENOENT' && !previousError)
        {
            await fs.mkdir(modFolderDir)
            await updateModFolder(name, modFolder, err)
        }
    }

    return true
}

export const getAllModFolders = async () => {

    let modFolders = [defaultModFolder]

    const modFoldersPath = await getModFoldersDirectory()

    try {
        let modDirs = await fs.readdir(modFoldersPath, { withFileTypes: true })
        modDirs = modDirs.filter( dir => dir.isDirectory() )
        for( const modDir of modDirs) {
            const modFolder = await getModFolder(modDir.name)
            modFolders.push( modFolder )
        }
    }
    catch( err )
    {
        console.log( err )
        return null
    }
    return modFolders
}