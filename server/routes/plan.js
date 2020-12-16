const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Plan = require('../models/Plan')
const Place = require('../models/Place')

const { auth } = require('../middleware/auth')

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

// Get all plans with members
router.get('/', async (req, res) => {
	try {
		const plans = await Plan.findAll({ where: req.query })

		result = []
		for (plan of plans) {
			let planData = plan.get({ plain: true })
			planData.members = []

			const members = await plan.getUsers()
			for (member of members) planData.members.push(member.nickname)

			result.push(planData)
		}

		res.json(result)
	} catch (err) {
		console.error(err)
		res.status(400).send(err)
	}
})

// Get a plan with authenticated user
router.get('/auth', auth, async (req, res) => {
	if (req.query.id) {
		try {
			const plan = await Plan.findOne({ where: { id: req.query.id } })
			const users = await plan.getUsers()

			// Check if current user has the plan
			let hasAuthority = false
			for (const user of users) if (user.id == req.user.id) hasAuthority = true

			// Set planOptions
			const planOptions = {
				name: plan.name,
				nights: plan.days - 1,
				isHotel: 0
			}

			// Set planData & locationsSelected
			let planData = []
			for (let i = 0; i < plan.days; ++i) planData.push([])
			let locationsSelected = []
			const places = await plan.getPlaces()
			for (const place of places) {
				const placeData = {
					name: place.name,
					type: place.type,
					geometry: {
						location: {
							lat: place.lat,
							lng: place.lng
						}
					},
					place_id: place.place_id,
					formatted_address: place.formatted_address
				}

				planData[place.day - 1].push(placeData)
				locationsSelected.push(placeData)
			}

			// Set members
			let members = []
			for (const user of users) {
				members.push({ name: user.name, nickname: user.nickname })
			}

			return res.send({
				success: true,
				hasAuthority: hasAuthority,
				planOptions: planOptions,
				members: members,
				locationsSelected: locationsSelected,
				planData: planData
			})
		} catch {
			return res.send({ success: false })
		}
	} else {
		// No query. find all plans corresponding to the user
		const user = req.user
		const plans = await user.getPlans()

		result = []
		for (plan of plans) {
			let planData = plan.get({ plain: true })
			planData.members = []

			const members = await plan.getUsers()
			for (member of members) planData.members.push(member.nickname)

			result.push(planData)
		}

		return res.send(result)
	}
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

	res.status(200).send({ success: true, id: plan.id })
})

// Update a plan
router.put('/', async (req, res) => {
	// Set the general info
	let plan = await Plan.findOne({ where: { id: req.body.id } })
	plan.name = req.body.name
	plan.days = req.body.days
	plan = await plan.save()

	// Reset places and members
	const oldUsers = await plan.getUsers()
	plan.removeUsers(oldUsers)
	const oldPlaces = await plan.getPlaces()
	for (oldPlace of oldPlaces) {
		await oldPlace.destroy()
	}

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

// Set the plan's isShared as true
router.put('/is-shared', async (req, res) => {
	const plan = await Plan.findOne({ where: { id: req.body.id } })
	plan.isShared = true
	await plan.save()

	res.json({ success: true })
})

module.exports = router
