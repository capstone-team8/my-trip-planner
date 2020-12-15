const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Plan = require('../models/Plan')
const Place = require('../models/Place')

const planMaker = require('../modules/planMaker')

// 일정 생성 엔드포인트
router.put('/make', (req, res) => {
	let places = req.body.places
	const days = req.body.days
	const planPlaceIds = planMaker.createPathWithoutHotels(places, days)

	const oriIds = places.map((el) => el.place_id)
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

// Get all plans
router.get('/', (req, res) => {
	Plan.findAll()
		.then((plans) => {
			res.json(plans)
		})
		.catch((err) => {
			console.error(err)
			res.send(err)
		})
})

// Create a new plan
router.post('/', async (req, res) => {
	// Set the general info
	let planInfo = { name: req.body.name, days: req.body.days }
	const plan = await Plan.create(planInfo)

	// Set places
	for (const day in req.body.places) {
		const dayPlaces = req.body.places[day]
		console.log('day', day)
		for (const i in dayPlaces) {
			const placeData = dayPlaces[i]
			const realDay = parseInt(day) + 1

			const placeInfo = {
				day: realDay,
				idx: i,
				name: placeData.name,
				type: placeData.type,
				lat: placeData.geometry.location.lat,
				lng: placeData.geometry.location.lng,
				place_id: placeData.place_id,
				formatted_address: placeData.formatted_address
			}
			const place = await Place.create(placeInfo)

			// Set the place with the plan
			plan.addPlace(place)
		}
	}

	// Set members
	for (const memberData of req.body.members) {
		const member = await User.findOne({ where: { name: memberData.name } })

		// Set the member with the plan
		member.addPlan(plan)
	}

	res.status(200).send({ success: true })
})

module.exports = router
