import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/NewHomeView.vue'
import ModFolderDetailView from '@/views/NewModFolderDetailView.vue'
import AddModFolderView from '@/views/AddModFolder.vue'
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
    component: ModFolderDetailView,
  },
  {
    path: '/add',
    name: 'add',
    component: AddModFolderView,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
  //{
  //  path: '/about',
  //  name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  //  component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  //}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if( to.name !== 'settings' ) {
    const gameDir = localStorage.getItem('GameDirectory')
    if( !gameDir ){
      return { name:'settings' }
    }
  }
})

export default router
