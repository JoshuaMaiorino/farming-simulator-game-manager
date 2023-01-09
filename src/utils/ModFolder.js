import fs from 'fs/promises'
import path from 'path'
import settings from 'electron-settings'

import { DefaultModFolder, Directory } from './Constants.js'
import { GameDirectory } from './Settings.js'
import { Data } from './Files.js'
import { copyFolder } from './util.js'

const getModFoldersDirectory = async () => {
    
    console.log( GameDirectory )
    const gameDir = await settings.get(GameDirectory)

    console.log( gameDir )

    const modFoldersDir = path.join( gameDir, Directory)
    
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
const getModFolderDir =  async (name) => {

    console.log( DefaultModFolder )
    
    const gameDir = await settings.get(GameDirectory)
    if( !gameDir ) {
        throw new Error('The Game Directory has not been set.')
    }

    if( name == DefaultModFolder.name )
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
                await fs.mkdir( folderDir )
            }
            else
            {
                throw err
            }
        }

        return folderDir
    }
}
const getModFolder = async (name) => {
    
    if( name == DefaultModFolder.name )
    {
        return DefaultModFolder
    }
    
    const modFolderDir = await getModFolderDir(name)
    
    try{
        const modFolderData = await fs.readFile(path.join(modFolderDir, Data), { encoding: 'utf-8'})
        return JSON.parse( modFolderData )
    }
    catch(err)
    {
        if (err.code === 'ENOENT') 
        {
            return { name }
        }
        throw err
    }
    
}
const deleteModFolder = async (name) => {
    if( name == DefaultModFolder.name ){
        return false
    }

    const modFolderDir = await getModFolderDir(name)
    return await fs.rmdir(modFolderDir, { recursive: true })
}
const copyModFolder = async (name, newName) => {
    console.log('Name:',name, 'New Name:', newName)
    const modFolderDir = await getModFolderDir(name)
    const newModFolderDir = await getModFolderDir(newName)
    await copyFolder( modFolderDir, newModFolderDir )
}
const updateModFolder = async (name, modFolder) => {
    
    console.log('Name', name, 'ModFolder', modFolder, 'DefaultModFolder',DefaultModFolder )
    
    if( name == DefaultModFolder.name ) {
        return false
    }
    
    const modFolderDir = await getModFolderDir(modFolder.name)
    
    try {
        if( name != modFolder.name )
        {
            const oldFolderPath = await getModFolderDir(name)
            await fs.rename(oldFolderPath, modFolderDir)
        }

        const dataFilePath = path.join(modFolderDir, Data)
        await fs.writeFile( dataFilePath, JSON.stringify( modFolder) )
    }
    catch (err) {
        console.log(err)
        return false
    }

    return true
}

exports.getModFolder = getModFolder
exports.deleteModFolder = deleteModFolder
exports.copyModFolder = copyModFolder
exports.updateModFolder = updateModFolder