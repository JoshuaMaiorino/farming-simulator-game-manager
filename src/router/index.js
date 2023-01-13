import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ModFolderDetailView from '@/views/ModFolderDetailView.vue'
import AddModFolder from '@/views/AddModFolder.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/details',
    name: 'details',
    component: ModFolderDetailView
  },
  {
    path: '/add',
    name: 'add',
    component: AddModFolder
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
