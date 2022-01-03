import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/about',
    name: 'AboutView',
    component: () => import('../views/About/index.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('../views/About/About.vue'),
      },
      {
        path: 'location',
        name: 'location',
        component: () => import('../views/About/Location.vue'),
      },
      {
        path: 'comitee',
        name: 'Comitee',
        component: () => import('../views/About/Comitee.vue'),
      },
      {
        path: 'members',
        name: 'Members',
        component: () => import('../views/About/Members.vue'),
      },
      {
        path: 'trainers',
        name: 'Trainers',
        component: () => import('../views/About/Trainers.vue'),
      },
      {
        path: 'volunteer',
        name: 'Volunteer',
        component: () => import('../views/About/Volunteer.vue'),
      },
    ],
  },
  { path: '/timetable', name: 'Timetable', component: () => import('../views/About/index.vue') },
  { path: '/records', name: 'Records', component: () => import('../views/About/index.vue') },
  { path: '/pictures', name: 'Pictures', component: () => import('../views/About/index.vue') },
  { path: '/sponsor', name: 'Sponsor', component: () => import('../views/About/index.vue') },
  { path: '/meets', name: 'Meets', component: () => import('../views/About/index.vue') },
  { path: '/join', name: 'Join', component: () => import('../views/About/index.vue') },
]
// ! TODO update paths

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})
