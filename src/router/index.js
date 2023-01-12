import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/details',
    name: 'details',
    component: () => import(/* webpackChunckName: "details" */ '@/views/ModFolderDetailView.vue'),
  },
  {
    path: '/add',
    name: 'add',
    component: () => import(/* webpackChunckName: "add" */ '@/views/AddModFolder.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunckName: "settings" */ '@/views/SettingsView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
