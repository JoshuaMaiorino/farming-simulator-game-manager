var fs = require("fs"),
  parseString = require("xml2js").parseString,
  xml2js = require("xml2js"),
  path = require("path")

const fileName = "gameSettings.xml"
const modFolders = "modFolders"

const updateModFolder = (gameDir, currentPath, modFolder) => {
    
    const newModFolder = JSON.parse( modFolder )
    
    const gameSettingsFilePath = path.join(gameDir, fileName)
   
    console.log( gameSettingsFilePath )

    fs.readFile(gameSettingsFilePath, "utf-8", function(err, data) {
        if (err) console.log(err);
        // we then pass the data to our method here
        parseString(data, function(err, result) {
            if (err) {
                console.log(err)
                return false
            }

            let json = result;

            const modFoldersDir = path.join( gameDir, modFolders)
            const newModFolderDir = path.join( gameDir, modFolders, newModFolder.name )
            const oldMoldFolderDir = path.join( gameDir, modFolders, currentPath )

            if(!fs.existsSync(modFoldersDir)){
                fs.mkdirSync(modFoldersDir)
            }

            if(!fs.existsSync(oldMoldFolderDir)){
                fs.mkdirSync(newModFolderDir)
            }
            else if( oldMoldFolderDir != newModFolderDir ){
                fs.renameSync(oldMoldFolderDir, newModFolderDir)
            }

            fs.writeFile(path.join( newModFolderDir, 'data.json'), modFolder, function(err) {
                if (err){
                    console.log(err)
                    return false
                }
            })
            json.gameSettings.modsDirectoryOverride[0].$.active = "true"
            json.gameSettings.modsDirectoryOverride[0].$.directory = newModFolderDir
        
            // create a new builder object and then convert
            // our json back to xml.
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(json);
        
            fs.writeFile(gameSettingsFilePath, xml, function(err) {
            if (err){
                console.log(err)
                return false
            }
        
            console.log("successfully written our update xml to file");
            return true
            });
        });
    });
}

export default updateModFolder