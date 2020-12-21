import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'

import Vuesax from 'vuesax'

import * as VueGoogleMaps from 'vue2-google-maps'

// Use Vuesax UI framework
import 'vuesax/dist/vuesax.css'
Vue.use(Vuesax, {
	// Options
	/*   colors: {
    primary: 'rgb(23, 201, 100)',
    success: 'rgb(91, 60, 196)'
  } */
})

// User vue-cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// Use vue2-google-maps for GoogleMapAPI
Vue.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_GMAP_API_KEY,
		libraries: 'places, directions'
	}
})

Vue.config.productionTip = false

new Vue({
	router,
	store: store,
	render: (h) => h(App)
}).$mount('#app')
