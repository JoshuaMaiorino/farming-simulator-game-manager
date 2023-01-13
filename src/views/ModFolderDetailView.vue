<template>
  <div class="container mt-3 flex-row">
    <Toolbar>
        <template #end>
          <SplitButton v-if="modFolder && modFolder.remoteUrl" :model="downloadOptions" label="Download Mods" icon="pi pi-cloud-download" class="p-button-info mr-2" :disabled="isDownloading" />
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

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirm } from "primevue/useconfirm";

import ModFolderEdit from '@/components/ModFolderEdit.vue'
import ModsList from '@/components/ModsList.vue'

import { defaultModFolder } from '@/utils/Constants.js'
import { downloadRemoteMods as downloadRemoveModsEvent } from '@/utils/Events.js'

export default {
    components: { ModFolderEdit, ModsList },
    setup()
    {
        
      const route = useRoute()
      const router = useRouter()
      const confirm = useConfirm()
    
      const mods = ref(null)
      const modFolder = ref(null)
      const forceRefresh = ref(false)

      const currentModFolder = ref(null)

      const isCurrentMod = computed(() => {
        return modFolder.value && currentModFolder.value && modFolder.value.name == currentModFolder.value.name;
      })
      const isDefaultModFolder = computed(() => {
        return modFolder.value && modFolder.value.name == defaultModFolder.name;
      })
      
      const isCopying = ref(false)
      const progressPercent = ref(0)

      const isDownloading = ref(false)

      const refreshMods = async () => {
        mods.value = null
        if( modFolder.value )
        {
          mods.value = await window.modFile.getAll(modFolder.value.name)
        }
      }

      const loadData = async () => {
        currentModFolder.value = await window.game.getCurrentModFolder()
        modFolder.value = await window.modFolder.get(route.query.name)
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
        window.modFolder.openDirectory(modFolder.value.name)
      }

      const deleteModFolder = () => {
        confirm.require({
          message: 'Do you want to delete this record?',
          header: 'Delete Confirmation',
          icon: 'pi pi-info-circle',
          acceptClass: 'p-button-danger',
          accept: () => {
            window.modFolder.delete(modFolder.value.name).then( () => {
              router.push({name: 'home'})
            })
          }
        })
      }

      const activateModFolder = async () => {
          await window.game.setCurrentModFolder(modFolder.value.name)
          await loadData()
      }

      const downloadRemoteMods = (force=false) => {
        progressPercent.value = 0
        isDownloading.value = true
        window.electronAPI.recieveMessage(downloadRemoveModsEvent, ( event, percentComplete) => {
          progressPercent.value = percentComplete
        })
        window.modFolder.downloadRemoteMods(modFolder.value.name, force).then( success => {
          if( success )
          {
            isDownloading.value = false
            refreshMods()
          }
        })
      }

      const downloadOptions = ref([
        {
          label: 'Quick Download',
          command: () => {
            downloadRemoteMods()
          }
        },
        {
          label: 'Download All',
          command: () => {
            downloadRemoteMods(true)
          }
        }
      ])

      const copyModFolder = () => {
        progressPercent.value = 0
        isCopying.value = true
        window.modFolder.copy(modFolder.value.name, modFolder.value.name + ' - Copy' ).then( success => {
          if( success )
          {
            progressPercent.value = 100
            router.push( { name:'details', query: { name: modFolder.value.name + ' - Copy' }})
            modFolder.value.name = modFolder.value.name + ' - Copy'
            isCopying.value = false
          }
        }

        )
      }
      
      onMounted( async () => {
          await loadData()
          refreshMods()
        })

        return { downloadOptions, modFolder, mods, forceRefresh, refreshMods, saveMod, isCurrentMod, activateModFolder, deleteModFolder, copyModFolder, downloadRemoteMods, isCopying, isDownloading, openModFolder, isDefaultModFolder, progressPercent }
    }
}
</script>

<style>
  .p-checkbox .p-checkbox-box {
    border: 2px solid #ced4da;
    background: #ffffff;
    width: 22px;
    height: 22px;
    color: #495057;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  }

  .field-checkbox {
    margin-bottom: 1rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
</style>