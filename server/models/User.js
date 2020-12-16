const { DataTypes } = require('sequelize')
const db = require('../config/database')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Plan = require('./Plan')

const TOKEN = require('../constants').TOKEN

const User = db.define('user', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	nickname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	token: {
		type: DataTypes.STRING
	},
	tokenExp: {
		type: DataTypes.INTEGER
	}
})
// User belongs to many Plan (M:N)
User.belongsToMany(Plan, { through: 'userPlans' })
Plan.belongsToMany(User, { through: 'userPlans' })

// Encrypt the password before save
User.beforeSave(async (user) => {
	// Encrypt the password if the password has been modified
	if (user.changed('password')) {
		// Generate the salt
		const saltRounds = 10 // # characters of the salt

		try {
			const salt = await bcrypt.genSalt(saltRounds)
			const hash = await bcrypt.hash(user.password, salt)

			user.password = hash
			console.log('hash:', hash)
		} catch (error) {
			throw error
		}
	}
})

// Compare a given password with the password from DB
User.prototype.comparePassword = function (plainPassword, cb) {
	// compare the password with the encrypted password
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err)

		cb(null, isMatch)
	})
}

// Generate a token for the user
User.prototype.generateToken = function (cb) {
	// Generate a token with jsonwebtoken
	const token = jwt.sign(JSON.stringify(this.id), TOKEN.KEY)
	this.token = token

	// Set the token expiration time
	const tokenExp = Math.floor(new Date().getTime() / 1000) + TOKEN.EXP_SECS
	this.tokenExp = tokenExp

	// Save the DB element
	this.save()
		.then((self) => {
			cb(null, self)
		})
		.catch((err) => {
			return cb(err)
		})
}

// Remove the previously generated token
User.prototype.removeToken = function (cb) {
	this.token = null
	this.tokenExp = null

	// Save the DB element
	this.save()
		.then((self) => {
			return cb(null, { success: true })
		})
		.catch((err) => {
			return cb(err)
		})
}

// Verify the user with the token
User.findByToken = async function (token, cb) {
	// Decode the token
	jwt.verify(token, TOKEN.KEY, (err, decoded) => {
		// Find the user with the id and the token
		User.findOne({ where: { id: decoded, token: token } }).then((user) => {
			if (!user) return cb(err)

			cb(null, user)
		})
	})
}

module.exports = User
