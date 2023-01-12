import { getModFolderDir, getModFolder } from '@/utils/ModFolder'
import { downloadMods } from '@/utils/RemoteModFiles'
import { downloadRemoteMods } from '@/utils/Events'

export const execute = async (win, event, modFolderName, refresh) => {

    try{
      const modFolderDir = await getModFolderDir( modFolderName )
      const modFolder = await getModFolder( modFolderName )
      if( modFolder.remoteUrl )
      {
        return await downloadMods(modFolder.remoteUrl, modFolderDir, refresh, (progress) => {
          event.sender.send(downloadRemoteMods, progress)
        })
      }
    }
    catch(err)
    {
      console.log(err)
    }
  }