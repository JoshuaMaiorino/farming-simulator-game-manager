<template>
  <div @drop.prevent="onDrop">
    <slot></slot>
  </div>
</template>

<script>

import { onMounted, onUnmounted } from 'vue'

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

export default {
    props:['onDragOverText'],
    setup(props, { emit }) {
        
        console.log( props.onDragOverText)

        const preventDefaults = (e) => {
            e.preventDefault()
        }

        onMounted(() => {
            events.forEach((eventName) => {
                document.body.addEventListener(eventName, preventDefaults)
            })
        })

        onUnmounted(() => {
            events.forEach((eventName) => {
                document.body.removeEventListener(eventName, preventDefaults)
            })
        })

        const onDrop = (e) => {
            emit('files-dropped', [...e.dataTransfer.files])
        }

        return { onDrop }
    }
}
</script>

<style>

</style>