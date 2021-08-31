import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    meta:{
      index:3
    },
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/',
    name: 'BlackPage',
    meta:{
      index:1
    },
    component: () => import('../views/BlackPage/index.vue')
  },
  {
    path: '/MapInfo',
    name: 'MapInfo',
    meta:{
      index:2
    },
    component: () => import('../views/MapInfo/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
