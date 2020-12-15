const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { auth } = require('../middleware/auth')

// Get the current auth state
router.get('', auth, (req, res) => {
	res.json({
		isAuth: true,
		userId: req.user.id,
		username: req.user.name,
		nickname: req.user.nickname
	})
})

// Logout the current user with x_auth cookie
router.get('/logout', auth, (req, res) => {
	req.user.removeToken((err, result) => {
		return res.json(result)
	})
})

// Login with username and password
router.post('/login', async (req, res) => {
	// Check if the body contains username and password
	if (!req.body.username || !req.body.password) {
		return res.json({
			success: false,
			message: "The request doesn't contain username and password."
		})
	}

	// Find the username from DB
	const user = await User.findOne({ where: { name: req.body.username } })
	if (!user) {
		// User not exists
		return res.json({
			success: false,
			message: "There's no user corresponding to the id."
		})
	}

	// Check if the password matches
	user.comparePassword(req.body.password, (err, isMatch) => {
		if (!isMatch) {
			// The password doesn't match
			return res.json({
				success: false,
				message: 'Wrong password.'
			})
		}

		// All values are valid
		// Create a token for the user
		user.generateToken((err, user) => {
			if (err) res.status(400).send(err)

			// Login success
			// Save the token into cookies and send the response
			res.cookie('x_auth', user.token).status(200).json({
				success: true,
				userId: user.id,
				username: user.name,
				nickname: user.nickname,
				x_auth: user.token
			})
		})
	})
})

module.exports = router
