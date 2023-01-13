<template>
    <ConfirmDialog></ConfirmDialog>
	<DataView 
      :value="modFolders" 
      :layout="layout"
      >
      <template #header>
        <DataViewLayoutOptions v-model="layout"></DataViewLayoutOptions>
      </template>

      <template #grid="slotProps">
				<div class="flex align-items-stretch col-12 md:col-4 lg:col-3">
					<div class="product-grid-item card w-full">
						<div class="product-grid-item-top">
							<div>
								<i v-show="slotProps.data.remoteUrl" class="pi pi-globe product-category-icon"></i>
								<span class="product-category"></span>
							</div>
              <span v-show="currentModFolder && currentModFolder.name == slotProps.data.name" class="product-badge status-instock">Active Folder</span>
						</div>
						<div class="product-grid-item-content">
							<Avatar icon="pi pi-folder" size="xlarge" shape="circle" style="margin:2rem 0"/>
							<div class="product-name">{{slotProps.data.name}}</div>
							<div class="product-description">{{slotProps.data.description}}</div>
						</div>
						<div class="product-grid-item-bottom">
							<Button icon="pi pi-pencil" @click="$router.push({name: 'details', query: { name: slotProps.data.name}})"></Button>
							<Button icon="pi pi-trash" v-if="slotProps.data.name !== 'mods'" @click="deleteModFolder(slotProps.data.name)" class="p-button-danger"></Button>
						</div>
					</div>
				</div>
			</template>

      <template #list="slotProps">
				<div class="col-12">
					<div class="product-list-item">
						<Avatar icon="pi pi-folder" size="xlarge" shape="circle" />
						<div class="product-list-detail">
							<span v-if="currentModFolder && currentModFolder.name == slotProps.data.name" class="product-badge status-instock">Active Folder</span>
              <div class="product-name">{{slotProps.data.name}}</div>
							<div class="product-description">{{slotProps.data.description}}</div>
							<div v-if="slotProps.data.remoteUrl">
                <i class="pi pi-globe product-category-icon"></i>
								<span class="product-category">{{slotProps.data.remoteUrl}}</span>
              </div>
						</div>
						<div class="product-list-action">
							<Button icon="pi pi-pencil" @click="$router.push({name: 'details', query: { name: slotProps.data.name}})"></Button>
							<Button icon="pi pi-trash" v-if="slotProps.data.name !== 'mods'" @click="deleteModFolder(slotProps.data.name)" class="p-button-danger"></Button>
						</div>
					</div>
				</div>
			</template>

    </DataView>
</template>

<style lang="scss" scoped>

.p-grid {
	align-items: center;
	display: flex;
	justify-content: center;
}

.card {
    background: #ffffff;
    padding: 2rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    border-radius: 4px;
    margin-bottom: 2rem;
}
.p-dropdown {
    width: 14rem;
    font-weight: normal;
}

.product-name {
	font-size: 1.5rem;
	font-weight: 700;
}

.product-icon {
  font-size: 4rem;
  margin-top: 1rem;
}

.product-description {
	margin: 0 0 1rem 0;
}

.product-category-icon {
	vertical-align: middle;
	margin-right: .5rem;
}

.product-category {
	font-weight: 600;
	vertical-align: middle;
}

::v-deep(.product-list-item) {
	display: flex;
	align-items: center;
	padding: 1rem;
	width: 100%;

	img {
		width: 50px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin-right: 2rem;
	}

	.product-list-detail {
		flex: 1 1 0;
	}

	.p-rating {
		margin: 0 0 .5rem 0;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: .5rem;
		align-self: flex-end;
	}

	.product-list-action {
		display: flex;
		flex-direction: column;
	}

	.p-button {
		margin-bottom: .5rem;
	}
}

::v-deep(.product-grid-item) {
	margin: .5rem;
	border: 1px solid var(--surface-border);

	.product-grid-item-top,
	.product-grid-item-bottom {
		display: flex;
		align-items:center;
		justify-content: space-between;
	}

	img {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin: 2rem 0;
	}

	.product-grid-item-content {
		text-align: center;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
	}
}

@media screen and (max-width: 576px) {
	.product-list-item {
		flex-direction: column;
		align-items: center;

		img {
			margin: 2rem 0;
		}

		.product-list-detail {
			text-align: center;
		}

		.product-price {
			align-self: center;
		}

		.product-list-action {
			display: flex;
			flex-direction: column;
		}

		.product-list-action {
			margin-top: 2rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}
	}
}
</style>
  
<script>

import { ref, onMounted } from 'vue'

import { useConfirm } from "primevue/useconfirm";

export default {
  name: 'HomeView',
  components: {
  },
  setup() {

    const gameDir = ref(localStorage.getItem("GameDirectory"))
    const modFolders = ref(null)
    const currentModFolder = ref( null )

	const confirm = useConfirm()

    //DataView
    const layout = ref('grid');

	const deleteModFolder = (modFolderName) => {
        confirm.require({
          message: 'Do you want to delete this record?',
          header: 'Delete Confirmation',
          icon: 'pi pi-info-circle',
          acceptClass: 'p-button-danger',
          accept: () => {
            window.modFolder.delete(modFolderName).then(loadModFolders)
          }
        })
      }

    
    const loadModFolders = () => {
      modFolders.value = null
      currentModFolder.value = null
      
      if( gameDir.value ){
        window.modFolder.getAll().then(
          (result) => {
            if( result )
            {
              modFolders.value = result
            }
          }
        )

        window.game.getCurrentModFolder().then(
          (result) => {
            if( result )
            {
				currentModFolder.value = result
            }
          }
        )
      }
    }

    onMounted( () => {
      loadModFolders()
    })

    return { gameDir, modFolders, currentModFolder, layout, deleteModFolder }
  }
}
</script>
