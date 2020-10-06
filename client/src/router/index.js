import Vue from 'vue'
import VueRouter from 'vue-router'
import NewPlan from '../views/NewPlan'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'NewPlan',
    component: NewPlan
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
