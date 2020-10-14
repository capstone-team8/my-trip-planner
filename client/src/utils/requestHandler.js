import axios from 'axios'

export default {
	sendRequest: async (text) => {
		try {
			const url = process.env.VUE_APP_API_DOMAIN + '/location/search'
			const res = await axios.get(url, {
				params: { text: text }
			})

			return res.data
		} catch (error) {
			throw error
		}
	}
}
