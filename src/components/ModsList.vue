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
        const selectedMod = ref(null)

        const columns = ref([
          {field: 'title', header: 'Title'},
          {field: 'name', header: 'File Name'},
          {field: 'size', header: 'Size'}
  
        ]);

        const filesDropped = async (e) => {
            console.log( e )
            console.log( props.modFolder )
            Promise.all( e.filter( f => f.type == 'application/x-zip-compressed').map( async (file) => {
                window.modFile.addModFile(props.modFolder.name, file.path).then(res => {
                    if(res) modFiles.value.push(res)
                })    
            }))
        }

        return { columns, modFiles,selectedMod, filesDropped }
    }
}
</script>

<style>

</style>