<template>
        <Card>
            <template #title>
                {{ mode }} Mod Folder
            </template>
            <template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" type="text" v-model="name" :disabled="isDefaultFolder" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
                </div>
                <div class="field">
                    <label for="description">Description</label>
                    <Textarea id="description" :autoResize="true" rows="5" :disabled="isDefaultFolder" v-model="description" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                </div>
                <div class="field">
                    <label for="remoteUrl">Remote Url</label>
                    <InputText id="remoteUrl" type="text" v-model="remoteUrl" :disabled="isDefaultFolder" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
                    <small id="remoteUrl-help">For online servers to sync mods, enter the link for the public mods page</small>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Save" @click.prevent="saveModFolder" :disabled="isDefaultFolder"></Button>
                <Button icon="pi pi-times" label="Cancel" @click="$router.push({name:'home'})" class="p-button-secondary" style="margin-left: .5em" ></Button>
            </template>
        </Card>
</template>

<script>

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import defaultModFolder from '@/utils/defaultModFolder.json'

export default {
    props: ['folder'],
    setup(props, { emit }) {

        const gameDir = localStorage.getItem("GameDirectory")
        console.log( defaultModFolder )

        const isDefaultFolder = ref(props.folder && defaultModFolder.name == props.folder.name)

        const mode = ref('New')

        const router = useRouter()

        const name = ref('')
        const description = ref('')
        const remoteUrl = ref('')

        const saveModFolder = () => {
            const modFolderName = props.folder ? props.folder.name : name.value

            const newModFolder = {
                name: name.value,
                description: description.value,
                remoteUrl: remoteUrl.value
            }

            window.electronAPI.updateModFolder(gameDir, modFolderName, newModFolder).then( () => {
                
                if( props.folder ) {
                    emit('saved', newModFolder )
                }
                else {
                    router.push( { name: 'details', query: { name: newModFolder.name }})
                }
                
            })


        }

        watch( props, () => {
            if( props.folder )
            {
                name.value = props.folder.name
                description.value = props.folder.description
                remoteUrl.value = props.folder.remoteUrl
                mode.value = 'Edit'
                isDefaultFolder.value = defaultModFolder.name == props.folder.name
                
            }
        })

        return { mode, name, description, remoteUrl, saveModFolder, isDefaultFolder }
    }
}
</script>

<style>

</style>