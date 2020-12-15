const User = require('../models/User')
const { use } = require('../routes/auth')

let auth = (req, res, next) => {
	// Process authentication
	// Get a token from the client cookies
	let token = req.cookies.x_auth
	if (!token) {
		token = req.headers.x_auth
	}

	// Decode the token and find the user
	User.findByToken(token, (err, user) => {
		if (err) throw err

		if (!user) {
			return res.status(400).json({
				isAuth: false,
				error: true
			})
		}

		// User exists
		// Check if the token has been expired
		const timeNow = Math.floor(new Date().getTime() / 1000)
		if (user.tokenExp < timeNow) {
			// The token has been expired
			// Delete the token and send an error
			user.removeToken((err, result) => {
				if (err) throw err

				return res.json({
					isAuth: false,
					error: false,
					message: 'The token has been expired',
					isTokenDeleted: result.success
				})
			})
		} else {
			// Auth success
			req.token = token
			req.user = user
			next()
		}
	})
}

module.exports = { auth }
