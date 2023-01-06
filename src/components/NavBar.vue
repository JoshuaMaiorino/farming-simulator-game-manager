<template>
  <div>
    <Menubar :model="items">
      <template #start>
        <router-link to="/" class="flex no-underline">
          <img alt="logo" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" height="40" class="flex align-items-center mr-3">
          <span  class="flex align-items-center text-primary no-underline text-xl mr-3" style="text-decoration: none">Farming Simulator Game Manager</span>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script>

import { ref } from 'vue';

export default {
    setup(){
      const items = ref([
				{
				label:'File',
				icon:'pi pi-fw pi-file',
				items:[
						{
							label:'New',
							icon:'pi pi-fw pi-plus',
              to:{name:'add' }
						},
            {
              label:'Launch Game (Steam)',
              command: () => {
                window.electronAPI.launchGame()
              }
            }
					]
				},
        {
          label:'Settings',
          icon:'pi pi-gear',
          to: {name:'settings'}
        },
				{
					label:'Quit',
					icon:'pi pi-fw pi-power-off',
          command: () => {
            window.close();
          }
				}
			]);

			return { items }
    }
}
</script>

<style>

</style>