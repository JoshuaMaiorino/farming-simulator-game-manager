<template>
  <div class="container mt-3 flex-row">
    <Toolbar>
        <template #end>
          <Button v-if="modFolder && modFolder.remoteUrl" label="Download Mods" icon="pi pi-cloud-download" @click="downloadRemoteMods" class="p-button-info mr-2" :loading="isDownloading" :disabled="isDownloading" />
          <Button label="Copy" icon="pi pi-copy" @click="copyModFolder" class="p-button-info mr-2" :loading="isCopying" :disabled="isCopying" />
          <Button label="Open Mod Folder" icon="pi pi-folder-open" @click="openModFolder" class="p-button-success mr-2" />  
          <Button label="Activate Mod Folder" icon="pi pi-check" @click="activateModFolder" :disabled="isCurrentMod" class="mr-2" :class="{ 'p-button-secondary' : !isCurrentMod}" />
          <Button label="Delete Mod Folder" icon="pi pi-times" @click="deleteModFolder" :disabled="isCurrentMod || isDefaultModFolder" class="p-button-danger" />
        </template>
    </Toolbar>
    <ProgressBar class="mt-3" v-if="isCopying || isDownloading" :value="progressPercent">
    </ProgressBar>
    <ConfirmDialog></ConfirmDialog>
    <div class="flex mt-3">
      <div class="flex-none flex align-items-top justify-content-center max-w-30rem">
        <ModFolderEdit :folder="modFolder" @saved="saveMod" />
      </div>

      <div class="w-full ml-3 ">
        <ModsList :mods="mods" :modFolder="modFolder" />
      </div>
    </div>
  </div>
  
</template>

<script>

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirm } from "primevue/useconfirm";

import ModFolderEdit from '@/components/ModFolderEdit.vue'
import ModsList from '@/components/ModsList.vue'

import defaultModFolder from '@/utils/defaultModFolder.json'

export default {
    components: { ModFolderEdit, ModsList },
    setup()
    {
        
      const route = useRoute()
      const router = useRouter()
      const confirm = useConfirm()
    
      const mods = ref(null)
      const modFolder = ref(null)
      const isDefaultModFolder = ref(false)

      const gameDir = localStorage.getItem("GameDirectory")
      const currentModFolder = JSON.parse( localStorage.getItem("CurrentModFolder") )

      const isCurrentMod = ref(false)
      const isCopying = ref(false)
      const progressPercent = ref(0)

      const isDownloading = ref(false)

      const refreshMods = () => {
        mods.value = null
        if( modFolder.value )
        {
          window.electronAPI.getModFiles(gameDir, modFolder.value.name).then(
            (result) => {
              if( result )
              {
                mods.value = result
                console.log(result)
              }
              else mods.value = [{name: 'No Mod Files Found'}]
            }
          )
        }
      }

      const loadData = () => {
        window.electronAPI.getModFolder(gameDir, route.query.name).then(data => {
            modFolder.value = data
            isCurrentMod.value = currentModFolder && data.name == currentModFolder.name
            isDefaultModFolder.value = data.name == defaultModFolder.name
            refreshMods()
          })
      }
      
      const saveMod = (newModFolder) => {
        console.log( isCurrentMod.value )
        if( isCurrentMod.value ){
          modFolder.value = newModFolder
          activateModFolder()
        }
        router.push({name:'home' })
      }

      const openModFolder = () => {
        window.electronAPI.openModFolder(gameDir, modFolder.value.name)
      }

      const deleteModFolder = () => {
        confirm.require({
          message: 'Do you want to delete this record?',
          header: 'Delete Confirmation',
          icon: 'pi pi-info-circle',
          acceptClass: 'p-button-danger',
          accept: () => {
            window.electronAPI.deleteModFolder(gameDir, modFolder.value.name).then( () => {
              router.push({name: 'home'})
            })
          }
        })
        
      }

      const activateModFolder = () => {
        window.electronAPI.setCurrentModFolder(gameDir, modFolder.value.name).then( () => {
            isCurrentMod.value = true
          })
      }

      const downloadRemoteMods = () => {
        progressPercent.value = 0
        isDownloading.value = true
        window.electronAPI.recieveMessage('download-remote-mods', ( event, percentComplete) => {
          progressPercent.value = percentComplete
        })
        window.electronAPI.downloadRemoteMods(gameDir, modFolder.value.name).then( success => {
          if( success )
          {
            isDownloading.value = false
            refreshMods()
          }
        })
      }

      const copyModFolder = () => {
        progressPercent.value = 0
        isCopying.value = true
        window.electronAPI.recieveMessage('copy-mod-folder', (event, percentComplete) => {
          progressPercent.value = percentComplete
        })
        window.electronAPI.copyModFolder(gameDir, modFolder.value.name, modFolder.value.name + ' - Copy' ).then( success => {
          if( success )
          {
            router.push( { name:'details', query: { name: modFolder.value.name + ' - Copy' }})
            modFolder.value.name = modFolder.value.name + ' - Copy'
            isCopying.value = false
          }
        }

        )
      }
      
      onMounted( () => {
          loadData()
        })

        return { modFolder, mods, refreshMods, saveMod, isCurrentMod, activateModFolder, deleteModFolder, copyModFolder, downloadRemoteMods, isCopying, isDownloading, openModFolder, isDefaultModFolder, progressPercent }
    }
}
</script>

<style>

</style>