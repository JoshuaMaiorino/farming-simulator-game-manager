<template>
    <div class="max-w-30rem mx-auto mt-3">
        <Card>
            <template #title>
                Application Settings
            </template>
            <template #content>
                <div class="field">
                    <label for="gameDir" class="mr-3">Game Directory</label>
                    <span class="p-input-icon-right w-full" @click="selectGameDir">
                        <InputText id="gameDir" type="text" disabled v-model="gameDir" class="w-full" />
                        <i class="pi pi-folder" />
                    </span>
                </div>
                <div class="field">
                    <label for="gamePath" class="mr-3">Farming Simulator exe</label>
                    <span class="p-input-icon-right w-full" @click="selectGamePath">
                        <InputText id="gamePath" type="text" disabled v-model="gamePath" class="w-full" />
                        <i class="pi pi-file" />
                    </span>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Save" @click.prevent="saveSettings"></Button>
                <Button icon="pi pi-times" label="Cancel" @click="$router.push({name:'home'})" class="p-button-secondary" style="margin-left: .5em" ></Button>
            </template>
        </Card>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { gameDirectory, gamePath as openGamePath } from '@/utils/OpenDialogModes.js'

export default {
    setup() {
        
        const gameDir = ref(null)
        const gamePath = ref(null)

        const router = useRouter()

        const selectGameDir = async () => {
            const newDir = await window.appSettings.openDialog(gameDirectory)
            if( newDir ) {
                gameDir.value = newDir
            }
        }

        const selectGamePath = async() => {
            const newPath = await window.appSettings.openDialog(openGamePath)
            if( newPath ) {
                gamePath.value = newPath
            }
        }

        onMounted( async () => {
            gameDir.value = await window.appSettings.getGameDirectory()
            gamePath.value = await window.appSettings.getGamePath()
        })

        const saveSettings = async () => {
            
            const res = await Promise.all( [window.appSettings.setGameDirectory( gameDir.value ), window.appSettings.setGamePath( gamePath.value )] )
            if( res.filter((x) => x !== undefined).length )
            {
                alert(res)
            }
            else
            {
                router.push('/')
            }
            
        }

        return { gameDir, selectGameDir, saveSettings, gamePath, selectGamePath }
    },
}
</script>
