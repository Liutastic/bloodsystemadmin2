import Vue from 'vue'
import Router from 'vue-router'
// import Home from '../views/Home.vue'

import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'el-icon-view' }
      }
    ]
  },
  {
    path: '/volunteer',
    name: '志愿者管理',
    component: Layout,
    children: [
      {
        path: '/volunteer/table',
        name: 'volunteer',
        component: () => import('@/views/volunteer/index'),
        meta: { title: '志愿者管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/cbctest',
    name: '血常规检验项管理',
    component: Layout,
    children: [
      {
        path: '/cbctest',
        name: 'cbctest',
        component: () => import('@/views/cbcTest/index'),
        meta: { title: '血常规检验项管理', icon: 'el-icon-user' }
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
