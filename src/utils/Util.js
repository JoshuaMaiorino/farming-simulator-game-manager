import fs from 'fs/promises'
import path from 'path'

const formatSize = (size) =>
{
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

const copyFolder = async (src, trg) =>
{
  
  //Make Target Directory if it doesn't exisit
  try{
    await fs.lstat(trg)
  }
  catch (err)
  {
    if( err.code === 'ENOENT' ) 
    {
      await fs.mkdir( trg )
    }
    else
    {
      throw err
    }
  }

  if( await (await fs.lstat( src )).isDirectory() )
  {
    const entries = await fs.readdir( src )
    await Promise.all( entries.map( async (entry) => {
      const curSrc = path.join( src,entry)
      if( entry.isDirectory() )
      {
        await copyFolder(curSrc , trg)
      }
      else
      {
        await fs.copyFile( curSrc, trg)
      }
    }))

  }
  else {
    throw new Error( "Source is not a directory")
  }
}

exports.copyFolder = copyFolder
exports.formatSize = formatSize