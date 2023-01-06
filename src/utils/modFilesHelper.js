import fs from 'fs'
import path from 'path'
import zip from 'adm-zip'
import xml2js from 'xml2js'

const formatSize = size => {
    var i = Math.floor(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['B', 'kB', 'MB', 'GB', 'TB'][i]
    )
  }

  const getModTitle = (modFilePath) => {
    const modFileZip = new zip(modFilePath)
    const modDescXml = modFileZip.getEntry('modDesc.xml')
    let title = ''
    xml2js.parseString(modDescXml.getData().toString("utf8"), (err, data) => {
        if(err){ return null }
        console.log( data )
        title = data.modDesc.title[0].en[0]
        console.log( 'In Function', title )
    })
    return title 
  }

 const listFiles = async (dir) => {
    let fileList = [];
    const files = await fs.promises.readdir(dir)
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        // use lstat so this does not follow dir symlinks
        // (otherwise this will include files from other dirs, which I don't want)
        if (!fs.lstatSync(fullPath).isDirectory()) {
        fileList.push(fullPath);
        }
    });
    return fileList;
}

// return an object with the file path and file size
const fileAndSize = (file) => {
    const title = getModTitle(file)
    console.log( title )
    return {
        file,
        name: path.basename( file ),
        size: formatSize(fs.statSync(file).size),
        title: title
    }
}

const getModFiles = async (dir) => {

    const files = await listFiles(dir)
    console.log( files )
    return files.filter(f => path.extname(f) == '.zip').map(fileAndSize)

}

const addModFile = async (dir, filePath) => {
    if( path.extname( filePath ) == ".zip" && fs.existsSync(filePath) )
    {
        const targeFile = path.join( dir, path.basename(filePath))
        const source = await fs.promises.readFile(filePath)
        await fs.promises.writeFile(targeFile, source)
        return true
    }
    return false
}

export default {
    getModFiles,
    addModFile
} 