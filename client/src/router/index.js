import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import NewPlan from '../views/NewPlan'
import EditPlan from '../views/EditPlan'
import ViewPlan from '../views/ViewPlan'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				path: '/plan/new',
				name: 'NewPlan',
				component: NewPlan
			},
			{
				path: '/plan/edit/:id',
				name: 'EditPlan',
				component: EditPlan,
				props: true
			},
			{
				path: '/plan/:id',
				name: 'ViewPlan',
				component: ViewPlan,
				props: true
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
