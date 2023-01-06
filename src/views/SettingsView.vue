<template>
    <div class="max-w-30rem mx-auto mt-3">
        <Card>
            <template #title>
                Application Seetings
            </template>
            <template #content>
                <div class="field">
                    <label for="gameDir" class="mr-3">Game Directory</label>
                    <span class="p-input-icon-right w-full" @click="selectGameDir">
                        <InputText type="gameDir" disabled v-model="gameDir" class="w-full" />
                        <i class="pi pi-folder" />
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

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup() {
        
        const gameDir = ref(localStorage.getItem("GameDirectory"))

        const router = useRouter()

        const selectGameDir = () => {
            window.electronAPI.openDialog()
            .then( (result) => {

                if( result )
                {
                    gameDir.value = result
                }
            })
        }

        const saveSettings = () => {
            localStorage.setItem("GameDirectory", gameDir.value)
            router.push('/')
        }

        return { gameDir, selectGameDir, saveSettings }
    },
}
</script>
