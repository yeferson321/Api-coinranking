import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', alias: '/home', name: 'Home', component: () => import('../components/Section.vue') }, 
    { path: '/:noPage(.*)', name: 'noPage', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;