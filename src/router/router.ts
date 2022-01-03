import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: () => import('../views/About.vue') },
  {
    path: '/comitee',
    name: 'Comitee',
    component: () => import('../views/Comitee.vue'),
  },
  { path: '/timetable', name: 'Timetable', component: () => import('../views/Comitee.vue') },
  { path: '/records', name: 'Records', component: () => import('../views/Comitee.vue') },
  { path: '/pictures', name: 'Pictures', component: () => import('../views/Comitee.vue') },
  { path: '/sponsor', name: 'Sponsor', component: () => import('../views/Comitee.vue') },
  { path: '/meets', name: 'Meets', component: () => import('../views/Meets/index.vue') },
  { path: '/join', name: 'Join', component: () => import('../views/Comitee.vue') },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})
