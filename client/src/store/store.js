import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		user: {
			id: undefined,
			name: undefined,
			nickname: undefined
		}
	}
})
