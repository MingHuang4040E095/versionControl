import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: { name: 'Home' },
    },
    {
        path: '/login',
        name: 'Login',
        props: true,
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/page=:page',
        name: 'Home',
        props: true,
        component: Home,
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        props: true,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Detail.vue'),
    },
    {
        path: '/git/:id',
        name: 'Git',
        props: (route) => ({
            // name: route.query.name,
            // id: route.params.id,
            ...route.query,
            ...route.params,
        }),
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Git.vue'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
