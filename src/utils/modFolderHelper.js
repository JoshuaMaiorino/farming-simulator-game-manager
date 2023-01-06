import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

import defaultModFolder from './defaultModFolder.json'

const modFoldersName = "modFolders"
const dataFileName = 'data.json'
const gameSettingsFileName = "gameSettings.xml"

const getModFolderDir = (gameDir, name) => {
    if( name == defaultModFolder.name )
    {
        return path.join( gameDir, name )
    }
    else {
        return path.join( getModFoldersDir(gameDir), name )
    }
}

const getModFoldersDir = (gameDir) => {
    
    const modFoldersDir = path.join( gameDir, modFoldersName)
    if(!fs.existsSync(modFoldersDir)){
        fs.mkdirSync( modFoldersDir )
    }
    return modFoldersDir
}
const getModFolderData = async (modFolderPath) => {
    try {
        const modFolderData = await fs.promises.readFile(modFolderPath, { encoding: 'utf-8'})
        return JSON.parse( modFolderData )
    }catch(err)
    {
        console.log(err)
        return { name: path.basename(modFolderPath), description: null, remoteUrl: null }
    }
}

const copyFileSync = ( src, trg ) => {
    var targetFile = trg;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( trg ) ) {
        if ( fs.lstatSync( trg ).isDirectory() ) {
            targetFile = path.join( trg, path.basename( src ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(src));
}

/*

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = target;
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}
*/
const getModFolder = async (gameDir, name) => {
    
    if( name == defaultModFolder.name )
    {
        return defaultModFolder
    }
    
    const dataFilePath = path.join(getModFolderDir(gameDir, name), dataFileName )
    return await getModFolderData( dataFilePath )
}

const deleteModFolder = async( gameDir, name) =>
{
    if( name == defaultModFolder.name ){
        return false
    }

    const modFolder = await getModFolder( gameDir, name )
    if( modFolder )
    {
        await fs.promises.rmdir( getModFolderDir(gameDir,name), { recursive: true } )
        return modFolder
    }
    return false

}

const copyModFolder = async( gameDir, name, newName, progressCallBackFunc ) => {
    
    if( newName == defaultModFolder.name ){
        return false
    }
    
    const sourceModFolderPath = getModFolderDir(gameDir, name)
    const targetModFolderPath = getModFolderDir(gameDir, newName)

    console.log( sourceModFolderPath + ' > ' + targetModFolderPath )

    progressCallBackFunc(0)

    /* copyFolderRecursiveSync( sourceModFolderPath, targetModFolderPath )
     */

    if(!fs.existsSync(targetModFolderPath ))
    {
        fs.mkdirSync(targetModFolderPath)
    }

    const files = await fs.promises.readdir(sourceModFolderPath)
    const modFiles = files.filter( file => {
        return path.extname(file).toLowerCase() === '.zip';
    });
    
    const filesToCopy = modFiles.length
    let filesCopied = 0

    modFiles.forEach( file => {
        copyFileSync( path.join( sourceModFolderPath, file), targetModFolderPath )
        progressCallBackFunc( parseInt( ++filesCopied / filesToCopy * 100 ) )
    })
        
    progressCallBackFunc(100)
    
    let modFolder = await getModFolder( gameDir, name )
    modFolder.name = newName
    
    return await updateModFolder( gameDir, newName, modFolder )

}

const updateModFolder = async (gameDir, name, modFolder) => {
    
    if( name == defaultModFolder.name ) {
        return false
    }
    
    const modFolderDir = getModFolderDir(gameDir, modFolder.name)
    
    try {
        if( name != modFolder.name )
        {
            const oldFolderPath = getModFolderDir(gameDir,name)
            if( fs.existsSync(oldFolderPath) )
            {
                await fs.promises.rename(oldFolderPath, modFolderDir)
            }
        }
        if( !fs.existsSync( modFolderDir ))
        {
            await fs.promises.mkdir( modFolderDir )
        }

        const dataFilePath = path.join(modFolderDir, dataFileName)
        await fs.promises.writeFile( dataFilePath, JSON.stringify( modFolder) )
    }
    catch (err) {
        console.log(err)
        return false
    }

    return true
}

const getCurrentModFolder = async (gameDir) => {
    const gameSettingsFilePath = path.join(gameDir, gameSettingsFileName)
    try {
        const gameSettingsData = await fs.promises.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
        const gameSettingsJson = await xml2js.parseStringPromise(gameSettingsData)
        
        const currentModDir = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory
        const modOverrideActive = gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active

        if( modOverrideActive == 'true' )
        {
            const dataFilePath = path.join(currentModDir, dataFileName)

            return  getModFolderData( dataFilePath )
        }
        console.log(defaultModFolder)
        return defaultModFolder

    }
    catch( err )
    {
        console.log( err )
    }

    return null
}

const getAllModFolders = async (gameDir) => {

    let modFolders = [defaultModFolder]

    const modFoldersPath = getModFoldersDir(gameDir)

    try {
        let modDirs = await fs.promises.readdir(modFoldersPath, { withFileTypes: true })
        modDirs = modDirs.filter( dir => dir.isDirectory() )
        for( const modDir of modDirs) {
            const modFolder = await getModFolder( gameDir, modDir.name)
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

const setCurrentModFolder = async (gameDir, name) => {
    const gameSettingsFilePath = path.join(gameDir, gameSettingsFileName)
    try {
        const gameSettingsData = await fs.promises.readFile(gameSettingsFilePath, { encoding: 'utf-8'})
        const gameSettingsJson = await xml2js.parseStringPromise(gameSettingsData)

        gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.directory = getModFolderDir( gameDir, name )
        gameSettingsJson.gameSettings.modsDirectoryOverride[0].$.active = name == defaultModFolder.name ? 'false' : 'true'

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(gameSettingsJson);
    
        await fs.promises.writeFile(gameSettingsFilePath,xml)
    
        console.log("successfully written our update xml to file")

    } catch( err )
    {
        console.log( err )
        return null
    }
}

export default {
    getCurrentModFolder,
    getAllModFolders,
    getModFolder,
    updateModFolder,
    deleteModFolder,
    copyModFolder,
    getModFolderDir,
    setCurrentModFolder
}