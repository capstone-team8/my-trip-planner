const express = require('express')
const router = express.Router()

const planMaker = require('../modules/planMaker')

// 일정 생성 엔드포인트
router.put('/make', (req, res) => {
	let places = req.body.places
	const days = req.body.days
	const planPlaceIds = planMaker.createPath(places, days)

	const oriIds = places.map(el => el.place_id)
	let planPlaces = []
	for (dayPlaceIds of planPlaceIds) {
		let dayPlaces = []
		for (placeId of dayPlaceIds) {
			const i = oriIds.indexOf(placeId)
			dayPlaces.push(places[i])
		}

		planPlaces.push(dayPlaces)
	}

	res.status(200).json(planPlaces)
})

module.exports = router
