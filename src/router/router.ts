import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
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
  {
    path: '/schedule',
    name: 'Simetable',
    component: () => import('../views/Schedule/index.vue'),
    children: [
      {
        path: '',
        name: 'Schedule',
        component: () => import('../views/Schedule/Schedule.vue'),
      },
      {
        path: 'meets',
        name: 'MeetInfo',
        component: () => import('../views/Schedule/MeetInfo.vue'),
      },
    ],
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('../views/Records/index.vue'),
    children: [
      {
        path: '',
        name: 'Total',
        component: () => import('../views/Records/Total.vue'),
      },
      {
        path: 'squat',
        name: 'Squat',
        component: () => import('../views/Records/Squat.vue'),
      },
      {
        path: 'bench',
        name: 'Bench',
        component: () => import('../views/Records/Bench.vue'),
      },
      {
        path: 'deadlift',
        name: 'Deadlift',
        component: () => import('../views/Records/Deadlift.vue'),
      },
    ],
  },
  { path: '/pictures', name: 'Pictures', component: () => import('../views/Pictures/index.vue') },
  { path: '/sponsor', name: 'Sponsor', component: () => import('../views/About/Comitee.vue') },
  {
    path: '/meets',
    name: 'Meets',
    component: () => import('../views/Meets/index.vue'),
    children: [
      {
        path: '',
        name: 'UpcommingMeets',
        component: () => import('../views/Meets/UpcommingMeets.vue'),
      },
      {
        path: 'previousMeets',
        name: 'PreviousMeets',
        component: () => import('../views/Meets/PreviousMeets.vue'),
      },
    ],
  },
  { path: '/join', name: 'Join', component: () => import('../views/Member/index.vue') },
  {
    // This is for path params
    path: '/faq/:qid',
    name: 'Faq',
    component: () => import('../views/Faq/index.vue'),
  },
  {
    path: '/faq',
    name: 'FaqView',
    component: () => import('../views/Faq/index.vue'),
    children: [
      {
        path: 'guidelines',
        name: 'Guidelines',
        component: () => import('../views/Faq/Guidelines.vue'),
      },
    ],
  },
  {
    path: '/points',
    name: 'Points',
    component: () => import('../views/Points/index.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }, // catch all use case
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
