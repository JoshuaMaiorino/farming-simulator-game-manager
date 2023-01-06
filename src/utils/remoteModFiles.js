import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import url from 'url'

import cheerio from 'cheerio'

const downloadMods = async (remote, dir, progress) => {
    console.log('Starting')
    progress(0)
    const remoteUrl = url.parse( remote )
    try{
        const modLinks = await getModFileUrls( remoteUrl )
        progress(2)
        let toDownload = modLinks.length
        let downloaded = 0
        for( const modLink of modLinks )
        {
            const target = path.join( dir, path.basename(modLink))
            const link = remoteUrl.protocol + '//' + remoteUrl.host + '/' + modLink
            await download(link, target, 0)
            progress( parseInt( ++downloaded / toDownload *  98 ) + 2 )
            console.log( parseInt( downloaded / toDownload *  98 ) + 2 )
        }
        console.log('Complete')
        return true
    }
    catch(err)
    {
        console.log(err)
    }
    return false
}

const getModFileUrls = async(remoteUrl) => {
    
    console.log( remoteUrl )

    const proto = !remoteUrl.protocol.localeCompare('https') ? https : http;
  
    return new Promise((resolve, reject ) => {
        let body = '';

        console.log( remoteUrl, remoteUrl.href )

        const req = proto.get(remoteUrl.href, res => {
            
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${remoteUrl.href}' (${res.statusCode})`));
                return;
            }
            
            res.on('data', (data) => {
                body += data.toString();
            });

            res.on('end', () => {
                const $ = cheerio.load(body)
                const modLinks = []
                const items = $("a[href$='.zip']")

                items.each((indx, el) => {
                    modLinks.push( $(el).attr('href') )
                })

                resolve( [...new Set(modLinks)])
            })

        })

        req.end();
    })
}

async function download(remoteLink, filePath , currentFileSize ) {
    
    console.log(remoteLink)
    const proto = !remoteLink.charAt(4).localeCompare('s') ? https : http;
  
    return new Promise((resolve, reject) => {
    
      let fileInfo = null;
  
      const request = proto.get(remoteLink, response => {
        if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${remoteLink}' (${response.statusCode})`));
            return;
        }
  
        fileInfo = {
          mime: response.headers['content-type'],
          size: parseInt(response.headers['content-length'], 10),
        };

        response.pause

        console.log( fileInfo )

        if( !currentFileSize || currentFileSize != fileInfo.size )
        {
            response.resume
            const file = fs.createWriteStream(filePath);
            response.pipe(file);

            // The destination stream is ended by the time it's called
            file.on('finish', () => {
                resolve(fileInfo)
            });
            
            file.on('error', err => {
            fs.unlink(filePath, () => reject(err));
            });

        }
        else {
            request.end();
            resolve( null );
        }
      });
  
      request.end();
    });
}

  export default downloadMods