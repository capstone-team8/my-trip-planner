import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Vuesax from 'vuesax'

// Use Vuesax UI framework
import 'vuesax/dist/vuesax.css'
Vue.use(Vuesax, {
  // Options
/*   colors: {
    primary: 'rgb(23, 201, 100)',
    success: 'rgb(91, 60, 196)'
  } */
})

Vue.config.productionTip = false

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')
