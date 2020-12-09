import Vue from 'vue'
import VueRouter from './kvue-router'
import Home from '../views/Home.vue'
// 1.use一下
// use会调用VueRouter.install(Vue)方法
Vue.use(VueRouter)

// 2.声明路由表

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

// 3.创建一个Router实例
const router = new VueRouter({
  routes
})

export default router
