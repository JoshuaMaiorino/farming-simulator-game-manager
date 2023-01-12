import fs from 'fs/promises'
import path from 'path'
import zip from 'adm-zip'
import { parseStringPromise } from 'xml2js'

import { formatSize } from '@/utils/Utils.js'
import { modDesc } from '@/utils/Files.js'
import { getModFolderDir } from '@/utils/ModFolder.js'

const getModTitle = async (modFilePath) => {
    const modFileZip = new zip(modFilePath)
    const modDescXml = modFileZip.getEntry(modDesc).getData().toString("utf8")
    const modFileJson = await parseStringPromise(modDescXml)
    return modFileJson.modDesc.title[0].en[0]
}

export const getModFiles = async (modFolder) => {
    
    const dir = await getModFolderDir( modFolder )
    const dirents = await fs.readdir(dir)
    
    const modZipFiles = dirents.filter( file => {
        return path.extname(file).toLowerCase() === ".zip"
    })

    return await Promise.all( modZipFiles.map( async (file) => {
        const filePath = path.join(dir,file)
        const stat = await fs.lstat(filePath)
        return {
            file,
            name: path.basename(file),
            size: formatSize(stat.size),
            title: await getModTitle(filePath)
        }
    }))
}

export const addModFile = async (modFolder, filePath) => {
    
    if( path.extname( filePath ).toLowerCase() === ".zip" )
    {
        try
        {
            const dir = await getModFolderDir( modFolder )

            console.log( 'dir', dir, 'filePath', filePath )

            const targetFile = path.join( dir, path.basename(filePath))

            const source = await fs.readFile(filePath)
            
            await fs.writeFile(targetFile, source)

            const stat = await fs.stat(targetFile)
        
            return {
                file: targetFile,
                name: path.basename(targetFile),
                size: formatSize(stat.size),
                title: await getModTitle(targetFile)
            }

        }
        catch (err)
        {
            console.log(err)
        }
        
    }

    return null

}