//預設
import Vue from 'vue'
import VueRouter from 'vue-router'

//框架
import ElementUI from 'element-ui'
import EleZhTW from 'element-ui/lib/locale/lang/zh-TW'//引入繁體

//css
import '../assets/css/normalize.css' //基礎樣式
import '../assets/css/ele_index.css' //修改框架樣式
import '../assets/css/main.css' //es樣式
import '../assets/css/ani.css' //es樣式
import '../assets/css/rwd.css' //es樣式

//js
import ESjs from '../assets/js/main.js'

//排版
import layout from '../layout/body.vue'

Vue.use(VueRouter)
Vue.use(ElementUI, {EleZhTW})
Vue.use(ESjs)

const routes = [
	{
		path: '/',
		name: 'layout',
		component: layout,
		redirect: '/homefunc',
		children: [
			{
				path: '/homefunc',
				name: 'HomeFunc',
				component: () => import('../pages/HomeFunc.vue')
			},{
				path: '/stationlist',
				name: 'stationList',
				component: () => import('../pages/stationList.vue')
			},{
				path: '/stationGraphic',
				name: 'stationGraphic',
				component: () => import('../pages/stationGraphic.vue')
			},{
				path: '/alertOverview',
				name: 'alertOverview',
				component: () => import('../pages/alertOverview.vue')
			},{
				path: '/chartOverview',
				name: 'chartOverview',
				component: () => import('../pages/chartOverview.vue')
			},{
				path: '/reportOverview',
				name: 'reportOverview',
				component: () => import('../pages/reportOverview.vue')
			},{
				path: '/dispatch',
				name: 'dispatch',
				component: () => import('../pages/dispatch.vue')
			},{
				path: '/jump_station',
				name: 'jumpStation',
				component: () => import('../pages/jumpStation.vue')
			}
		]
	},{
		path: '/login',
		component: () => import('../pages/login.vue')
	},{
		path: "/logout",
		component: {
			render(c) {
				this.axios.get("/logout").
				finally(
					function(){
					window.location.href = "/login"
					}
				)
			}
		}
	},{
		path: '/show',
		component: () => import('../layout/show.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	routes,
})

export default router
