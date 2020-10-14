const { Client } = require('@googlemaps/google-maps-services-js')

const key = require('../config/key')

const gmClient = new Client({})

const search = async (text) => {
	try {
		const result = await gmClient.textSearch({
			params: { query: text, language: 'ko', key: key.GOOGLE_MAPS_API_KEY }
        })
        
        return {locations: result.data.results}
	} catch (error) {
		return error
	}
}

module.exports = {
	search: search
}
