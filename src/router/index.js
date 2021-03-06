import Vue from 'vue'
import Router from 'vue-router'
import Home from './../components/home'
import Main from  './../components/main/main'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component:Home
    },
    {
      path:'/main',
      name:'main',
      component:Main
    }
  ]
})
