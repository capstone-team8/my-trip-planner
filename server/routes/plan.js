const express = require('express')
const router = express.Router()

const planMaker = require('../modules/planMaker')

// 일정 생성 엔드포인트
router.put('/make', (req, res) => {
	let places = req.body.places
	const days = req.body.days
	console.log(places)
	console.log(days)
	const planPlaceIds = planMaker.createPathWithoutHotels(places, days)

	const oriIds = places.map(el => el.place_id)
	let planPlaces = []
	for (placeId of planPlaceIds) {
		const i = oriIds.indexOf(placeId)
		planPlaces.push(places[i])
	}

	res.status(200).json(planPlaces)
})

module.exports = router
