import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', alias: '/home', name: 'home', component: () => import('../components/Homepage.vue') }, 
    { path: '/favorites', alias: '/favorites', name: 'favorites', component: () => import('../components/Favorites.vue') }, 
    { path: '/:noPage(.*)', name: 'noPage', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;