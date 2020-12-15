import axios from 'axios'

export default {
	sendGetRequest: async (endPoint, params) => {
		const url = process.env.VUE_APP_API_DOMAIN + endPoint
		try {
			const res = await axios.get(url, {
				params: params
			})

			return res.data
		} catch (error) {
			throw error
		}
	},
	sendPutRequest: async (endPoint, data) => {
		const url = process.env.VUE_APP_API_DOMAIN + endPoint
		try {
			const res = await axios.put(url, data)

			return res.data
		} catch (error) {
			throw error
		}
	},
	sendPostRequest: async (endPoint, data) => {
		const url = process.env.VUE_APP_API_DOMAIN + endPoint
		try {
			const res = await axios.post(url, data)

			return res.data
		} catch (error) {
			throw error
		}
	}
}
