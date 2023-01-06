<template>
  <Card>
    <template #title>
        Mods
    </template>
    <template #content>
        <DropZone @files-dropped="filesDropped">
            <DataTable v-if="modFiles" :value="modFiles" responsiveLayout="scroll" class="w-full" :scrollable="true" scrollHeight="400px" v-model:selection="selectedMod" selectionMode="multiple">
                <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field"></Column>
            </DataTable>
        </DropZone>
    </template>
</Card>
</template>

<script>

import { ref, toRef } from 'vue'
import DropZone from '@/components/DropZone.vue'

export default {
    props: ['mods', 'modFolder'],
    components: { DropZone },
    setup(props) {

        const modFiles = toRef(props, 'mods')
        const gameDir = localStorage.getItem('GameDirectory')
        const selectedMod = ref(null)

        const columns = ref([
          {field: 'title', header: 'Title'},
          {field: 'name', header: 'File Name'},
          {field: 'size', header: 'Size'}
  
        ]);

        const formatSize = size => {
            var i = Math.floor(Math.log(size) / Math.log(1024))
            return (
            (size / Math.pow(1024, i)).toFixed(2) * 1 +
            ' ' +
            ['B', 'kB', 'MB', 'GB', 'TB'][i]
            )
        }

        const filesDropped = async (e) => {
            console.log( e )
            console.log( props.modFolder )
            Promise.all( e.filter( f => f.type == 'application/x-zip-compressed').map( async (file) => {
                window.electronAPI.addModFile(gameDir, props.modFolder.name, file.path).then(res => {
                    if(res) modFiles.value.push({name: file.name, size: formatSize(file.size) })
                })    
            }))
        }

        return { columns, modFiles,selectedMod, filesDropped }
    }
}
</script>

<style>

</style>