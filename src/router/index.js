import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import StarView from '../views/StarView.vue'
import GarbageView from '../views/GarbageView.vue'
import SettingView from '../views/SettingView.vue'
import DownloadView from '../views/DownloadView.vue'
import MeView from '../views/MeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView
    },
    {
      path: '/star',
      name: 'star',
      component: StarView
    },
    {
      path: '/garbage',
      name: 'garbage',
      component: GarbageView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadView
    },
    {
      path: '/me',
      name: 'me',
      component: MeView
    }
  ]
})

export default router
